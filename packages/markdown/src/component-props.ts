import type { ComponentType, JSX } from "react"
/** Host-owned components replace standard Markdown elements at render time. */
export type MarkdownComponentProps = {
  components?: {
    [Tag in keyof JSX.IntrinsicElements]?: ComponentType<
      JSX.IntrinsicElements[Tag]
    >
  }
}
