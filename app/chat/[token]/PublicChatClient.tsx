"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
} from "react";
import {
  Bot,
  Loader2,
  PanelRightClose,
  Send,
  Settings2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  AgentChatMessage,
  AgentConversationGoalState,
  AgentMode,
  EnvVarDefinition,
} from "@/db/agents/schema";
import {
  ChatBubble,
  type RenderableChatEntry,
} from "@/components/chat/ChatBubble";
import { ConversationStatePanel } from "@/components/chat/ConversationStatePanel";
import { cn } from "@/lib/utils";
import {
  postAgentRunStream,
  type StreamCallbacks,
} from "@/lib/agents/streaming/client";
import type {
  MessagePayload,
  DeltaPayload,
  DonePayload,
  ReadyPayload,
} from "@/lib/agents/streaming/types";
import {
  parseFlowRunOutput,
  eventsToMessages,
  extractRewrites,
} from "@/lib/agents/flow/output";
import { buildConversationStatePayload } from "@/lib/agents/public-chat";
import {
  createStreamReveal,
  type StreamRevealController,
} from "@/lib/chat/stream-reveal";
import {
  SHELL_PERCY_DEFAULT_WIDTH,
  clampShellPercyWidth,
} from "@/components/shell/shell-layout";

interface PublicChatClientProps {
  token: string;
  agentName: string;
  mode: AgentMode;
  envVars?: EnvVarDefinition[];
  showStateSidebar?: boolean;
}

interface ChatEntry {
  role: RenderableChatEntry["role"];
  content: string;
  secondaryContent?: string;
  structuredContent?: AgentChatMessage["structuredContent"];
  originalContent?: string;
  explanation?: string;
  displayName?: string;
  displayColor?: string;
  displaySide?: "left" | "right";
}

interface RewriteInfo {
  original: string;
  rewritten: string;
  explanation?: string;
  nodeId: string;
}

const PUBLIC_CHAT_RAIL_STORAGE_KEY = "public-chat-rail-open";
const PUBLIC_CHAT_RAIL_WIDTH_STORAGE_KEY = "public-chat-rail-width";
const DESKTOP_BREAKPOINT = 1024;

function readRailOpen(token: string, defaultValue: boolean) {
  if (typeof window === "undefined") return defaultValue;
  const stored = window.localStorage.getItem(`${PUBLIC_CHAT_RAIL_STORAGE_KEY}:${token}`);
  if (stored === null) return defaultValue;
  return stored === "true";
}

function readRailWidth(token: string) {
  if (typeof window === "undefined") return SHELL_PERCY_DEFAULT_WIDTH;
  const raw = window.localStorage.getItem(`${PUBLIC_CHAT_RAIL_WIDTH_STORAGE_KEY}:${token}`);
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : SHELL_PERCY_DEFAULT_WIDTH;
}

