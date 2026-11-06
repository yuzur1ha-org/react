import { mediaQueries } from "./breakpoints"

/** Shared semantic table styling; callers own sizing and overflow. */
export function tableStyles(selector: string) {
  return `
${selector} { border-collapse: collapse; text-align: start; font-size: 12px; line-height: 1.7; font-variant-numeric: tabular-nums; }
${selector} :where(th, td) { padding: 12px 16px; border: 0; border-bottom: 1px solid var(--yu-border); vertical-align: top; font-weight: 400; }
${selector} :where(th) { text-align: inherit; }
${selector} :where(thead) { background: var(--yu-subtle); color: var(--yu-secondary); }
${selector} :where(code) { font: 11px/1.7 var(--yu-mono); padding: 0; background: none; }
@media ${mediaQueries.phone} { ${selector} :where(th, td) { padding: 12px; } }
`
}
