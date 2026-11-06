import { css } from "@emotion/react"
export const globalStyles = css`
  * {
    box-sizing: border-box;
  }
  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body {
    margin: 0;
    background: var(--yu-paper);
    color: var(--yu-ink);
    font: 16px/1.4 var(--yu-font);
  }
  button,
  input,
  textarea,
  select {
    font: inherit;
    border-radius: var(--yu-radius);
  }
  button,
  a,
  input,
  textarea,
  select {
    -webkit-tap-highlight-color: transparent;
  }
  button {
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
  a {
    color: inherit;
    text-underline-offset: 4px;
  }
  h1,
  h2,
  h3,
  p {
    margin: 0;
  }
  h1,
  h2,
  h3 {
    font-weight: 400;
  }
  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }
  legend {
    padding: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  html[data-theme="light"] {
    color-scheme: light;
  }
  html[data-theme="dark"] {
    color-scheme: dark;
  }
  :focus-visible {
    outline: 2px solid var(--yu-focus);
    outline-offset: 4px;
  }
  #main :is(h1, h2, h3, h4, h5, h6)[tabindex="-1"]:focus {
    outline: none;
  }
  .press-skip:not(:focus) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .press-skip:focus {
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: 100;
    padding: 12px;
    background: var(--yu-paper);
  }
`

export const pageEnterStyles = css`
  animation: press-page-enter 240ms ease-out backwards;
  @keyframes press-page-enter {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const hashMotionStyles = css`
  html[data-yupress-hash-navigation] {
    scroll-behavior: smooth;
  }
  @media (prefers-reduced-motion: reduce) {
    html[data-yupress-hash-navigation] {
      scroll-behavior: auto;
    }
  }
`
