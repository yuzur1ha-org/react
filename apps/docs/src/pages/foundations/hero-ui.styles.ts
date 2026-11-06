import { css } from "@emotion/react"
export const heroUIStyles = css`
  & {
    margin-top: 32px;
    padding: 24px;
    border: 1px solid var(--yu-border);
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
  }
  & input {
    max-width: 280px;
  }
`
