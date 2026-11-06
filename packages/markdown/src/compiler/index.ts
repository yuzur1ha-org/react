import { defaultHandlers } from "mdast-util-to-hast"
import { compile, type CompileOptions } from "@mdx-js/mdx"
import remarkFrontmatter from "remark-frontmatter"
import remarkDirective from "remark-directive"
import rehypeRaw from "rehype-raw"
import { parseDocument } from "yaml"
import { SourceMapGenerator } from "source-map"
import { VFile } from "vfile"
import type {
  Root as MarkdownRoot,
  Nodes as MarkdownNodes,
  Code,
  Table,
} from "mdast"
import type { Root, RootContent } from "hast"
import type { MdxJsxFlowElementHast, MdxJsxAttribute } from "mdast-util-mdx-jsx"
import { moduleBindings } from "./modules"
import type {
  CompiledDocument,
  CompilerContext,
  CompilerOptions,
} from "./types"
export type * from "./types"

export async function compileDocument<Metadata>(
  source: string,
  filePath: string,
  options: CompilerOptions<Metadata>,
): Promise<CompiledDocument<Metadata>> {
  const file = new VFile({ value: source, path: filePath })
  const bindings = moduleBindings()
  const context: CompilerContext = {
    file,
    frontmatter: {},
    dependencies: new Set(),
    import: (reference) => {
      if (/^(?:\.{1,2}\/|\/|[A-Za-z]:[\\/])/.test(reference.from))
        context.dependencies.add(reference.from.split("?")[0] ?? reference.from)
      return bindings.reference(reference)
    },
    expression: bindings.expression,
    fail: (message, place) => file.fail(message, place),
  }

  const codeSources = new Map<number, string>()
  const tableOffsets = new Set<number>()
  let metadata: Metadata | undefined
  const frontmatter = () => (tree: MarkdownRoot) => {
    const matter = tree.children[0]
    if (matter?.type !== "yaml") {
      const normalized = source.replace(/^\uFEFF/, "")
      if (normalized.startsWith("---\n") || normalized.startsWith("---\r\n"))
        file.fail("Unclosed frontmatter", { line: 1, column: 1 })
      return
    }
    const document = parseDocument(matter.value, { uniqueKeys: true })
    const error = document.errors[0]
    if (error) {
      const line = error.linePos?.[0]
      file.fail(
        `Invalid frontmatter: ${error.message}`,
        line
          ? {
              line: line.line + (matter.position?.start.line ?? 1),
              column: line.col,
            }
          : matter.position,
      )
    }
    const value: unknown = document.toJS({ maxAliasCount: 100 })
    context.frontmatter = matter.value.trim() ? value : {}
    context.frontmatterSource = matter.value
    context.frontmatterPosition = matter.position
    tree.children.shift()
  }
  const lower = () => async (tree: Root) => {
    const walk = async (parent: { children: RootContent[] }) => {
      for (let index = 0; index < parent.children.length; index++) {
        const node = parent.children[index]
        if (!node) continue

        if (node.type === "element") options.html?.(node, context)
        if ("children" in node) await walk(node)
        let rendered
        if (node.type === "documentationDirective") {
          const rule = options.directives?.[node.name]
          if (!rule || rule.kind !== node.kind)
            context.fail(
              `Unknown or misplaced directive ${node.name}`,
              node.position,
            )
          rendered = await rule.render(node, context)
        } else if (node.type === "element") {
          rendered = await options.elementRenderers?.[node.tagName]?.(
            node,
            context,
          )
        }
        if (!rendered || !("children" in node)) continue
        const component = context.import(rendered.component)

        const propExpression = (value: unknown) => {
          try {
            return context.expression(value)
          } catch (error) {
            return context.fail(
              error instanceof Error
                ? error.message
                : "Invalid component prop data",
              node.position,
            )
          }
        }

        const attributes: MdxJsxAttribute[] = Object.entries(
          rendered.props ?? {},
        ).map(([name, value]) => ({
          type: "mdxJsxAttribute",
          name,
          value: {
            type: "mdxJsxAttributeValueExpression",
            value: "",
            data: {
              estree: {
                type: "Program",
                sourceType: "module",
                body: [
                  {
                    type: "ExpressionStatement",
                    expression: propExpression(value),
                  },
                ],
              },
            },
          },
        }))
        const element: MdxJsxFlowElementHast = {
          type: "mdxJsxFlowElement",
          name: component.name,
          attributes,
          children: rendered.children ?? node.children,
          ...(node.position ? { position: node.position } : {}),
        }
        parent.children[index] = element
      }
    }
    await walk(tree)
    tree.children.unshift({
      type: "mdxjsEsm",
      value: "",
      data: { estree: bindings.program() },
    })
  }

  type Handlers = NonNullable<
    NonNullable<CompileOptions["remarkRehypeOptions"]>["handlers"]
  >
  const directiveHandler: NonNullable<Handlers["textDirective"]> = (
    state,
    node: MarkdownNodes,
  ) => {
    /**
     * remark-directive emits exactly three AST node types:
     * - textDirective
     * - leafDirective
     * - containerDirective
     * Custom directive node types are not supported.
     */
    if (
      node.type !== "textDirective" &&
      node.type !== "leafDirective" &&
      node.type !== "containerDirective"
    )
      return context.fail("Invalid directive node", node.position)

    return {
      type: "documentationDirective",
      kind: node.type,
      name: node.name,
      attributes: node.attributes ?? {},
      children: state.all(node),
      position: node.position,
    }
  }

  const result = await compile(file, {
    format: "md",
    SourceMapGenerator,
    // remark plugins: applied to mdast (mdast -> mdast)
    remarkPlugins: [
      remarkFrontmatter,
      remarkDirective,
      frontmatter,
      ...(options.remarkPlugins ?? []),
    ],
    remarkRehypeOptions: {
      unknownHandler: (_state, node: MarkdownNodes) =>
        context.fail(`Unsupported Markdown node ${node.type}`, node.position),
      // handlers: custom mdast -> hast node conversions
      handlers: {
        code(state, node: Code) {
          if (node.position?.start.offset !== undefined)
            codeSources.set(node.position.start.offset, node.value)
          const element = defaultHandlers.code(state, node)
          if (element && !Array.isArray(element) && element.type === "element")
            element.data = { ...element.data, markdownCode: node.value }
          return element
        },
        table(state, node: Table) {
          if (node.position?.start.offset !== undefined)
            tableOffsets.add(node.position.start.offset)
          const element = defaultHandlers.table(state, node)
          if (element && !Array.isArray(element) && element.type === "element")
            element.data = { ...element.data, markdownTable: true }
          return element
        },
        ...options.handlers,
        textDirective: directiveHandler,
        leafDirective: directiveHandler,
        containerDirective: directiveHandler,
      },
      passThrough: [],
    },
    // rehype plugins: applied to hast (hast -> hast)
    rehypePlugins: [
      [
        rehypeRaw,
        {
          passThrough: [
            "documentationDirective",
            ...(options.passThrough ?? []),
          ],
        },
      ],
      () => (tree: Root) => {
        const mark = (parent: { children: RootContent[] }) => {
          for (const node of parent.children) {
            if (
              node.type === "element" &&
              node.position?.start.offset !== undefined
            ) {
              const offset = node.position.start.offset
              if (node.tagName === "pre" && codeSources.has(offset))
                node.data = {
                  ...node.data,
                  markdownCode: codeSources.get(offset)!,
                }
              if (node.tagName === "table" && tableOffsets.has(offset))
                node.data = { ...node.data, markdownTable: true }
            }
            if ("children" in node) mark(node)
          }
        }
        mark(tree)
      },
      ...(options.rehypePlugins ?? []),
      () => async (tree: Root) => {
        const validate = (parent: { children: RootContent[] }) => {
          for (const node of parent.children) {
            if (node.type === "element") options.html?.(node, context)
            if ("children" in node) validate(node)
          }
        }
        validate(tree)
        metadata = await options.analyze(tree, context)
      },
      lower,
    ],
  })

  if (metadata === undefined)
    context.fail("Document analysis did not produce metadata")

  return {
    code: String(result),
    map: result.map,
    metadata,
    frontmatter: context.frontmatter,
    ...(context.frontmatterSource !== undefined
      ? { frontmatterSource: context.frontmatterSource }
      : {}),
    ...(context.frontmatterPosition
      ? { frontmatterPosition: context.frontmatterPosition }
      : {}),
    dependencies: [...context.dependencies].sort(),
  }
}
