import { css } from "@emotion/react"
export const demoStyles = css`
  .preview-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font: 10px var(--yu-mono);
    letter-spacing: 0.6px;
    min-height: 44px;
  }

  .demo-canvas {
    border: 1px solid var(--yu-border);
    padding: 64px 32px;
    background: var(--yu-subtle);
    min-height: 360px;
    display: grid;
    place-items: center;
  }
  .demo-content {
    width: min(100%, 432px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }
`
