import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const styles = css`
  & {
    margin-bottom: 40px;
    min-width: 0;
  }
  .document-kicker {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
    color: var(--yu-secondary);
    font: 10px/1.5 var(--yu-mono);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .document-version {
    margin-inline-start: auto;
    flex-shrink: 0;
    letter-spacing: 0;
    text-transform: none;
  }
  & h1 {
    margin: 0;
    color: var(--yu-ink);
    font-size: 48px;
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }
  .document-description {
    max-width: 58ch;
    margin-top: 20px;
    color: var(--yu-secondary);
    font-size: 16px;
    line-height: 1.7;
  }
  .document-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px 24px;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--yu-border);
  }
  .component-metadata {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 32px;
    margin: 0;
  }
  .component-metadata > div {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .component-metadata dt {
    color: var(--yu-secondary);
    font: 10px/1.6 var(--yu-mono);
  }
  .component-metadata dd {
    margin: 0;
    color: var(--yu-ink);
    font-size: 12px;
    line-height: 1.6;
    font-variant-numeric: tabular-nums;
  }
  @media ${mediaQueries.phone} {
    & {
      margin-bottom: 32px;
    }
    .document-kicker {
      margin-bottom: 20px;
    }
    .document-description {
      margin-top: 16px;
      font-size: 14px;
    }
    .document-details {
      margin-top: 24px;
      padding-top: 12px;
      gap: 8px 16px;
    }
    .component-metadata {
      gap: 8px 20px;
    }
    .component-metadata > div {
      gap: 8px;
    }
  }
`
