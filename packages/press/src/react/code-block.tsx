import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import type { HighlightedCode } from "../content/code"
import { useMessages } from "./context"

export type CodeBlockViewProps = {
  children: ReactNode
  ready: boolean
  copy: boolean
  copyState: "idle" | "copied" | "failed"
  onCopy: () => void
  labels: {
    copy: string
    copied: string
    retry: string
    copyCode: string
    codeCopied: string
    copyFailed: string
    source: string
  }
}
const CodeViewContext = createContext<
  ComponentType<CodeBlockViewProps> | undefined
>(undefined)
export function CodeBlockProvider({
  view,
  children,
}: {
  view?: ComponentType<CodeBlockViewProps> | undefined
  children: ReactNode
}) {
  return <CodeViewContext value={view}>{children}</CodeViewContext>
}
export function CodeBlock({
  data,
  view,
}: {
  data: HighlightedCode
  view?: ComponentType<CodeBlockViewProps>
}) {
  const defaultView = useContext(CodeViewContext)
  const View = view ?? defaultView
  const labels = useMessages()
  const [ready, setReady] = useState(false)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  )
  const lifetime = useRef({
    generation: 0,
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
  })
  useEffect(() => {
    setReady(true)
  }, [])
  useEffect(() => {
    const session = lifetime.current
    session.generation++
    setCopyState("idle")
    return () => {
      session.generation++
      clearTimeout(session.timer)
    }
  }, [data.source])
  async function copy() {
    const session = lifetime.current
    const current = ++session.generation
    clearTimeout(session.timer)
    try {
      await navigator.clipboard.writeText(data.source)
      if (session.generation !== current) return
      setCopyState("copied")
      session.timer = setTimeout(() => {
        if (session.generation === current) setCopyState("idle")
      }, 2000)
    } catch {
      if (session.generation === current) setCopyState("failed")
    }
  }
  const children = (
    <pre className="source-code press-code" data-language={data.language}>
      {data.lineNumbers && (
        <span className="source-lines" aria-hidden="true">
          {data.lines.map((_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </span>
      )}
      <code>
        {data.lines.map((line, row) => (
          <span key={row}>
            {line.map((token, index) => (
              <span
                key={index}
                style={{
                  ...(token.color
                    ? token.darkColor
                      ? {
                          color: "var(--press-code-color, var(--code-light))",
                          "--code-light": token.color,
                          "--code-dark": token.darkColor,
                        }
                      : { color: token.color }
                    : {}),
                  ...(token.fontStyle && token.fontStyle & 1
                    ? { fontStyle: "italic" }
                    : {}),
                  ...(token.fontStyle && token.fontStyle & 2
                    ? { fontWeight: 600 }
                    : {}),
                  ...(token.fontStyle && token.fontStyle & 4
                    ? { textDecoration: "underline" }
                    : {}),
                }}
              >
                {token.text}
              </span>
            ))}
            {row < data.lines.length - 1 ? "\n" : ""}
          </span>
        ))}
      </code>
    </pre>
  )
  if (!data.enhanced) return children
  const props: CodeBlockViewProps = {
    children,
    ready,
    copy: data.copy,
    copyState,
    onCopy: () => {
      void copy()
    },
    labels,
  }
  if (View) return <View {...props} />
  return (
    <div className="press-code-fallback">
      <style>{`[data-theme="dark"] .press-code span[style] { --press-code-color: var(--code-dark); }`}</style>
      {children}
      {data.copy && ready && (
        <button
          type="button"
          aria-label={labels.copyCode}
          onClick={props.onCopy}
        >
          {copyState === "copied"
            ? labels.copied
            : copyState === "failed"
              ? labels.retry
              : labels.copy}
        </button>
      )}
      <p role="status">
        {copyState === "copied"
          ? labels.codeCopied
          : copyState === "failed"
            ? labels.copyFailed
            : ""}
      </p>
    </div>
  )
}
export function MarkdownTable({
  properties,
  children,
}: {
  properties?: Record<string, unknown>
  children?: ReactNode
}) {
  return (
    // This semantic scroll region handles arrows for engines without native keyboard scrolling.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="press-table-scroll"
      role="region"
      aria-label={useMessages().table}
      // A scroll region must be focusable for keyboard horizontal scrolling.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.target !== event.currentTarget ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        )
          return
        const node = event.currentTarget
        if (node.scrollWidth <= node.clientWidth) return
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault()
          node.scrollBy({
            left: event.key === "ArrowLeft" ? -40 : 40,
            behavior: "instant",
          })
        }
      }}
    >
      <table {...properties}>{children}</table>
    </div>
  )
}
