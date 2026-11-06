import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const styles = css`
  & {
    --source-copy-inset: 16px;
    --source-copy-height: 36px;
    margin-top: 24px;
    border: 1px solid var(--yu-border);
    background: var(--yu-paper);
    overflow: hidden;
  }
  .usage-toolbar {
    display: flex;
    align-items: center;
  }
  .usage-toolbar .yu-disclosure-heading {
    flex: 1;
    min-width: 0;
  }
  & .yu-disclosure-heading .yu-disclosure-trigger {
    padding: 16px 24px;
    gap: 12px;
    font: 12px/1.5 var(--yu-mono);
    min-height: 48px;
  }
  & .yu-disclosure-body {
    padding-bottom: 0;
  }
  .source-meta {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 12px 24px;
    border-block: 1px solid var(--yu-border);
    font: 10px/1.5 var(--yu-mono);
    color: var(--yu-secondary);
  }
  .source-panel {
    position: relative;
  }
  @media ${mediaQueries.phone} {
    & {
      --source-copy-inset: 12px;
    }
    & .yu-disclosure-heading .yu-disclosure-trigger {
      padding: 12px 16px;
      gap: 8px;
      font-size: 11px;
    }
    .source-meta {
      padding: 10px 16px;
    }
  }

  .yu-code-panel {
    border: 0;
  }
`
