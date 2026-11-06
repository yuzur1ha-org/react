import { useEffect, useRef, useState } from "react"

export const pageLoadingMinimum = 400

export function useMinimumVisible(
  pending: boolean,
  minimum = pageLoadingMinimum,
) {
  const started = useRef<number | undefined>(undefined)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (pending) {
      started.current ??= performance.now()
      setVisible(true)
      return
    }
    if (started.current === undefined) return
    const remaining = Math.max(
      0,
      minimum - (performance.now() - started.current),
    )
    const timer = window.setTimeout(() => {
      started.current = undefined
      setVisible(false)
    }, remaining)
    return () => window.clearTimeout(timer)
  }, [pending, minimum])
  return pending || visible
}
