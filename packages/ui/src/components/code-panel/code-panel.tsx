import { useTokens } from "../../theme/provider"
import type { ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "../button"
import { ScrollArea } from "../scroll-area"
import { styles } from "./code-panel.styles"
export type CodePanelProps = {
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
export function CodePanel({
  children,
  ready,
  copy,
  copyState,
  onCopy,
  labels,
}: CodePanelProps) {
  const theme = useTokens()
  return (
    <div
      className="yu-code-panel"
      data-code-theme={theme["color-scheme"]}
      css={styles}
      data-source-ready={ready ? "true" : undefined}
    >
      <p
        className={
          copyState === "failed" ? "source-copy-error" : "source-copy-status"
        }
        role="status"
      >
        {copyState === "copied"
          ? labels.codeCopied
          : copyState === "failed"
            ? labels.copyFailed
            : ""}
      </p>
      <ScrollArea
        label={labels.source}
        orientation="both"
        appearance="normal"
        type="auto"
        className="source-scroll"
        viewportProps={{
          onKeyDown(event) {
            if (
              event.target !== event.currentTarget ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey
            )
              return
            if (
              event.currentTarget.scrollWidth >
                event.currentTarget.clientWidth &&
              (event.key === "ArrowLeft" || event.key === "ArrowRight")
            ) {
              event.preventDefault()
              event.currentTarget.scrollBy({
                left: event.key === "ArrowLeft" ? -40 : 40,
                behavior: "instant",
              })
            }
          },
        }}
      >
        {copy && (
          <div className="source-copy-overlay">
            <Button
              className="source-copy-button"
              appearance="secondary"
              size="small"
              aria-label={labels.copyCode}
              onClick={onCopy}
              style={{ visibility: ready ? "visible" : "hidden" }}
            >
              {copyState === "copied" ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}
              <span>
                {copyState === "copied"
                  ? labels.copied
                  : copyState === "failed"
                    ? labels.retry
                    : labels.copy}
              </span>
            </Button>
          </div>
        )}
        {children}
      </ScrollArea>
    </div>
  )
}
