import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
export const settingRowStyles = themed(css`
  display: flex;
  align-items: center;
  gap: var(--yu-space-4);
  padding: var(--yu-space-4) 0;
  border-bottom: 1px solid var(--yu-border);
  & > .yu-setting-row-content {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  & p {
    margin: 0 0 6px;
    font-size: var(--yu-text-small);
    color: var(--yu-secondary);
  }
  & > .yu-setting-row-content > div {
    font-size: 18px;
    line-height: 1.35;
  }
`)