export function PublicChatClient({
  token,
  agentName,
  mode,
  envVars = [],
  showStateSidebar = false,
}: PublicChatClientProps) {
  const hasRailContent = showStateSidebar || envVars.length > 0;
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [currentState, setCurrentState] = useState<Record<string, unknown> | null>(
    showStateSidebar ? {} : null,
  );
  const [previousState, setPreviousState] = useState<Record<string, unknown> | null>(null);
  const [currentGoals, setCurrentGoals] = useState<AgentConversationGoalState[]>([]);
  const [currentLocks, setCurrentLocks] = useState<string[]>([]);
  const [showMobileRail, setShowMobileRail] = useState(false);
  const [railOpen, setRailOpen] = useState(() => readRailOpen(token, hasRailContent));
  const [railWidth, setRailWidth] = useState(() => readRailWidth(token));
  const [isResizingRail, setIsResizingRail] = useState(false);
  const [envOverrides, setEnvOverrides] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    for (const v of envVars) {
      if (v.default !== undefined) defaults[v.key] = v.default;
    }
    return defaults;
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestEpochRef = useRef(0);
  const autoScrollRef = useRef(true);
  const railResizingRef = useRef(false);
  const railStartXRef = useRef(0);
  const railStartWidthRef = useRef(railWidth);

  useEffect(() => {
    if (!hasRailContent) return;
    window.localStorage.setItem(`${PUBLIC_CHAT_RAIL_STORAGE_KEY}:${token}`, String(railOpen));
  }, [hasRailContent, railOpen, token]);

  useEffect(() => {
    if (!hasRailContent) return;
    window.localStorage.setItem(`${PUBLIC_CHAT_RAIL_WIDTH_STORAGE_KEY}:${token}`, String(railWidth));
  }, [hasRailContent, railWidth, token]);

  useEffect(() => {
    if (!hasRailContent && railOpen) {
      setRailOpen(false);
    }
  }, [hasRailContent, railOpen]);

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const clamped = clampShellPercyWidth(railWidth, viewportWidth, 0);
    if (clamped !== railWidth) {
      setRailWidth(clamped);
    }
  }, [railWidth]);

  useEffect(() => {
    const textarea = composerRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  useEffect(() => {
    if (!autoScrollRef.current) return;
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [entries, loading]);

  useEffect(() => {
    if (typeof window === "undefined" || !isResizingRail) return;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (event: PointerEvent) => {
      const delta = railStartXRef.current - event.clientX;
      setRailWidth(
        clampShellPercyWidth(
          railStartWidthRef.current + delta,
          window.innerWidth,
          0,
        ),
      );
    };

    const stopResizing = () => {
      railResizingRef.current = false;
      setIsResizingRail(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);

    return () => {
      stopResizing();
    };
  }, [isResizingRail]);

  const handleTranscriptScroll = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    autoScrollRef.current = distanceFromBottom < 96;
  }, []);

  const openRail = useCallback(() => {
    if (!hasRailContent) return;
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      setShowMobileRail(true);
      return;
    }
    setRailOpen(true);
  }, [hasRailContent]);

  const startRailResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      railResizingRef.current = true;
      railStartXRef.current = event.clientX;
      railStartWidthRef.current = railWidth;
      setIsResizingRail(true);
    },
    [railWidth],
  );

  const applyStatePayload = useCallback(
    (payload: {
      state?: Record<string, unknown>;
      goals?: AgentConversationGoalState[];
      locks?: string[];
    }) => {
      if (!showStateSidebar) {
        return;
      }

      setPreviousState(currentState);
      setCurrentState(payload.state ?? {});
      setCurrentGoals(payload.goals ?? []);
      setCurrentLocks(payload.locks ?? []);
    },
    [currentState, showStateSidebar],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      autoScrollRef.current = true;
      setEntries((prev) => [...prev, { role: "user", content: text }]);
      setLoading(true);
      const requestEpoch = ++requestEpochRef.current;
      const isStale = () => requestEpoch !== requestEpochRef.current;

      let streamedContent = "";
      let streamedRunId: string | undefined;
      let reveal: StreamRevealController | undefined;

      const applyRevealed = (displayed: string) => {
        setEntries((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "agent") {
            return [...prev.slice(0, -1), { ...last, content: displayed }];
          }
          return [...prev, { role: "agent" as const, content: displayed }];
        });
      };

      try {
        const url = `/api/public/chat/${token}`;
        const body = {
          message: text,
          sessionId,
          envOverrides:
            Object.keys(envOverrides).length > 0 ? envOverrides : undefined,
        };

        reveal = createStreamReveal({ apply: applyRevealed, isStale });

        const callbacks: StreamCallbacks = {
          onEvent(envelope) {
            if (isStale()) return;

            switch (envelope.type) {
              case "ready": {
                const p = envelope.payload as ReadyPayload;
                streamedRunId = p.runId || envelope.runId || undefined;
                break;
              }

              case "delta": {
                const d = envelope.payload as DeltaPayload;
                if (d.lane === "sidecar") break;
                if (!streamedRunId && d.runId) streamedRunId = d.runId;
                streamedContent += d.text;
                setLoading(false);
                reveal?.setTarget(streamedContent);
                break;
              }

              case "message": {
                const p = envelope.payload as MessagePayload;
                if (p.lane === "sidecar") break;
                streamedContent = p.content;
                setLoading(false);
                reveal?.setTarget(streamedContent);
                break;
              }

              case "done": {
                reveal?.cancel();
                const p = envelope.payload as DonePayload;
                if (p.sessionId) setSessionId(p.sessionId);

                const flowOutput = parseFlowRunOutput(p.finalOutput);
                if (flowOutput) {
                  const messages = eventsToMessages(flowOutput.events);
                  const rewrites = extractRewrites(flowOutput.events);

                  if (rewrites.length > 0) {
                    const rewrite = rewrites[0];
                    setEntries((prev) => {
                      const updated = [...prev];
                      const lastUserIdx = updated.findLastIndex(
                        (e) => e.role === "user" || e.role === "user_rewritten",
                      );
                      if (lastUserIdx >= 0) {
                        updated[lastUserIdx] = {
                          role: "user_rewritten",
                          content: rewrite.rewritten,
                          originalContent: rewrite.original,
                          explanation: rewrite.explanation,
                        };
                      }
                      return updated;
                    });
                  }

                  if (showStateSidebar) {
                    const statePayload = buildConversationStatePayload(
                      flowOutput.orchestratorState,
                    );
                    applyStatePayload(statePayload);
                  }

                  const finalEntries: ChatEntry[] = messages.map((m) => ({
                    role:
                      m.displayName === "System"
                        ? ("system" as const)
                        : ("agent" as const),
                    content: m.content,
                    ...(m.secondaryContent
                      ? { secondaryContent: m.secondaryContent }
                      : {}),
                    structuredContent: m.structuredContent,
                    displayName: m.displayName,
                    displayColor: m.displayColor,
                    displaySide: m.displaySide,
                  }));

                  setEntries((prev) => {
                    const last = prev[prev.length - 1];
                    const withoutStreaming =
                      last?.role === "agent" && streamedContent.length > 0
                        ? prev.slice(0, -1)
                        : prev.filter(
                            (e) =>
                              !(
                                e.role === "agent" &&
                                e.content === streamedContent &&
                                streamedContent
                              ),
                          );
                    return [...withoutStreaming, ...finalEntries];
                  });
                } else if (p.finalOutput) {
                  setEntries((prev) => {
                    const last = prev[prev.length - 1];
                    if (last?.role === "agent") {
                      return [
                        ...prev.slice(0, -1),
                        { ...last, content: p.finalOutput! },
                      ];
                    }
                    return [
                      ...prev,
                      { role: "agent" as const, content: p.finalOutput! },
                    ];
                  });
                }
                break;
              }

              case "error": {
                reveal?.cancel();
                const p = envelope.payload as { message: string };
                setEntries((prev) => [
                  ...prev,
                  { role: "error", content: p.message },
                ]);
                break;
              }
            }
          },
        };

        const result = await postAgentRunStream(url, body, callbacks, {
          signal: controller.signal,
        });

        if (result.json) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = result.json as any;
          if (data.sessionId) setSessionId(data.sessionId);

          if (data.error) {
            setEntries((prev) => [
              ...prev,
              { role: "error", content: data.error },
            ]);
          } else {
            applyStatePayload({
              state: data.state,
              goals: data.goals,
              locks: data.locks,
            });

            const rewrites: RewriteInfo[] = data.rewrites ?? [];
            if (rewrites.length > 0) {
              const rewrite = rewrites[0];
              setEntries((prev) => {
                const updated = [...prev];
                const lastUserIdx = updated.findLastIndex(
                  (entry) => entry.role === "user",
                );
                if (lastUserIdx >= 0) {
                  updated[lastUserIdx] = {
                    role: "user_rewritten",
                    content: rewrite.rewritten,
                    originalContent: rewrite.original,
                    explanation: rewrite.explanation,
                  };
                }
                return updated;
              });
            }

            const messages: AgentChatMessage[] = data.messages ?? [];
            if (messages.length === 0) {
              setEntries((prev) => [
                ...prev,
                { role: "agent", content: "No response." },
              ]);
            } else {
              setEntries((prev) => [
                ...prev,
                ...messages.map((message: AgentChatMessage) => ({
                  role:
                    message.displayName === "System"
                      ? ("system" as const)
                      : ("agent" as const),
                  content: message.content,
                  ...(message.secondaryContent
                    ? { secondaryContent: message.secondaryContent }
                    : {}),
                  structuredContent: message.structuredContent,
                  displayName: message.displayName,
                  displayColor: message.displayColor,
                  displaySide: message.displaySide,
                })),
              ]);
            }
          }
        }
      } catch (err) {
        reveal?.cancel();
        if ((err as Error).name === "AbortError") return;
        setEntries((prev) => [
          ...prev,
          { role: "error", content: "Failed to reach the server." },
        ]);
      } finally {
        reveal?.cancel();
        setLoading(false);
      }
    },
    [applyStatePayload, envOverrides, sessionId, showStateSidebar, token],
  );

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,46,80,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,241,243,0.96))]">
      <div className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 overflow-hidden px-4 py-4 md:px-6 md:py-6">
        <div className="flex min-h-0 w-full flex-1 gap-4 xl:gap-6">
          <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-border/70 bg-card/95 shadow-[0_18px_60px_rgba(34,46,80,0.08)]">
            <div
              ref={scrollRef}
              onScroll={handleTranscriptScroll}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6"
            >
              {entries.length === 0 ? (
                <div className="flex min-h-full flex-col items-center justify-center px-4 py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[22px] bg-primary/8 text-primary shadow-inner">
                    <Bot className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Start the conversation
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Ask {agentName} anything you want to test.
                  </p>
                  {mode === "conversational" ? (
                    <p className="mt-3 rounded-full border border-border/70 bg-muted/25 px-3 py-1 text-xs text-muted-foreground">
                      This agent keeps context across messages.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                  {entries.map((entry, i) => (
                    <ChatBubble key={i} entry={entry} />
                  ))}

                  {loading ? (
                    <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Thinking...
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <footer className="shrink-0 border-t border-border/70 bg-[linear-gradient(180deg,rgba(248,249,250,0.7),rgba(255,255,255,0.96))] px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-4xl items-end gap-3">
                <div className="flex-1 rounded-[24px] border border-border/70 bg-background/90 p-2 shadow-sm">
                  <Textarea
                    ref={composerRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className="min-h-[44px] max-h-40 resize-none border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0"
                    disabled={loading}
                  />
                </div>
                <Button
                  size="icon"
                  className="h-12 w-12 shrink-0 rounded-2xl shadow-sm"
                  onClick={handleSubmit}
                  disabled={!input.trim() || loading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </footer>
          </section>

          {hasRailContent ? (
            <aside
              aria-hidden={!railOpen}
              className={cn(
                "relative hidden h-full shrink-0 overflow-hidden rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(240,241,243,0.86),rgba(255,255,255,0.98))] shadow-[0_16px_46px_rgba(34,46,80,0.08)] lg:flex lg:flex-col",
                railOpen ? "opacity-100" : "pointer-events-none w-0 border-transparent opacity-0 shadow-none",
              )}
              style={{ width: railOpen ? `${railWidth}px` : 0 }}
            >
              {railOpen ? (
                <button
                  type="button"
                  aria-label="Resize conversation rail"
                  className="absolute bottom-0 left-0 top-0 z-10 w-4 -translate-x-1/2 cursor-col-resize touch-none"
                  onPointerDown={startRailResize}
                >
                  <span className="absolute left-1/2 top-1/2 h-24 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border/80 transition-colors hover:bg-primary/30" />
                </button>
              ) : null}
              <PublicChatRail
                showStateSidebar={showStateSidebar}
                currentState={currentState}
                previousState={previousState}
                currentGoals={currentGoals}
                currentLocks={currentLocks}
                envVars={envVars}
                envOverrides={envOverrides}
                setEnvOverrides={setEnvOverrides}
                onClose={() => setRailOpen(false)}
              />
            </aside>
          ) : null}
        </div>
      </div>

      {hasRailContent && !railOpen ? (
        <div className="pointer-events-none fixed bottom-0 right-0 z-30 hidden justify-end p-6 lg:flex">
          <Button
            type="button"
            size="lg"
            className="pointer-events-auto h-14 w-14 rounded-full shadow-lg shadow-primary/20"
            onClick={openRail}
            aria-label="Open conversation rail"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
        </div>
      ) : null}

      {hasRailContent ? (
        <Sheet open={showMobileRail} onOpenChange={setShowMobileRail}>
          <SheetContent side="right" className="gap-0 p-0 sm:max-w-md">
            <SheetHeader className="border-b border-border/70 bg-[linear-gradient(145deg,rgba(34,46,80,0.05),rgba(255,255,255,0.98)_52%,rgba(240,241,243,0.9))] px-4 py-4 text-left">
              <SheetTitle className="text-sm tracking-tight text-foreground">
                Conversation rail
              </SheetTitle>
              <SheetDescription className="text-xs">
                State updates and public settings live here.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <PublicChatRail
                showStateSidebar={showStateSidebar}
                currentState={currentState}
                previousState={previousState}
                currentGoals={currentGoals}
                currentLocks={currentLocks}
                envVars={envVars}
                envOverrides={envOverrides}
                setEnvOverrides={setEnvOverrides}
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}

function PublicChatRail({
  showStateSidebar,
  currentState,
  previousState,
  currentGoals,
  currentLocks,
  envVars,
  envOverrides,
  setEnvOverrides,
  onClose,
}: {
  showStateSidebar: boolean;
  currentState: Record<string, unknown> | null;
  previousState: Record<string, unknown> | null;
  currentGoals: AgentConversationGoalState[];
  currentLocks: string[];
  envVars: EnvVarDefinition[];
  envOverrides: Record<string, string>;
  setEnvOverrides: Dispatch<SetStateAction<Record<string, string>>>;
  onClose?: () => void;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="shrink-0 border-b border-border/60 bg-[linear-gradient(145deg,rgba(34,46,80,0.08),rgba(255,255,255,0.98)_56%,rgba(240,241,243,0.92))] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Conversation rail
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Follow state changes and adjust public settings without disturbing the transcript.
              </p>
            </div>
          </div>
          {onClose ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={onClose}
            >
              <PanelRightClose className="h-4 w-4" />
              <span className="sr-only">Close conversation rail</span>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {showStateSidebar ? (
            <div className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
              <ConversationStatePanel
                state={currentState}
                previousState={previousState}
                goals={currentGoals}
                locks={currentLocks}
                title="Conversation state"
                description="Variables and goals update here as the conversation progresses."
                emptyTitle="No state updates yet"
                emptyBody="Once this agent starts storing variables or goal progress, those updates appear here."
              />
            </div>
          ) : null}

          {envVars.length > 0 ? (
            <div className="rounded-[24px] border border-border/70 bg-card/90 p-4 shadow-sm">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                  <Settings2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-tight text-foreground">
                    Public settings
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    These values are sent with each message so you can test alternate public inputs without reopening the page.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {envVars.map((v) => (
                  <div key={v.key} className="space-y-1.5 rounded-2xl border border-border/60 bg-background/80 p-3">
                    <div className="space-y-1">
                      <label
                        className="block text-xs font-medium text-foreground"
                        title={v.description}
                      >
                        {v.label}
                      </label>
                      {v.description ? (
                        <p className="text-[11px] leading-5 text-muted-foreground">
                          {v.description}
                        </p>
                      ) : null}
                    </div>
                    {v.type === "enum" && v.enumValues ? (
                      <select
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                        value={envOverrides[v.key] ?? v.default ?? ""}
                        onChange={(e) =>
                          setEnvOverrides((prev) => ({
                            ...prev,
                            [v.key]: e.target.value,
                          }))
                        }
                      >
                        {v.enumValues.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        className="h-10 rounded-xl border-input bg-background shadow-none"
                        value={envOverrides[v.key] ?? v.default ?? ""}
                        onChange={(e) =>
                          setEnvOverrides((prev) => ({
                            ...prev,
                            [v.key]: e.target.value,
                          }))
                        }
                        placeholder={v.description}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
