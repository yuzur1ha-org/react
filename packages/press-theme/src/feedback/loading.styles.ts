import { css } from "@emotion/react"

export const loadingStyles = css`
  grid-column: 1 / -1;
  min-height: 55svh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 24px;
  color: var(--yu-secondary);
  &[data-overlay="true"] {
    position: fixed;
    inset: var(--press-loading-top, var(--press-header-height)) 0 0
      var(--press-loading-left, 0px);
    z-index: 35;
    min-height: 0;
    pointer-events: none;
    padding: 24px;
    animation: press-loading-enter 160ms ease-out both;
    .press-loading-indicator {
      display: grid;
      justify-items: center;
      gap: 16px;
      padding: 24px 32px;
      background: color-mix(in srgb, var(--yu-paper) 94%, transparent);
      backdrop-filter: blur(12px);
      border: 1px solid var(--yu-border);
    }
    &[data-leaving="true"] {
      animation: press-loading-exit 160ms ease-in both;
    }
  }
  @keyframes press-loading-enter {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes press-loading-exit {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`

export const loadingMarkStyles = css`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  color: var(--yu-ink);
  .press-loading-squares {
    display: grid;
    grid-template: repeat(2, 10px) / repeat(2, 10px);
    gap: 4px;
    width: 24px;
    height: 24px;
    animation: press-turn 1200ms cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
  i {
    display: block;
    width: 10px;
    height: 10px;
    background: currentColor;
    --x: 2px;
    --y: 2px;
    animation: press-fold 1200ms cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
  i:nth-of-type(2) {
    --x: -2px;
  }
  i:nth-of-type(3) {
    --y: -2px;
  }
  i:nth-of-type(4) {
    --x: -2px;
    --y: -2px;
  }
  @keyframes press-fold {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(var(--x), var(--y)) scale(0.65);
    }
  }
  @keyframes press-turn {
    0%,
    15% {
      transform: rotate(0deg);
    }
    85%,
    100% {
      transform: rotate(90deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    i,
    .press-loading-squares {
      animation: none;
    }
  }
`

export const loadingLabelStyles = css`
  font: 11px/1.5 var(--yu-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`
