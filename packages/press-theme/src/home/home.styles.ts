import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
import { pageEnterStyles } from "../layout/global.styles"
export const homeStyles = css`
  ${pageEnterStyles};
  outline: none;
  overflow-x: clip;
  .press-hero,
  .press-features {
    background-color: var(--yu-paper);
    background-image: radial-gradient(
      circle,
      color-mix(in srgb, var(--yu-ink) 16%, transparent) 0.75px,
      transparent 0.9px
    );
    background-size: 20px 20px;
    background-position: 10px 10px;
  }
  .press-hero {
    position: relative;
    isolation: isolate;

    color: var(--yu-ink);
    height: 75svh;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
    align-items: center;
    gap: 40px;
    padding: calc(
        var(--press-hero-header-space, var(--press-header-expanded)) + 12px
      )
      clamp(24px, 7vw, 112px) 40px;
    overflow: hidden;
  }
  .press-hero-name {
    font: 12px var(--yu-mono);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--yu-secondary);
    margin-bottom: clamp(12px, 3svh, 28px);
  }
  h1 {
    font-size: clamp(40px, 7svh, 72px);
    line-height: 1.02;
    letter-spacing: -0.055em;
    max-width: 12ch;
    font-weight: 400;
  }
  .press-hero-tagline {
    font-size: 16px;
    line-height: 1.7;
    max-width: 44ch;
    margin-top: clamp(12px, 3svh, 24px);
    color: var(--yu-secondary);
  }
  .press-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: clamp(16px, 4svh, 32px);
  }
  .press-hero-symbol {
    width: min(100%, 320px);
    height: min(320px, 35svh);
    background: currentColor;
    mask-position: center;
    mask-size: contain;
    mask-repeat: no-repeat;
    opacity: 0.14;
    justify-self: end;
  }
  .press-hero-image {
    width: 100%;
    max-height: 40svh;
    object-fit: contain;
    opacity: 0.9;
  }
  .press-home-content,
  .press-features {
    max-width: 1120px;
    margin: 0 auto;
    padding: 80px 32px;
  }
  .press-home-content {
    max-width: 850px;
    line-height: 1.9;
    font-size: 18px;
  }
  .press-home-content h2 {
    font-size: 32px;
    letter-spacing: -0.03em;
    line-height: 1.25;
    margin-bottom: 24px;
  }
  .press-home-content p + p {
    margin-top: 20px;
  }
  .press-home-content a {
    text-underline-offset: 4px;
  }
  .press-features {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    position: relative;
    isolation: isolate;
    padding: 16px 0;
    margin-block: 0 48px;
    height: 25svh;
    min-height: 0;
  }
  .press-features::before {
    content: "";
    position: absolute;
    inset-block: 0;
    left: calc((100% - 100vw) / 2);
    width: 100vw;
    background: inherit;
    z-index: -1;
    pointer-events: none;
  }
  .press-feature-card {
    background: var(--yu-paper);
    padding: clamp(12px, 2.5svh, 32px);
    min-width: 0;
    min-height: 0;
    grid-template-rows: auto auto minmax(0, 1fr);
    display: grid;
    gap: clamp(6px, 1.5svh, 20px);
    text-decoration: none;
    border: 1px solid var(--yu-border);
    transition: background-color 180ms var(--yu-motion-ease);
  }
  .press-feature-card:hover {
    background: var(--yu-subtle);
  }
  .press-feature-index {
    font: 11px var(--yu-mono);
    color: var(--yu-secondary);
  }
  .press-feature-card h2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: clamp(20px, 3.5svh, 30px);
    letter-spacing: -0.025em;
    line-height: 1.25;
    margin: 0;
    gap: 16px;
  }
  .press-feature-card h2 svg {
    flex-shrink: 0;
  }
  .press-feature-card p {
    font-size: 14px;
    line-height: 1.7;
    color: var(--yu-secondary);
    margin: 0;
    min-height: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--press-feature-lines, 2);
  }
  @media ${mediaQueries.tablet} {
    .press-hero {
      grid-template-columns: 1fr;
      padding-inline: 32px;
    }
    .press-hero-copy {
      max-width: 560px;
    }
    .press-hero-symbol {
      position: absolute;
      z-index: -1;
      right: -20px;
      top: 30%;
      opacity: 0.07;
    }
  }
  @media (min-height: 900px) {
    --press-feature-lines: 3;
  }
  @media ${mediaQueries.tabletUp} and (max-height: 520px) {
    .press-hero {
      gap: 20px;
      padding-bottom: 16px;
    }
    .press-hero-tagline {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .press-hero-name {
      margin-bottom: 8px;
    }
    .press-hero-actions {
      margin-top: 12px;
    }
    .press-feature-index {
      display: none;
    }
    .press-feature-card {
      grid-template-rows: auto minmax(0, 1fr);
    }
    .press-feature-card p {
      -webkit-line-clamp: 1;
    }
  }
  @media ${mediaQueries.phone} {
    h1 {
      font-size: 52px;
    }
    .press-hero {
      height: auto;
      min-height: 75svh;
      grid-template-columns: 1fr;
      gap: 40px;
      padding: calc(var(--press-header-expanded) + 40px) 24px 64px;
    }
    .press-hero-symbol {
      position: absolute;
      z-index: -1;
      width: 280px;
      height: 280px;
      right: -64px;
      top: 30%;
      opacity: 0.07;
    }
    .press-hero-image {
      max-height: 24svh;
      max-width: 200px;
      justify-self: end;
    }
    .press-home-content,
    .press-features {
      padding: 48px 24px;
    }
    .press-features {
      height: auto;
      grid-template-columns: 1fr;
      margin: 0 24px 48px;
      padding: 0;
    }
    .press-feature-card p {
      display: block;
      overflow: visible;
      font-size: 16px;
    }
    .press-feature-card {
      grid-template-rows: auto;
      gap: 24px;
      padding: 32px 24px;
    }
    .press-home-content {
      font-size: 16px;
    }
  }
`
