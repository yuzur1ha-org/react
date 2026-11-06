import { CodeBlock } from "@yuzur1ha/press/react"
import type { HighlightedCode } from "@yuzur1ha/press/content"
import {
  CodePanel,
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@yuzur1ha/ui"
import { styles } from "./source-preview.styles"
export function SourcePreview({
  source,
  name,
  code,
}: {
  source: string
  name: string
  code?: HighlightedCode
}) {
  const data =
    code?.source === source
      ? code
      : {
          source,
          lines: source.split("\n").map((text) => [{ text }]),
          enhanced: code?.enhanced ?? true,
          copy: code?.copy ?? true,
          lineNumbers: true,
        }
  return (
    <Disclosure className="usage" css={styles} defaultOpen>
      <div className="usage-toolbar">
        <DisclosureTrigger>React / TypeScript</DisclosureTrigger>
      </div>
      <DisclosureContent>
        <div className="source-panel">
          <div className="source-meta">
            <span title={name}>{name}</span>
          </div>
          <CodeBlock
            data={{ ...data, enhanced: true, lineNumbers: true }}
            view={CodePanel}
          />
        </div>
      </DisclosureContent>
    </Disclosure>
  )
}
