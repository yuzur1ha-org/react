import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { focus, interaction } from "../../internal/styles"
const hoverLineSize = css`
  --yu-link-hover-line-width: 2px;
  &[data-size="large"] {
    --yu-link-hover-line-width: 3px;
  }
`
export const linkContainerStyles = css`
  ${hoverLineSize};
  text-decoration: none;
  &:where(:hover, :focus-visible) .yu-link-hover-line::after {
    transform: scaleX(1);
  }
  &[data-underline="false"] .yu-link-hover-line::after,
  &[data-appearance]:not([data-appearance="text"]) .yu-link-hover-line::after {
    content: none;
  }
`
export const linkUnderlineStyles = themed(css`
  color: inherit;
  font: inherit;
  position: relative;
  min-width: 0;
  overflow-wrap: anywhere;
  &[data-size="small"],
  &[data-size="medium"] {
    --yu-link-hover-line-width: 2px;
  }
  &[data-size="large"] {
    --yu-link-hover-line-width: 3px;
  }
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -0.1em;
    width: 100%;
    height: 0;
    border-bottom: var(--yu-link-hover-line-width, 2px) solid currentColor;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 260ms var(--yu-motion-ease);
    pointer-events: none;
  }
`)
export const linkTextStyles = themed(css`
  ${focus};
  ${interaction};
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  max-width: 100%;
  color: var(--yu-ink);
  font: inherit;
  font-size: 16px;
  line-height: 1.5;
  text-decoration: none;
  &[data-size="small"] {
    font-size: 13px;
  }
  &[data-size="large"] {
    font-size: 20px;
  }
`)
export const linkStyles = css`
  & .yu-link-icon {
    width: 0.8em;
    height: 0.8em;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 0;
  }
  &:not([data-appearance="text"]) {
    max-width: 100%;
    --yu-link-padding-inline: var(--yu-space-3);
  }
  &[data-size="small"]:not([data-appearance="text"]) {
    --yu-link-padding-inline: 12px;
  }
  &[data-size="large"]:not([data-appearance="text"]) {
    --yu-link-padding-inline: 24px;
  }
  &[data-show-icon="true"]:not([data-appearance="text"]) {
    padding-inline-end: max(6px, calc(var(--yu-link-padding-inline) - 0.6em));
  }
`
