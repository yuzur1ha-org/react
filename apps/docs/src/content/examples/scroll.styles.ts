import { css } from "@emotion/react"

export const scrollStyles = css`
  .demo-scroll-group {
    display: grid;
    gap: 16px;
    min-width: 0;
  }
  .demo-scroll-group > h2 {
    font-size: 20px;
  }
  .demo-scroll-group > .demo-label {
    margin: 0;
    line-height: 1.6;
    color: var(--yu-secondary);
  }
  .demo-scroll-comparison {
    display: grid;
    gap: 24px;
  }
  .demo-scroll-variant {
    display: grid;
    gap: 12px;
    min-width: 0;
  }
  .demo-scroll-variant > h3 {
    font: 11px/1.5 var(--yu-mono);
    color: var(--yu-secondary);
  }
  .demo-scroll-list {
    height: 220px;
    border: 1px solid var(--yu-border);
  }
  .demo-scroll-items {
    list-style: none;
    margin: 0;
    padding: 8px 20px;
  }
  .demo-scroll-items > li {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding-block: 14px;
    border-bottom: 1px solid var(--yu-border);
    font-size: 14px;
  }
  .demo-scroll-items > li > span,
  .demo-scroll-card > span {
    color: var(--yu-secondary);
    font: 10px/1.5 var(--yu-mono);
  }
  .demo-scroll-both {
    height: 280px;
    max-width: 432px;
    justify-self: center;
    border: 1px solid var(--yu-border);
  }
  .demo-scroll-notes {
    width: 640px;
    padding: 24px;
  }
  .demo-scroll-notes > h3 {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .demo-scroll-notes > p {
    padding-block: 12px;
    border-bottom: 1px solid var(--yu-border);
    font-size: 14px;
  }
  .demo-scroll-horizontal {
    height: 176px;
    border: 1px solid var(--yu-border);
  }
  .demo-scroll-cards {
    display: flex;
    width: max-content;
    gap: 16px;
    padding: 16px 16px 24px;
  }
  .demo-scroll-card {
    display: grid;
    align-content: start;
    gap: 12px;
    width: 200px;
    padding: 16px;
    border: 1px solid var(--yu-border);
    background: var(--yu-paper);
  }
  .demo-scroll-card h3 {
    font-size: 16px;
  }
  .demo-scroll-card p {
    font-size: 13px;
    line-height: 1.6;
    color: var(--yu-secondary);
  }
  @container (min-width: 640px) {
    .demo-scroll-comparison {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`
