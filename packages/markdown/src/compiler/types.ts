import type { Options as MdastToHastOptions } from "mdast-util-to-hast"
import type { Element, Root, ElementContent } from "hast"
import type { Position } from "unist"
import type { VFile } from "vfile"
import type { Program, Expression } from "estree"
import type { PluggableList } from "unified"

export type DirectiveNode = {
  type: "documentationDirective"
  kind: "textDirective" | "leafDirective" | "containerDirective"
  name: string
  attributes: Record<string, string | null | undefined>
  children: ElementContent[]
  position?: Position | undefined
}
declare module "hast" {
  interface Data {
    markdownCode?: string
    markdownTable?: boolean
  }
  interface RootContentMap {
    documentationDirective: DirectiveNode
  }
  interface ElementContentMap {
    documentationDirective: DirectiveNode
  }
}
export type ModuleReference = { from: string; name?: string }
export type Binding = { type: "binding"; name: string }
export type ComponentNode = {
  component: ModuleReference
  props?: Record<string, unknown>
  children?: ElementContent[]
}
export type CompilerContext = {
  file: VFile
  frontmatter: unknown
  frontmatterSource?: string
  frontmatterPosition?: Position | undefined
  dependencies: Set<string>
  import: (reference: ModuleReference) => Binding
  expression: (value: unknown) => Expression
  fail: (message: string, place?: Position) => never
}
export type DirectiveRule = {
  kind: DirectiveNode["kind"]
  render: (
    node: DirectiveNode,
    context: CompilerContext,
  ) => ComponentNode | Promise<ComponentNode>
}
export type CompilerOptions<Metadata> = {
  elementRenderers?: Record<
    string,
    (
      element: Element,
      context: CompilerContext,
    ) => ComponentNode | undefined | Promise<ComponentNode | undefined>
  >
  directives?: Record<string, DirectiveRule>
  handlers?: MdastToHastOptions["handlers"]
  passThrough?: string[]
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  analyze: (
    tree: Root,
    context: CompilerContext,
  ) => Metadata | Promise<Metadata>
  html?: (element: Element, context: CompilerContext) => void
}
export type CompiledDocument<Metadata> = {
  code: string
  map: VFile["map"]
  metadata: Metadata
  frontmatter: unknown
  frontmatterSource?: string
  frontmatterPosition?: Position
  dependencies: string[]
}
export type ImportProgram = Program["body"]
