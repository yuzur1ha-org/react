import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const paginationStyles = css`
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--yu-border);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  a {
    display: block;
    min-width: 0;
    padding: 16px;
    border: 1px solid transparent;
    transition:
      background-color 180ms var(--yu-motion-ease),
      color 180ms var(--yu-motion-ease),
      border-color 180ms var(--yu-motion-ease);
  }
  a:hover {
    background: var(--yu-subtle);
    border-color: var(--yu-border);
  }
  a:active {
    background: var(--yu-ink);
    color: var(--yu-paper);
    border-color: var(--yu-ink);
  }
  .press-next {
    grid-column: 2;
    text-align: right;
  }
  .yu-link-content,
  .press-pagination-copy {
    display: grid;
    gap: 12px;
  }
  .press-next small {
    justify-content: flex-end;
  }
  small {
    display: flex;
    align-items: center;
    gap: 8px;
    font: 11px/1.5 var(--yu-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--yu-secondary);
  }
  small svg {
    flex-shrink: 0;
  }
  a:active small {
    color: inherit;
  }
  strong {
    font: inherit;
    line-height: 1.5;
  }
  @media ${mediaQueries.phone} {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    .press-next {
      grid-column: 1;
    }
    a {
      padding: 16px;
      border-color: var(--yu-border);
    }
  }
`
