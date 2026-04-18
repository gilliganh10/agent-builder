"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface TopBarBreadcrumbState {
  backHref: string | null;
  backLabel: string | null;
  title: string | null;
  /** Muted path or secondary line (e.g. workspace file path); set from project file routes. */
  subtitle: string | null;
}

const defaultState: TopBarBreadcrumbState = {
  backHref: null,
  backLabel: null,
  title: null,
  subtitle: null,
};

type TopBarContextValue = {
  state: TopBarBreadcrumbState;
  /** Merges into breadcrumb state; pass `null` to reset breadcrumb and all header slots. */
  setBreadcrumb: (value: Partial<TopBarBreadcrumbState> | null) => void;
  /** Row 1 center: replaces default title when set (e.g. project Files popover). */
  titleSlot: ReactNode | null;
  setTitleSlot: (node: ReactNode | null) => void;
  /** Row 1 trailing: View public, publish, save (project-level). */
  projectHeaderSlot: ReactNode | null;
  setProjectHeaderSlot: (node: ReactNode | null) => void;
  /** Row 2: editor mode toggles (file/workspace local). */
  editorStickySlot: ReactNode | null;
  setEditorStickySlot: (node: ReactNode | null) => void;
};

const TopBarContext = createContext<TopBarContextValue>({
  state: defaultState,
  setBreadcrumb: () => {},
  titleSlot: null,
  setTitleSlot: () => {},
  projectHeaderSlot: null,
  setProjectHeaderSlot: () => {},
  editorStickySlot: null,
  setEditorStickySlot: () => {},
});

export function useTopBarBreadcrumb() {
  return useContext(TopBarContext);
}

export function TopBarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TopBarBreadcrumbState>(defaultState);
  const [titleSlot, setTitleSlotInternal] = useState<ReactNode | null>(null);
  const [projectHeaderSlot, setProjectHeaderSlotInternal] =
    useState<ReactNode | null>(null);
  const [editorStickySlot, setEditorStickySlotInternal] =
    useState<ReactNode | null>(null);

  const setBreadcrumb = useCallback(
    (value: Partial<TopBarBreadcrumbState> | null) => {
      if (value === null) {
        setState(defaultState);
        setTitleSlotInternal(null);
        setProjectHeaderSlotInternal(null);
        setEditorStickySlotInternal(null);
        return;
      }
      setState((prev) => ({
        backHref:
          value.backHref !== undefined ? value.backHref : prev.backHref,
        backLabel:
          value.backLabel !== undefined ? value.backLabel : prev.backLabel,
        title: value.title !== undefined ? value.title : prev.title,
        subtitle:
          value.subtitle !== undefined ? value.subtitle : prev.subtitle,
      }));
    },
    []
  );

  const setTitleSlot = useCallback((node: ReactNode | null) => {
    setTitleSlotInternal(node);
  }, []);

  const setProjectHeaderSlot = useCallback((node: ReactNode | null) => {
    setProjectHeaderSlotInternal(node);
  }, []);

  const setEditorStickySlot = useCallback((node: ReactNode | null) => {
    setEditorStickySlotInternal(node);
  }, []);

  const value = useMemo<TopBarContextValue>(
    () => ({
      state,
      setBreadcrumb,
      titleSlot,
      setTitleSlot,
      projectHeaderSlot,
      setProjectHeaderSlot,
      editorStickySlot,
      setEditorStickySlot,
    }),
    [
      state,
      setBreadcrumb,
      titleSlot,
      setTitleSlot,
      projectHeaderSlot,
      setProjectHeaderSlot,
      editorStickySlot,
      setEditorStickySlot,
    ]
  );

  return (
    <TopBarContext.Provider value={value}>{children}</TopBarContext.Provider>
  );
}

interface TopBarBreadcrumbProps {
  /** When omitted or null, the TopBar shows no back control. */
  backHref?: string | null;
  /** Used for `aria-label` on the back control; optional when only an icon is shown. */
  backLabel?: string | null;
  /** When omitted, title/subtitle are left for a deeper client (e.g. project file workspace). */
  title?: string;
}

/**
 * Render once per page/layout to configure TopBar breadcrumb state.
 * Omit `backHref` (or pass null) to hide the back control. Clears breadcrumb on unmount.
 */
export function TopBarBreadcrumb({
  backHref,
  backLabel,
  title,
}: TopBarBreadcrumbProps) {
  const { setBreadcrumb } = useTopBarBreadcrumb();

  useEffect(() => {
    const resolvedBackHref = backHref ?? null;
    if (title !== undefined) {
      setBreadcrumb({
        backHref: resolvedBackHref,
        backLabel: backLabel ?? null,
        title,
        subtitle: null,
      });
    } else {
      setBreadcrumb({
        backHref: resolvedBackHref,
        backLabel: backLabel ?? null,
      });
    }
    return () => setBreadcrumb(null);
  }, [backHref, backLabel, title, setBreadcrumb]);

  return null;
}
