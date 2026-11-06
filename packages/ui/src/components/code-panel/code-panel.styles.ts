import { themed } from "../../theme/themed"
import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const styles = themed(css`
  & {
    --source-copy-inset: 16px;
    --source-copy-height: 36px;
    position: relative;
    border: 1px solid var(--yu-border);
    background: var(--yu-paper);
    overflow: hidden;
  }
  & .source-copy-button {
    position: absolute;
    inset-block-start: var(--source-copy-inset);
    inset-inline-end: var(--source-copy-inset);
    z-index: 1;
    min-height: var(--source-copy-height);
    width: 88px;
    padding: 8px;
    pointer-events: auto;
  }
  .source-copy-overlay {
    position: sticky;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100cqw;
    height: 0;
    z-index: 2;
    pointer-events: none;
  }
  .source-scroll {
    container-type: inline-size;
    max-height: min(480px, 60dvh);
  }
  & .source-code {
    display: flex;
    gap: 24px;
    width: max-content;
    min-width: 100%;
    padding: 24px;
    margin: 0;
    max-width: none;
    background: transparent;
    border: 0;
    font: 12px/1.9 var(--yu-mono);
    white-space: pre;
    overflow-wrap: normal;
    tab-size: 2;
    cursor: default;
  }
  .source-code code {
    display: block;
    flex: 1;
    min-width: 0;
    cursor: text;
    user-select: text;
    font: inherit;
    padding: 0;
    background: transparent;
    white-space: pre;
    overflow-wrap: normal;
  }
  .source-lines {
    display: flex;
    flex-direction: column;
    text-align: end;
    min-width: 2ch;
    user-select: none;
    cursor: default;
    color: var(--yu-secondary);
    opacity: 0.65;
  }
  .source-copy-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  @media (pointer: coarse) {
    & {
      --source-copy-height: 44px;
    }
  }
  @media ${mediaQueries.phone} {
    & {
      --source-copy-inset: 12px;
    }
    & .source-code {
      font-size: 11px;
      padding: 16px;
      gap: 16px;
    }
  }

  & {
    --yu-code-foreground: var(--yu-ink);
    --yu-code-background: transparent;
    --yu-code-token-comment: var(--yu-secondary);
    --yu-code-token-keyword: var(--yu-info);
    --yu-code-token-string: var(--yu-success);
    --yu-code-token-constant: var(--yu-warn);
    --yu-code-token-function: var(--yu-warn);
    --yu-code-token-parameter: var(--yu-ink);
    --yu-code-token-string-expression: var(--yu-success);
    --yu-code-token-punctuation: var(--yu-secondary);
    --yu-code-token-link: var(--yu-info);
  }
  &[data-code-theme="dark"] .press-code span[style] {
    --press-code-color: var(--code-dark);
  }
  .source-copy-error {
    margin: 0;
    padding: 12px 24px;
    color: var(--yu-error);
    font: 12px/1.6 var(--yu-font);
  }
`)
