import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { focus, interaction } from "../../internal/styles"
export const menuStyles = themed(css`
  display: flex;
  flex-direction: column;
  gap: var(--yu-space-1);
  width: 100%;
  min-width: 0;
  &[data-orientation="horizontal"] {
    flex-direction: row;
    flex-wrap: wrap;
  }
  &[data-orientation="horizontal"] > .yu-menu-item {
    width: auto;
  }
  &[data-size="small"] .yu-menu-item {
    font-size: 13px;
    padding: 8px 12px;
  }
  &[data-size="large"] .yu-menu-item {
    font-size: 18px;
    padding: 14px 16px;
  }
  &[data-appearance="subtle"] .yu-menu-group + .yu-menu-group {
    border: 0;
    padding-top: 0;
    margin-top: 16px;
  }
  &[data-orientation="horizontal"]
    .yu-menu-item[data-active-appearance="subtle"][aria-current]::before {
    inset-block: auto -1px;
    inset-inline: -1px;
    inline-size: auto;
    block-size: var(--yu-menu-active-indicator-size, 2px);
  }
  & .yu-menu-group {
    display: flex;
    flex-direction: column;
    gap: var(--yu-space-1);
  }
  & .yu-menu-group + .yu-menu-group {
    margin-top: var(--yu-space-3);
    padding-top: var(--yu-space-3);
    border-top: 1px solid var(--yu-border);
  }
  & .yu-menu-label {
    margin: 0;
    padding: var(--yu-space-2) var(--yu-space-3);
    color: var(--yu-secondary);
    font: 10px/1.5 var(--yu-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
  &[data-group-gap] {
    gap: var(--yu-menu-group-gap);
  }
  &[data-group-gap] > .yu-menu-group + .yu-menu-group {
    margin: 0;
    padding: 0;
    border: 0;
  }
`)
export const menuItemStyles = themed(css`
  position: relative;
  ${focus};
  ${interaction};
  min-height: var(--yu-touch-target);
  padding: var(--yu-space-2) var(--yu-space-3);
  display: flex;
  align-items: center;
  gap: var(--yu-space-2);
  width: 100%;
  min-width: 0;
  text-decoration: none;
  text-align: start;
  font: inherit;
  font-size: var(--yu-text-small);
  background: transparent;
  color: var(--yu-ink);
  border: 1px solid transparent;
  cursor: pointer;
  outline-offset: -2px;
  &:hover:not([aria-disabled="true"]):not(:disabled) {
    background: var(--yu-subtle);
  }
  &:active:not([aria-disabled="true"]):not(:disabled) {
    background: var(--yu-border);
  }
  &[aria-current][data-active-appearance="subtle"] {
    background: var(--yu-subtle);
    color: var(--yu-ink);
  }
  &[aria-current][data-active-appearance="subtle"]::before {
    content: "";
    position: absolute;
    inset-block: -1px;
    inset-inline-start: -1px;
    inline-size: var(--yu-menu-active-indicator-size, 2px);
    background: var(--yu-ink);
    pointer-events: none;
  }
  &[aria-current][data-active-appearance="solid"] {
    background: var(--yu-ink);
    color: var(--yu-paper);
    border-color: var(--yu-ink);
  }
  &[aria-current][data-active-appearance="solid"]:hover {
    background: var(--yu-ink);
    color: var(--yu-paper);
  }
  &[data-active-appearance="emphasis"] {
    color: var(--yu-secondary);
  }
  &[data-active-appearance="emphasis"] .yu-menu-text {
    display: block;
    transform-origin: left center;
    scale: 1;
    transition: scale 200ms var(--yu-motion-ease);
  }
  &[aria-current][data-active-appearance="emphasis"] {
    color: var(--yu-ink);
    background: transparent;
  }
  &[aria-current][data-active-appearance="emphasis"] .yu-menu-text {
    scale: 1.045;
  }
  &[aria-disabled="true"][data-active-appearance="emphasis"] .yu-menu-text {
    scale: 1;
  }
  &[aria-disabled="true"],
  &:disabled {
    color: var(--yu-muted);
    cursor: not-allowed;
  }
  & .yu-menu-icon {
    display: flex;
    flex-shrink: 0;
  }
  & .yu-menu-text {
    flex: 1;
    overflow-wrap: anywhere;
  }
  & .yu-menu-trailing {
    margin-inline-start: auto;
    font: 10px/1.5 var(--yu-mono);
    color: inherit;
  }
`)

export const menuDisclosureStyles = themed(css`
  &.yu-menu-disclosure {
    border: 0;
    width: auto;
  }
  &.yu-menu-disclosure .yu-disclosure-trigger {
    min-height: 44px;
    padding: 8px 0;
    font-size: 13px;
    gap: 8px;
  }
  &[data-size="medium"] .yu-disclosure-trigger {
    font-size: 16px;
  }
  &[data-size="large"] .yu-disclosure-trigger {
    font-size: 18px;
    min-height: 56px;
  }
  &.yu-menu-disclosure .yu-menu-disclosure-content {
    overflow: hidden;
  }
  &.yu-menu-disclosure .yu-disclosure-body {
    padding: 0;
  }
  &.yu-menu-disclosure .yu-menu-scroll {
    max-height: 50svh;
  }
  &.yu-menu-disclosure .yu-menu-scroll > .yu-scroll-viewport > div {
    padding: 16px 0;
  }
`)
