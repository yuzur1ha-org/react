import { css } from "@emotion/react"

export const drawerStyles = css`
  .yu-drawer-body {
    display: flex;
    padding: 0;
    overflow: hidden;
  }
  .press-drawer-scroll {
    flex: 1;
    min-height: 0;
    container-type: size;
  }
  .press-drawer-content {
    min-height: 100cqh;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
  }
  .press-drawer-navigation {
    flex-shrink: 0;
  }
  .press-drawer-navigation .yu-menu-item,
  .press-drawer-text-links .yu-menu-item {
    min-height: 44px;
    padding: 10px 12px;
    font-size: 15px;
    line-height: 1.5;
    letter-spacing: -0.01em;
  }
  .press-drawer-text-links {
    flex-shrink: 0;
    padding-top: 16px;
    border-top: 1px solid var(--yu-border);
  }
  .press-drawer-text-links .yu-menu-item > svg {
    display: flex;
    color: var(--yu-secondary);
  }
  .press-drawer-navigation .yu-menu-label {
    padding: 0 12px 8px;
    font: 10px/1.5 var(--yu-mono);
    letter-spacing: 0.1em;
  }
  .press-text-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding-inline: 16px;
  }
  .press-drawer-settings {
    margin-top: auto;
    display: grid;
    gap: 24px;
    padding-top: 16px;
  }
  .press-icon-links-scroll {
    max-width: none;
  }
  .press-icon-links {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
    background: var(--yu-subtle);
    border: 1px solid var(--yu-border);
  }
  .press-controls {
    display: grid;
    gap: 8px;
    margin: 0;
    width: 100%;
    border-top: 1px solid var(--yu-border);
    padding-top: 24px;
  }
  .press-theme-setting,
  .press-language-setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 44px;
  }
  .press-language-setting > .yu-field {
    min-width: 0;
    width: 80px;
    flex: none;
  }
  .press-language-setting .yu-select {
    padding-inline: 12px;
    gap: 8px;
  }
  .press-theme-control {
    box-sizing: border-box;
    width: 80px;
    padding-inline: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }
  .press-theme-setting > span,
  .press-language-setting > span {
    font: 11px var(--yu-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--yu-secondary);
  }
`
