import { loadingMarkStyles } from "./loading.styles"

export function LoadingMark() {
  return (
    <span
      className="press-loading-mark"
      aria-hidden="true"
      css={loadingMarkStyles}
    >
      <span className="press-loading-squares">
        <i />
        <i />
        <i />
        <i />
      </span>
    </span>
  )
}
