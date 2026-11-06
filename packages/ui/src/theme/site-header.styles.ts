import { css } from "@emotion/react"
import { mediaQueries } from "@yuzur1ha/token"

/** Presentation only; each site owns its routes, navigation surfaces and theme. */
export const siteHeaderStyles = css`
  --yu-header-inset: 32px;
  --yu-header-gap: 16px;
  --yu-header-action-gap: 12px;
  --yu-header-locale-width: 112px;
  &[data-site-header]
    :is(
      .yu-button[data-size],
      .yu-select[data-size],
      .yu-menu-item,
      .yu-disclosure-trigger,
      [data-header-control]
    ) {
    font: 400 14px/21px var(--yu-mono);
    min-height: 44px;
    height: 44px;
    padding: 8px 12px;
    gap: 8px;
  }
  .yu-header-locale {
    width: var(--yu-header-locale-width);
    flex: none;
  }
  @media ${mediaQueries.tablet} {
    --yu-header-inset: 24px;
    --yu-header-locale-width: 80px;
  }
  @media ${mediaQueries.phone} {
    --yu-header-inset: 20px;
    --yu-header-locale-width: 80px;
  }
`
