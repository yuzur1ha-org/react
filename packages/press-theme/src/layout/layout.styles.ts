import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
import { pressLayout } from "./metrics"
export const layoutStyles = css`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  --press-sidebar-width: 256px;
  --press-brand-inset: ${pressLayout.brandInset}px;
  --press-header-expanded: ${pressLayout.headerExpanded}px;
  --press-header-height: var(--press-header-expanded);
  --press-header-progress: 0;
  --press-subheader-space: 0px;
  --press-loading-left: 0px;
  --press-loading-top: var(--press-header-height);
  &[data-layout="docs"] {
    --press-loading-left: var(--press-sidebar-width);
    --press-loading-top: calc(
      var(--press-header-height) + var(--press-subheader-space)
    );
  }
  .press-layout {
    flex: 1;
    min-width: 0;
    padding-top: var(--press-header-expanded);
  }
  &[data-layout="home"] .press-layout {
    padding-top: 0;
  }
  &[data-layout="home"][data-translation-missing="true"] .press-layout {
    padding-top: var(--press-header-expanded);
    --press-hero-header-space: 0px;
  }
  .press-translation-notice {
    margin: 0;
    padding: 16px 24px;
    border-block: 1px solid var(--yu-border);
    background: var(--yu-subtle);
    color: var(--yu-secondary);
    font-size: 13px;
    line-height: 1.6;
  }
  &[data-layout="docs"] .press-layout {
    margin-left: var(--press-sidebar-width);
  }
  .press-reading {
    display: grid;
    grid-template-columns: minmax(0, 800px) 160px;
    justify-content: center;
    gap: 40px;
    padding: 48px;
    min-width: 0;
  }
  &[data-has-outline="false"] .press-reading {
    grid-template-columns: minmax(0, 800px);
  }
  .press-reading > [role="status"] {
    grid-column: 1 / -1;
  }
  @media ${mediaQueries.belowDesktop} {
    &[data-has-outline="true"] {
      --press-subheader-space: 48px;
    }
    .press-reading {
      grid-template-columns: minmax(0, 800px);
      padding: 40px 32px;
    }
    &[data-layout="docs"] .press-layout {
      padding-top: calc(
        var(--press-header-expanded) + var(--press-subheader-space)
      );
    }
  }
  @media ${mediaQueries.tablet} {
    .press-reading {
      padding: 32px 24px;
    }
  }
  @media ${mediaQueries.phone} {
    --press-brand-inset: 20px;
    --press-subheader-space: 48px;
    --press-loading-left: 0px;
    &[data-layout="docs"] {
      --press-loading-left: 0px;
    }
    &[data-layout="docs"] .press-layout {
      margin-left: 0;
    }
    .press-reading {
      padding: 32px 20px;
    }
  }
`
