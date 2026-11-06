import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { input } from "../../internal/styles"
export const formStyles = themed(css`
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-4);
  width: 100%;
  min-width: 0;
`)
export const fieldStyles = themed(css`
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-1);
  min-width: 0;
  & .yu-form-label {
    font-size: var(--yu-text-label);
  }
  & .yu-form-description,
  & .yu-form-message {
    font-size: var(--yu-text-helper);
    line-height: 1.5;
  }
  & .yu-form-description {
    color: var(--yu-secondary);
  }
  & .yu-form-message {
    color: var(--yu-error);
  }
`)
export const controlStyles = themed(css`
  ${input};
  &:is(textarea) {
    height: 112px;
    resize: vertical;
  }
  &:is([type="checkbox"], [type="radio"]) {
    width: 20px;
    height: 20px;
    padding: 0;
    accent-color: var(--yu-ink);
  }
`)
export const fieldsetStyles = themed(css`
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-3);
  min-width: 0;
  margin: 0;
  border: 1px solid var(--yu-border);
  padding: var(--yu-space-4);
  & .yu-form-legend {
    padding-inline: var(--yu-space-1);
    font-size: var(--yu-text-small);
  }
  &:disabled {
    color: var(--yu-muted);
  }
`)
export const actionsStyles = themed(css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--yu-space-2);
  @media ${mediaQueries.phone} {
    flex-direction: column;
    align-items: stretch;
    & > button {
      width: 100%;
    }
  }
`)
