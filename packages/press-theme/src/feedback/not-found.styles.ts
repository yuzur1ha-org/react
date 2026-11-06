import { css } from "@emotion/react"

export const notFoundStyles = css`
  min-height: 72svh;
  max-width: 1240px;
  margin: 0 auto;
  padding: 80px 48px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(40px, 7vw, 112px);
  .press-error-figure {
    position: relative;
    min-width: 0;
    padding: 48px 0;
    border-block: 1px solid var(--yu-border);
    display: grid;
    place-items: center;
  }
  .press-error-figure::before,
  .press-error-figure::after {
    content: "+";
    position: absolute;
    font: 16px/1 var(--yu-mono);
    color: var(--yu-secondary);
    background: var(--yu-paper);
    padding: 0 4px;
  }
  .press-error-figure::before {
    top: -9px;
    left: -8px;
  }
  .press-error-figure::after {
    bottom: -7px;
    right: -8px;
  }
  .press-error-code {
    font: 400 clamp(112px, 16vw, 224px)/1 var(--yu-mono);
    letter-spacing: -0.09em;
    padding-right: 0.09em;
    color: color-mix(in srgb, var(--yu-ink) 28%, var(--yu-paper));
  }
  .press-error-coordinate {
    margin-top: 32px;
    font: 11px/1.5 var(--yu-mono);
    color: var(--yu-secondary);
    letter-spacing: 0.2em;
  }
  .press-error-index {
    font: 11px/1.5 var(--yu-mono);
    color: var(--yu-secondary);
    letter-spacing: 0.1em;
  }
  h1 {
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.045em;
    margin-top: 20px;
  }
  p {
    max-width: 34ch;
    margin: 24px 0 32px;
    color: var(--yu-secondary);
    font-size: 16px;
    line-height: 1.8;
  }
  /* The illustration needs a single column below 768px, independently of site tiers. */
  @media (width < 768px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 48px 24px 64px;
    gap: 40px;
    .press-error-figure {
      padding: 24px 0;
    }
    .press-error-code {
      font-size: clamp(112px, 30vw, 180px);
    }
    .press-error-coordinate {
      margin-top: 16px;
    }
    .press-error-index {
      display: none;
    }
    h1 {
      margin-top: 0;
    }
  }
`
