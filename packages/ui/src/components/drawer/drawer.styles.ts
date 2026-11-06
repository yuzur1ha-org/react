import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
export const drawerStyles = themed(css`
  position: fixed;
  inset-block: 0;
  inset-inline-end: 0;
  width: min(432px, calc(100vw - 24px));
  height: 100dvh;
  max-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--yu-surface);
  color: var(--yu-ink);
  border: 1px solid var(--yu-border);
  z-index: 50;
  --yu-drawer-x: 100%;
  --yu-drawer-y: 0%;
  &[data-side="left"] {
    inset-inline: 0 auto;
    --yu-drawer-x: -100%;
  }
  &[data-side="bottom"] {
    inset: auto 0 0;
    width: 100%;
    height: auto;
    max-height: 85dvh;
    --yu-drawer-x: 0%;
    --yu-drawer-y: 100%;
  }
  & .yu-drawer-header,
  & .yu-drawer-footer {
    flex-shrink: 0;
    padding: var(--yu-space-4);
  }
  & .yu-drawer-header {
    border-bottom: 1px solid var(--yu-border);
  }
  & .yu-drawer-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--yu-space-3);
  }
  & .yu-drawer-header-actions {
    display: flex;
    align-items: center;
    gap: var(--yu-space-1);
    flex-shrink: 0;
  }
  & .yu-drawer-heading > .yu-icon-button {
    margin: -8px -8px -8px 0;
  }
  & .yu-drawer-heading > h2 {
    margin: 0;
    font: 400 var(--yu-text-title)/1.4 var(--yu-font);
    letter-spacing: normal;
    text-wrap: wrap;
  }
  & .yu-drawer-header > p {
    margin: var(--yu-space-2) 0 0;
    font-size: var(--yu-text-small);
    color: var(--yu-secondary);
    line-height: 1.6;
  }
  & .yu-drawer-body {
    flex: 1 1 auto;
    padding: var(--yu-space-4);
    overflow-y: auto;
    overscroll-behavior: contain;
    min-height: 0;
  }
  & .yu-drawer-footer {
    margin-top: auto;
    border-top: 1px solid var(--yu-border);
    padding-bottom: max(var(--yu-space-4), env(safe-area-inset-bottom));
  }
  &[data-state="open"] {
    animation: yu-drawer-in var(--yu-motion-normal) var(--yu-motion-ease) both;
  }
  &[data-state="closed"] {
    animation: yu-drawer-out var(--yu-motion-fast) var(--yu-motion-ease) both;
  }
  @keyframes yu-drawer-in {
    from {
      transform: translate(var(--yu-drawer-x), var(--yu-drawer-y));
    }
    to {
      transform: none;
    }
  }
  @keyframes yu-drawer-out {
    to {
      transform: translate(var(--yu-drawer-x), var(--yu-drawer-y));
    }
  }
`)
