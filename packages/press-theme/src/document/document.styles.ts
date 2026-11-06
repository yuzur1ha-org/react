import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
import { pageEnterStyles } from "../layout/global.styles"
export const documentStyles = css`
  ${pageEnterStyles};
  min-width: 0;
  outline: none;
  .press-prose > h1 {
    font-size: 3rem;
    line-height: 1.15;
    letter-spacing: -0.035em;
    margin: 0 0 24px;
  }
  h2,
  h3 {
    scroll-margin-top: 128px;
  }
  @media ${mediaQueries.phone} {
    .press-prose > h1 {
      font-size: 2.25rem;
    }
  }
  img {
    max-width: 100%;
  }
`
export const tocStyles = css`
  min-width: 0;
  align-self: start;
  position: sticky;
  top: calc(var(--press-header-height) + 32px);
  max-height: calc(100dvh - var(--press-header-height) - 64px);
  overflow: hidden;
  p {
    font: 11px var(--yu-mono);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--yu-secondary);
    margin: 0 0 20px;
    padding-left: 32px;
  }
  .press-toc-inner {
    display: flex;
    flex-direction: column;
    max-height: inherit;
  }
  .press-outline-scroll {
    flex: 1;
    min-height: 0;
  }
  .press-toc-nested {
    padding-left: 24px;
  }
  @media ${mediaQueries.belowDesktop} {
    display: none;
  }
`
