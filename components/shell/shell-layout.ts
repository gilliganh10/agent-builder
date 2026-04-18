"use client";

export const SHELL_SIDEBAR_COLLAPSED_WIDTH = 80;
export const SHELL_SIDEBAR_DEFAULT_WIDTH = 272;
export const SHELL_SIDEBAR_MIN_WIDTH = 224;
export const SHELL_SIDEBAR_MAX_WIDTH = 360;
export const SHELL_CENTER_MIN_WIDTH = 620;

export const SHELL_PERCY_DEFAULT_WIDTH = 448;
export const SHELL_PERCY_MIN_WIDTH = 380;
export const SHELL_PERCY_MAX_WIDTH = 720;

function clamp(width: number, min: number, max: number) {
  return Math.min(max, Math.max(min, width));
}

export function getShellSidebarMaxWidth(
  viewportWidth: number,
  rightPanelWidth: number,
) {
  return Math.min(
    SHELL_SIDEBAR_MAX_WIDTH,
    Math.max(176, viewportWidth - SHELL_CENTER_MIN_WIDTH - rightPanelWidth),
  );
}

export function clampShellSidebarWidth(
  width: number,
  viewportWidth: number,
  rightPanelWidth: number,
) {
  const maxWidth = getShellSidebarMaxWidth(viewportWidth, rightPanelWidth);
  return clamp(width, Math.min(SHELL_SIDEBAR_MIN_WIDTH, maxWidth), maxWidth);
}

export function getShellPercyMaxWidth(
  viewportWidth: number,
  leftPanelWidth: number,
) {
  return Math.min(
    SHELL_PERCY_MAX_WIDTH,
    Math.max(280, viewportWidth - SHELL_CENTER_MIN_WIDTH - leftPanelWidth),
  );
}

export function clampShellPercyWidth(
  width: number,
  viewportWidth: number,
  leftPanelWidth: number,
) {
  const maxWidth = getShellPercyMaxWidth(viewportWidth, leftPanelWidth);
  return clamp(width, Math.min(SHELL_PERCY_MIN_WIDTH, maxWidth), maxWidth);
}
