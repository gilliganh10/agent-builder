"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Bot, ChevronDown, ChevronUp, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AgentChatMessage,
  AgentConversationGoalState,
} from "@/db/agents/schema";
import { ChatBubble, type RenderableChatEntry } from "@/components/chat/ChatBubble";
import { ConversationStatePanel } from "@/components/chat/ConversationStatePanel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RewriteInfo {
  original: string;
  rewritten: string;
  explanation?: string;
  nodeId: string;
}

export interface ChatEntry {
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

export interface ChatSendResult {
  sessionId?: string;
  messages: AgentChatMessage[];
  rewrites?: RewriteInfo[];
  error?: string;
  state?: Record<string, unknown>;
  goals?: AgentConversationGoalState[];
  locks?: string[];
}

export interface ChatUIProps {
  onSend: (
    message: string,
    sessionId: string | undefined
  ) => Promise<ChatSendResult>;
  agentName?: string;
  isConversational?: boolean;
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatUI({
  onSend,
  agentName = "Agent",
  isConversational = false,
  compact = false,
}: ChatUIProps) {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [currentState, setCurrentState] = useState<Record<string, unknown> | null>(null);
  const [currentGoals, setCurrentGoals] = useState<AgentConversationGoalState[]>([]);
  const [currentLocks, setCurrentLocks] = useState<string[]>([]);
  const [prevState, setPrevState] = useState<Record<string, unknown> | null>(null);
  const [showStatePanel, setShowStatePanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const sendMessage = useCallback(
    async (text: string) => {
      setEntries((prev) => [...prev, { role: "user", content: text }]);
      setLoading(true);

      try {
        const result = await onSend(text, sessionId);

        if (result.sessionId && !sessionId) {
          setSessionId(result.sessionId);
        }

        if (result.error) {
          setEntries((prev) => [
            ...prev,
            { role: "error", content: result.error! },
          ]);
          return;
        }

        const newEntries: ChatEntry[] = [];

        // If there are rewrites, replace the user message with a rewritten entry
        if (result.rewrites && result.rewrites.length > 0) {
          const rewrite = result.rewrites[0];
          setEntries((prev) => {
            const updated = [...prev];
            const lastUserIdx = updated.findLastIndex((e) => e.role === "user");
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

        if (result.messages.length === 0) {
          newEntries.push({ role: "agent", content: "No response." });
        } else {
          for (const m of result.messages) {
            const isSystemMsg = m.displayName === "System";
            newEntries.push({
              role: isSystemMsg ? "system" : "agent",
              content: m.content,
              ...(m.secondaryContent ? { secondaryContent: m.secondaryContent } : {}),
              structuredContent: m.structuredContent,
              displayName: m.displayName,
              displayColor: m.displayColor,
              displaySide: m.displaySide,
            });
          }
        }

        if (result.state !== undefined) {
          setPrevState(currentState);
          setCurrentState(result.state ?? null);
          if (!showStatePanel) setShowStatePanel(true);
        }
        if (result.goals !== undefined) {
          setCurrentGoals(result.goals);
          if (result.goals.length > 0 && !showStatePanel) setShowStatePanel(true);
        }
        if (result.locks !== undefined) {
          setCurrentLocks(result.locks);
        }

        setEntries((prev) => [...prev, ...newEntries]);
      } catch {
        setEntries((prev) => [
          ...prev,
          { role: "error", content: "Failed to reach the server." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [currentState, onSend, sessionId, showStatePanel]
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

  const clearChat = useCallback(() => {
    setEntries([]);
    setSessionId(undefined);
    setCurrentState(null);
    setCurrentGoals([]);
    setCurrentLocks([]);
    setPrevState(null);
  }, []);

  return (
    <div className={`flex flex-col ${compact ? "h-full" : "flex-1"}`}>
      {/* Messages area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-3 space-y-3 ${compact ? "py-2 max-h-60" : "py-4"}`}
      >
        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Bot className="h-8 w-8 mb-2 text-muted-foreground opacity-40" />
            <p className="text-xs text-muted-foreground">
              Send a message to {agentName}
            </p>
            {isConversational && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Conversation context is preserved across messages
              </p>
            )}
          </div>
        )}

        {entries.map((entry, i) => (
          <ChatBubble key={i} entry={entry} compact={compact} />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      {/* Live state panel: variables + goals for debugging */}
      {(currentState !== null || currentGoals.length > 0) && (
        <div className="border-t border-border px-3 py-1.5 bg-muted/30 space-y-2">
          <button
            onClick={() => setShowStatePanel((v) => !v)}
            className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground"
          >
            <Database className="h-3 w-3" />
            State & goals
            {showStatePanel ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronUp className="h-2.5 w-2.5" />}
          </button>
          {showStatePanel && (
            <ConversationStatePanel
              state={currentState}
              previousState={prevState}
              goals={currentGoals}
              locks={currentLocks}
              compact
              title="State & goals"
              description="Live state for the current test conversation."
              emptyTitle="No state yet"
              emptyBody="Variables and goals will appear here after the conversation updates them."
            />
          )}
        </div>
      )}

      {/* Input bar */}
      <div className={`border-t border-border px-3 ${compact ? "py-1.5" : "py-2"}`}>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-md border bg-background px-3 py-1.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[32px] max-h-[80px]"
            disabled={loading}
          />
          <Button
            size="icon"
            className="h-8 w-8 shrink-0 bg-[#222E50] hover:bg-[#222E50]/90"
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clearChat}
            className="text-[10px] text-muted-foreground hover:text-foreground mt-1"
          >
            Clear chat
          </button>
        )}
      </div>
    </div>
  );
}
