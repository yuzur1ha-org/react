/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

const loadingStyles = css`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 16px;
  background: var(--yu-subtle);
  color: var(--yu-secondary);
  pointer-events: none;
  p {
    margin: 0;
    font: 11px/1.5 var(--yu-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .figma-loading-mark {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    color: var(--yu-ink);
  }
  .figma-loading-squares {
    display: grid;
    grid-template: repeat(2, 10px) / repeat(2, 10px);
    gap: 4px;
    animation: figma-preview-turn 1200ms cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
  i {
    display: block;
    width: 10px;
    height: 10px;
    background: currentColor;
    --x: 2px;
    --y: 2px;
    animation: figma-preview-fold 1200ms cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
  i:nth-of-type(2),
  i:nth-of-type(4) {
    --x: -2px;
  }
  i:nth-of-type(3),
  i:nth-of-type(4) {
    --y: -2px;
  }
  @keyframes figma-preview-fold {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(var(--x), var(--y)) scale(0.65);
    }
  }
  @keyframes figma-preview-turn {
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
    .figma-loading-squares {
      animation: none;
    }
  }
`

export function FigmaPreviewLoading() {
  return (
    <div role="status" className="figma-preview-loading" css={loadingStyles}>
      <span className="figma-loading-mark" aria-hidden="true">
        <span className="figma-loading-squares">
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>
      <p>Loading design preview</p>
    </div>
  )
}
