import { mediaQueries } from "../breakpoints"
export const baseMarkdownStyles = `
.yu-markdown {
  --yu-markdown-leading: 1.85;
  min-width: 0;
  color: var(--yu-ink);
  font: 400 var(--yu-markdown-size, 16px)/var(--yu-markdown-leading) var(--yu-font);
  overflow-wrap: anywhere;
  text-wrap: pretty;
}
.yu-markdown > :where(*) { margin-block: 0 1.25em; }
.yu-markdown > :where(:last-child) { margin-bottom: 0; }
.yu-markdown :where(h1, h2, h3, h4, h5, h6) {
  color: var(--yu-ink);
  font-weight: 400;
  line-height: 1.25;
  text-wrap: balance;
  scroll-margin-top: var(--yu-markdown-scroll-offset, 128px);
}
.yu-markdown > :where(h1) { font-size: 2.75em; letter-spacing: -0.045em; }
.yu-markdown > :where(h2) { font-size: 1.75em; letter-spacing: -0.03em; }
.yu-markdown > :where(h3) { font-size: 1.3em; letter-spacing: -0.015em; }
.yu-markdown > :where(h4, h5, h6) { font-size: 1em; }
/* Ignore SSR style elements when determining whether a heading follows prose. */
.yu-markdown > :where(:not(style)) ~ :where(h2) { margin-top: 2em; }
.yu-markdown > :where(:not(style)) ~ :where(h3) { margin-top: 1.75em; }
.yu-markdown > :where(:not(style)) ~ :where(h4, h5, h6) { margin-top: 1.5em; }
.yu-markdown :where(strong) { font-weight: 600; }
.yu-markdown :where(a:not([class])) {
  color: inherit;
  text-decoration-line: underline;
  text-decoration-color: var(--yu-muted);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: text-decoration-color var(--yu-motion-fast) var(--yu-motion-ease);
}
.yu-markdown :where(a:not([class])):hover { text-decoration-color: currentColor; }
.yu-markdown :where(a):focus-visible { outline: 2px solid var(--yu-focus); outline-offset: 4px; }
.yu-markdown :where(ul, ol) { padding-inline-start: 1.5em; }
.yu-markdown :where(li) { padding-inline-start: 0.25em; }
.yu-markdown :where(li + li) { margin-top: 0.4em; }
.yu-markdown :where(li > ul, li > ol) { margin-block: 0.5em; }
.yu-markdown :where(li > p) { margin-block: 0.5em; }
.yu-markdown :where(li)::marker { color: var(--yu-secondary); }
.yu-markdown :where(blockquote) {
  margin-inline: 0;
  padding: 0.5em 1.25em;
  border-inline-start: 2px solid var(--yu-ink);
  color: var(--yu-secondary);
}
.yu-markdown :where(blockquote > p) { margin-block: 0; }
.yu-markdown :where(blockquote > p + p) { margin-top: 1em; }
.yu-markdown :where(code, kbd, samp) { font-family: var(--yu-mono); font-size: 0.85em; }
.yu-markdown :where(:not(pre) > code) {
  padding: 0.15em 0.4em;
  background: var(--yu-subtle);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.yu-markdown :where(pre) {
  min-width: 0;
  max-width: 100%;
  overflow: auto;
  padding: 24px;
  background: var(--yu-subtle);
  border: 1px solid var(--yu-border);
  line-height: 1.7;
  tab-size: 2;
  scrollbar-width: thin;
  scrollbar-color: var(--yu-scrollbar-thumb) transparent;
}
.yu-markdown :where(pre > code) { padding: 0; background: none; font-size: 13px; white-space: pre; overflow-wrap: normal; }
.yu-markdown :where(kbd) { padding: 0.1em 0.4em; background: var(--yu-surface); border: 1px solid var(--yu-border); border-bottom-width: 2px; }
.yu-markdown :where(hr) { height: 0; margin-block: 2.5em; border: 0; border-top: 1px solid var(--yu-border); }
.yu-markdown :where(img, video) { max-width: 100%; height: auto; }
.yu-markdown :where(figure) { margin-inline: 0; }
.yu-markdown :where(figcaption) { margin-top: 0.75em; font: 11px/1.6 var(--yu-mono); color: var(--yu-secondary); }
.yu-markdown :where(details) { border-block: 1px solid var(--yu-border); padding-block: 1em; }
.yu-markdown :where(summary) { cursor: pointer; color: var(--yu-ink); }
.yu-markdown :where(details[open] > summary) { margin-bottom: 1em; }
.yu-markdown :where(.footnotes) { border-top: 1px solid var(--yu-border); margin-top: 3em; padding-top: 1em; font-size: 0.85em; color: var(--yu-secondary); }
@media ${mediaQueries.phone} {
  .yu-markdown { --yu-markdown-size: 15px; }
  .yu-markdown :where(pre) { padding: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .yu-markdown :where(a) { transition: none; }
}
`
