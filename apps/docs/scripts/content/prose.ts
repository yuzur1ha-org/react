import type { CompilerOptions } from "@yuzur1ha/markdown/compiler"
type Root = Parameters<CompilerOptions<unknown>["analyze"]>[0]

export function wrapProse(tree: Root) {
  const children = tree.children
  tree.children = []
  let prose: typeof children = []
  const flush = () => {
    if (!prose.length) return
    tree.children.push({
      type: "element",
      tagName: "div",
      properties: {
        className: ["component-prose", "yu-markdown"],
        "data-markdown": "gfm",
      },
      children: prose.filter((node) => node.type !== "doctype"),
    })
    prose = []
  }
  for (const node of children) {
    if (node.type === "documentationDirective") {
      flush()
      tree.children.push(node)
    } else prose.push(node)
  }
  flush()
}
