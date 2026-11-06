import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const subheaderStyles = css`
  display: none;
  height: 48px;
  position: fixed;
  top: var(--press-header-height);
  left: var(--press-sidebar-width);
  right: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--yu-subtle) 96%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--yu-border);
  .press-subheader-inner {
    height: 100%;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-inline: var(--yu-header-inset);
    gap: var(--yu-header-gap);
  }
  .press-directory-disclosure {
    display: none;
  }
  @media ${mediaQueries.belowDesktop} {
    display: block;
  }
  @media ${mediaQueries.tablet} {
    &[data-has-outline="false"] {
      display: none;
    }
  }
  @media ${mediaQueries.phone} {
    left: 0;
    .press-subheader-inner {
      justify-content: space-between;
    }
    .press-directory-disclosure {
      display: block;
    }
  }
  .press-directory-panel {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--yu-paper);
    border-bottom: 1px solid var(--yu-border);
    box-shadow: 0 16px 24px rgb(0 0 0 / 6%);
  }
  .press-directory-panel .yu-menu-scroll {
    padding: 0;
  }
  .press-directory-panel .yu-menu-scroll > .yu-scroll-viewport > div {
    padding: 0;
  }
  .press-directory-panel .yu-menu-scroll {
    height: min(60svh, 520px);
    max-height: calc(100dvh - var(--press-header-height) - 48px);
  }
`
