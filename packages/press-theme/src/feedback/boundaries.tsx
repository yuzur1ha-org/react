import { css } from "@emotion/react"
import { LoadingContext } from "./loading-context"
import { LoadingMark } from "./loading-mark"
import { loadingStyles, loadingLabelStyles } from "./loading.styles"
import { Component, useContext, useEffect, type ReactNode } from "react"
import { Button } from "@yuzur1ha/ui"
import { useMessages } from "../context"
export function DocumentFailure() {
  const text = useMessages()
  return (
    <main id="main" role="alert">
      <h1>{text.loadFailed}</h1>
      <p>{text.loadFailedDescription}</p>
      <Button onClick={() => window.location.reload()}>{text.retry}</Button>
    </main>
  )
}
export class DocumentBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <DocumentFailure /> : this.props.children
  }
}

export function DocumentLoading({
  overlay = false,
  leaving = false,
}: {
  overlay?: boolean
  leaving?: boolean
}) {
  const text = useMessages()
  const register = useContext(LoadingContext)
  useEffect(() => {
    if (!overlay) return register?.()
  }, [overlay, register])
  if (!overlay && register)
    return (
      <div
        className="press-loading-placeholder"
        aria-hidden="true"
        css={css`
          grid-column: 1 / -1;
          min-height: 55svh;
        `}
      />
    )
  return (
    <div
      className="press-loading-status"
      role="status"
      data-overlay={overlay}
      data-leaving={leaving}
      css={loadingStyles}
    >
      <div className="press-loading-indicator">
        <LoadingMark />
        <span className="press-loading-label" css={loadingLabelStyles}>
          {text.loading}
        </span>
      </div>
    </div>
  )
}
