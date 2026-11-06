import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
export const headerStyles = css`
  position: fixed;
  inset: 0 0 auto;
  height: var(--press-header-height);
  z-index: 40;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: var(--yu-header-gap);
  padding-inline: var(--yu-header-inset);
  isolation: isolate;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: var(--press-header-progress);
    background: color-mix(in srgb, var(--yu-paper) 86%, transparent);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--yu-border);
  }
  &[data-layout="docs"] {
    left: var(--press-sidebar-width);
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
  }
  &[data-layout="docs"]::before {
    opacity: 1;
  }
  .press-desktop-navigation,
  .press-desktop-navigation nav,
  .press-text-links,
  .press-static-navigation {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &[data-layout="docs"] .press-desktop-navigation {
    grid-column: 1;
  }
  &[data-layout="docs"] .press-desktop-navigation nav {
    justify-content: start;
  }
  &[data-layout="docs"] .press-header-actions {
    grid-column: 2;
  }
  .press-header-brand {
    padding-inline-start: calc(
      var(--press-brand-inset) - var(--yu-header-inset)
    );
    display: flex;
    align-items: center;
    align-self: stretch;
    min-width: 0;
  }
  &[data-layout="docs"] .press-header-brand {
    display: none;
  }
  .press-desktop-navigation {
    min-width: 0;
    grid-column: 2;
    display: flex;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .press-inline-text-links {
    display: none;
  }
  .press-desktop-navigation nav {
    flex-wrap: nowrap;
    justify-content: safe center;
    width: max-content;
    flex: none;
    gap: var(--yu-header-gap);
    padding: 0;
  }
  .press-header-actions,
  .press-controls {
    display: flex;
    align-items: center;
    gap: var(--yu-header-action-gap);
    margin-left: auto;
  }
  .press-header-actions {
    min-width: 0;
    max-width: 100%;
    grid-column: 3;
    justify-self: end;
  }
  .press-controls {
    flex-shrink: 0;
  }
  .press-theme-control {
    display: flex;
    align-items: center;
  }
  .press-text-links,
  .press-icon-links {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .press-text-links {
    max-width: 240px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    min-height: 48px;
  }
  .press-icon-links-scroll {
    width: auto;
    min-width: 44px;
    max-width: 88px;
  }
  .press-static-navigation,
  .press-phone-navigation {
    display: none;
  }
  @media ${mediaQueries.tablet} {
    grid-template-columns: minmax(0, auto) minmax(0, 1fr) auto;
    &[data-layout="docs"] {
      grid-template-columns: minmax(0, 1fr) auto;
    }
    .press-desktop-navigation {
      gap: 8px;
    }
    .press-inline-text-links {
      display: flex;
      flex: none;
    }
    .press-inline-text-links .press-text-links {
      max-width: none;
      overflow: visible;
    }
    .press-header-actions > .press-text-links {
      display: none;
    }
  }
  @media ${mediaQueries.phone} {
    display: flex;
    padding-inline: 0;
    &[data-layout="docs"] {
      left: 0;
    }
    background: transparent;
    .press-header-brand {
      display: flex;
      padding-inline: var(--yu-header-inset);
      flex: 1;
    }
    &[data-layout="docs"] .press-header-brand {
      display: flex;
      background: color-mix(in srgb, #171819 88%, transparent);
      backdrop-filter: blur(18px);
    }
    .press-brand {
      font-size: 19px;
    }
    .press-desktop-navigation,
    .press-header-actions {
      display: none;
    }
    .press-static-navigation {
      display: block;
      position: fixed;
      inset-inline: 0;
      top: var(--press-header-height);
      padding: 4px var(--yu-header-inset);
      background: var(--yu-paper);
      border-bottom: 1px solid var(--yu-border);
      z-index: 45;
    }
    .press-phone-navigation {
      display: block;
      padding-right: var(--yu-header-inset);
    }
  }
`
export const siteNavigationStyles = css`
  &.press-site-navigation .yu-menu-item {
    flex-shrink: 0;
    width: auto;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
    text-align: center;
  }
  &.press-site-navigation
    .yu-menu-item[aria-current][data-active-appearance="subtle"] {
    background: transparent;
    color: var(--yu-ink);
    text-decoration: underline;
    text-underline-offset: 10px;
  }
  &.press-site-navigation .yu-menu-item::before {
    display: none;
  }
`
