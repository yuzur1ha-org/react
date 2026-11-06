import { tableStyles } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const styles = css`
  & {
    display: grid;
    gap: 40px;
    min-width: 0;
  }
  .component-api-part {
    min-width: 0;
  }
  .component-api-part h3 {
    margin-bottom: 8px;
    font-size: 18px;
  }
  .component-api-part > p {
    max-width: 72ch;
    color: var(--yu-secondary);
    font-size: 13px;
    line-height: 1.7;
  }
  .api-table-scroll {
    margin-top: 16px;
    max-width: 100%;
  }
  ${tableStyles(".api-table")}
  .api-table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
    text-align: start;
  }
  .api-table caption {
    padding-block: 8px;
    text-align: start;
    font: 11px/1.5 var(--yu-mono);
    color: var(--yu-secondary);
  }
  .api-table th {
    white-space: nowrap;
  }
  .api-table code {
    overflow-wrap: anywhere;
  }
  .api-table td {
    min-width: 64px;
    max-width: 360px;
  }
  .api-method-note {
    margin-top: 12px;
  }
`
