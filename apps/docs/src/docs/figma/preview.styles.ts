import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const figmaPreviewStyles = css`
  margin-block: 40px;
  border: 1px solid var(--yu-border);
  background: var(--yu-paper);
  > header,
  > footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 16px 24px;
  }
  > header {
    border-bottom: 1px solid var(--yu-border);
  }
  .figma-preview-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font: 10px var(--yu-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--yu-secondary);
  }
  .figma-preview-cover {
    padding: 32px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    min-height: 164px;
    background: var(--yu-subtle);
  }
  .figma-preview-cover h3 {
    font-size: 24px;
    line-height: 1.25;
    letter-spacing: -0.025em;
    margin: 0 0 12px;
  }
  .figma-preview-cover p {
    font-size: 14px;
    line-height: 1.7;
    max-width: 42ch;
    color: var(--yu-secondary);
    margin: 0;
  }
  .figma-preview-cover button {
    flex: none;
    gap: 10px;
  }
  .figma-preview-frame {
    min-height: 440px;
    position: relative;
  }
  iframe {
    width: 100%;
    height: 440px;
    display: block;
    border: 0;
    background: var(--yu-subtle);
  }
  .figma-preview-frame > [role="alert"] {
    padding: 20px 24px;
    font-size: 13px;
  }
  > footer {
    border-top: 1px solid var(--yu-border);
    font: 10px var(--yu-mono);
    color: var(--yu-secondary);
  }
  @media ${mediaQueries.phone} {
    > header,
    > footer {
      padding: 12px 16px;
      gap: 12px;
    }
    .figma-preview-cover {
      padding: 24px 16px;
      align-items: flex-start;
      flex-direction: column;
      gap: 24px;
    }
    .figma-preview-frame {
      min-height: 360px;
    }
    iframe {
      height: 360px;
    }
  }
`
