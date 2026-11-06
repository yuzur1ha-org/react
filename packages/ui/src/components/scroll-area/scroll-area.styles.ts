import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { focus, interaction } from "../../internal/styles"
export const scrollAreaStyles = themed(css`
  position: relative;
  overflow: hidden;
  width: 100%;
  min-width: 0;
  min-height: 0;
  &[data-appearance="normal"] {
    --yu-scrollbar-track: transparent;
    --yu-scrollbar-thumb: var(--yu-border);
    --yu-scrollbar-thumb-hover: var(--yu-border);
  }
  & > .yu-scroll-viewport {
    ${focus};
    width: 100%;
    height: 100%;
    max-height: inherit;
    outline-offset: -2px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  & .yu-scrollbar {
    display: flex;
    padding: 1px;
    background: var(--yu-scrollbar-track);
    touch-action: none;
    user-select: none;
  }
  &[data-wheel-scrolling] > .yu-scrollbar,
  &[data-wheel-scrolling] > .yu-scrollbar *,
  &[data-wheel-scrolling] > .yu-scroll-corner {
    pointer-events: none;
  }
  & .yu-scrollbar[data-orientation="vertical"] {
    width: 6px;
  }
  & .yu-scrollbar[data-orientation="horizontal"] {
    height: 6px;
    flex-direction: column;
  }
  & .yu-scroll-thumb {
    ${interaction};
    flex: 1;
    position: relative;
    background: var(--yu-scrollbar-thumb);
    border-radius: 0;
  }
  & .yu-scroll-thumb:hover,
  & .yu-scroll-thumb:active {
    background: var(--yu-scrollbar-thumb-hover);
  }
  &[data-appearance="normal"] .yu-scroll-thumb {
    opacity: 0.65;
  }
  &[data-appearance="normal"] .yu-scroll-thumb:hover,
  &[data-appearance="normal"] .yu-scroll-thumb:active {
    opacity: 1;
  }
  & .yu-scroll-thumb::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 24px;
    min-height: 24px;
  }
  &[data-appearance="hidden"] > .yu-scrollbar,
  &[data-appearance="hidden"] > .yu-scroll-corner {
    display: none;
  }
  & .yu-scroll-corner {
    background: var(--yu-scrollbar-track);
  }
`)
