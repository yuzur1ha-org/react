import { tableStyles } from "../table"
export const gfmMarkdownStyles = `
${tableStyles('.yu-markdown:where([data-markdown="gfm"], :not([data-markdown])) :where(table)')}
.yu-markdown :where(table) { display: block; width: max-content; max-width: 100%; overflow: auto; scrollbar-width: thin; }
.yu-markdown :where(.press-table-scroll) { max-width: 100%; overflow: auto; scrollbar-width: thin; }
.yu-markdown :where(.press-table-scroll):focus-visible { outline: 2px solid var(--yu-focus); outline-offset: 4px; }
.yu-markdown :where(.press-table-scroll table) { display: table; width: 100%; overflow: visible; }
.yu-markdown:where([data-markdown="gfm"], :not([data-markdown])) :where(del) { color: var(--yu-secondary); text-decoration-thickness: 1px; }
.yu-markdown:where([data-markdown="gfm"], :not([data-markdown])) :where(.contains-task-list) { list-style: none; padding-inline-start: 0; }
.yu-markdown:where([data-markdown="gfm"], :not([data-markdown])) :where(.task-list-item) { list-style: none; position: relative; padding-inline-start: 1.75em; }
.yu-markdown:where([data-markdown="gfm"], :not([data-markdown])) :where(.task-list-item input[type="checkbox"]) {
  position: absolute;
  inset-inline-start: 0;
  top: 0.45em;
  margin: 0;
  width: 1em;
  height: 1em;
  accent-color: var(--yu-ink);
}
`
