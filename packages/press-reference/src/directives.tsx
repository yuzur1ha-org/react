import type { HighlightedCode } from "@yuzur1ha/press/content"
import { demoStyles } from "./directives.styles"
import { useMessages } from "@yuzur1ha/press/react"
import type { ComponentType } from "react"
import { ApiTable } from "./api/api-table"
import type { ComponentApi } from "./api/api.types"
import { SourcePreview } from "./source/source-preview"
export function Demo({
  Component,
  source,
  code,
  file,
  id,
}: {
  Component: ComponentType
  source: string
  code?: HighlightedCode
  file: string
  id: string
}) {
  const text = useMessages()
  return (
    <div className="component-demo" css={demoStyles}>
      <div className="preview-heading">
        <span>{text.playground}</span>
        <span>{file.split("/").at(-1)}</span>
      </div>
      <section
        className={`demo-canvas demo-canvas--${id}`}
        aria-label={`${id} ${text.playground}`}
      >
        <div className="demo-content">
          <Component />
        </div>
      </section>
      <SourcePreview source={source} name={file} {...(code ? { code } : {})} />
    </div>
  )
}
export function Schema({ schema }: { schema: ComponentApi }) {
  return <ApiTable schema={schema} />
}
