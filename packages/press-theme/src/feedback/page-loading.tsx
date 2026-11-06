import { useCallback, useEffect, useState, type ReactNode } from "react"
import { useNavigation } from "react-router"
import { LoadingContext } from "./loading-context"
import { useMinimumVisible } from "./use-minimum-visible"
import { DocumentLoading } from "./boundaries"

export function PageLoading({ children }: { children: ReactNode }) {
  const navigation = useNavigation()
  const [bodies, setBodies] = useState(0)
  const register = useCallback(() => {
    setBodies((count) => count + 1)
    return () => setBodies((count) => count - 1)
  }, [])
  const visible = useMinimumVisible(navigation.state !== "idle" || bodies > 0)
  const [present, setPresent] = useState(false)
  useEffect(() => {
    if (visible) {
      setPresent(true)
      return
    }
    if (!present) return
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : 160
    const timer = window.setTimeout(() => setPresent(false), duration)
    return () => window.clearTimeout(timer)
  }, [visible, present])
  return (
    <LoadingContext value={register}>
      {children}
      {(visible || present) && <DocumentLoading overlay leaving={!visible} />}
    </LoadingContext>
  )
}
