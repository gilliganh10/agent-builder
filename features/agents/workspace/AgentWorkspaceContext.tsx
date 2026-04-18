"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type AgentDetailTabId,
  type BuilderSubtab,
  AGENT_DETAIL_TABS,
  isAgentDetailTabId,
  resolveBuilderSubtab,
} from "@/features/agents/agent-detail-tabs";
import type { AgentDefinition } from "@/db/agents/schema";

interface AgentWorkspaceContextValue {
  agent: AgentDefinition;

  // Tab navigation
  activeTab: AgentDetailTabId;
  switchTab: (tab: AgentDetailTabId) => void;
  builderSubtab: BuilderSubtab;
  switchBuilderSubtab: (sub: BuilderSubtab) => void;

  // Right panel (Test is its own builder sub-tab)
  rightPanelMode: "inspect" | "issues";
  setRightPanelMode: (mode: "inspect" | "issues") => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: boolean) => void;

  // Left sidebar
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;

  // Header/save state
  saving: boolean;
  setSaving: (s: boolean) => void;
  dirty: boolean;
  setDirty: (d: boolean) => void;
  validationErrors: string[];
  validationWarnings: string[];
  validationSuccess: boolean;
  setValidationResult: (
    errors: string[],
    warnings: string[],
    success: boolean
  ) => void;

  // Save/validate callbacks registered by the active builder tab.
  // Stored in refs so callers always get the latest version.
  registerSaveHandler: (fn: () => Promise<void>) => void;
  registerValidateHandler: (fn: () => void) => void;
  triggerSave: () => Promise<void>;
  triggerValidate: () => void;
}

const AgentWorkspaceContext = createContext<AgentWorkspaceContextValue | null>(
  null
);

export function useAgentWorkspace(): AgentWorkspaceContextValue {
  const ctx = useContext(AgentWorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useAgentWorkspace must be used within AgentWorkspaceProvider"
    );
  }
  return ctx;
}

interface AgentWorkspaceProviderProps {
  agent: AgentDefinition;
  initialTab: AgentDetailTabId;
  initialSubtab: BuilderSubtab;
  children: ReactNode;
}

export function AgentWorkspaceProvider({
  agent,
  initialTab,
  initialSubtab,
  children,
}: AgentWorkspaceProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<AgentDetailTabId>(initialTab);
  const [builderSubtab, setBuilderSubtab] =
    useState<BuilderSubtab>(initialSubtab);
  const [rightPanelMode, setRightPanelMode] = useState<"inspect" | "issues">(
    "inspect"
  );
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const saveHandlerRef = useRef<(() => Promise<void>) | null>(null);
  const validateHandlerRef = useRef<(() => void) | null>(null);

  const setValidationResult = useCallback(
    (errors: string[], warnings: string[], success: boolean) => {
      setValidationErrors(errors);
      setValidationWarnings(warnings);
      setValidationSuccess(success);
      if (errors.length > 0) {
        setRightPanelMode("issues");
        setRightPanelOpen(true);
      }
    },
    []
  );

  const switchTab = useCallback(
    (tab: AgentDetailTabId) => {
      setActiveTab(tab);
      if (tab !== "builder") {
        setRightPanelOpen(false);
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      params.delete("subtab");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const switchBuilderSubtab = useCallback(
    (sub: BuilderSubtab) => {
      setBuilderSubtab(sub);
      setRightPanelOpen(false);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "builder");
      params.set("subtab", sub);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const registerSaveHandler = useCallback((fn: () => Promise<void>) => {
    saveHandlerRef.current = fn;
  }, []);

  const registerValidateHandler = useCallback((fn: () => void) => {
    validateHandlerRef.current = fn;
  }, []);

  const triggerSave = useCallback(async () => {
    if (saveHandlerRef.current) {
      await saveHandlerRef.current();
    }
  }, []);

  const triggerValidate = useCallback(() => {
    if (validateHandlerRef.current) {
      validateHandlerRef.current();
    }
  }, []);

  const value = useMemo<AgentWorkspaceContextValue>(
    () => ({
      agent,
      activeTab,
      switchTab,
      builderSubtab,
      switchBuilderSubtab,
      rightPanelMode,
      setRightPanelMode,
      rightPanelOpen,
      setRightPanelOpen,
      leftSidebarOpen,
      setLeftSidebarOpen,
      saving,
      setSaving,
      dirty,
      setDirty,
      validationErrors,
      validationWarnings,
      validationSuccess,
      setValidationResult,
      registerSaveHandler,
      registerValidateHandler,
      triggerSave,
      triggerValidate,
    }),
    [
      agent,
      activeTab,
      switchTab,
      builderSubtab,
      switchBuilderSubtab,
      rightPanelMode,
      rightPanelOpen,
      leftSidebarOpen,
      saving,
      dirty,
      validationErrors,
      validationWarnings,
      validationSuccess,
      setValidationResult,
      registerSaveHandler,
      registerValidateHandler,
      triggerSave,
      triggerValidate,
    ]
  );

  return (
    <AgentWorkspaceContext.Provider value={value}>
      {children}
    </AgentWorkspaceContext.Provider>
  );
}

/** Helper to check if a tab id is valid (re-exported for convenience) */
export { isAgentDetailTabId, AGENT_DETAIL_TABS };
