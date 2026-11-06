import { createContext, useContext, useEffect } from "react"
import { NavigationType, useLocation, useNavigationType } from "react-router"
import { navigateHash } from "./hash-navigation"

export const InitialHashContext = createContext<
  { key: string; pending: boolean } | undefined
>(undefined)

export function useDocumentHash(documentKey: string) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const initial = useContext(InitialHashContext)
  useEffect(() => {
    let cancelled = false
    let frame = 0
    void document.fonts.ready.then(() => {
      if (cancelled || !location.hash) return
      const firstEntry = initial?.pending && initial.key === location.key
      if (firstEntry && initial) initial.pending = false
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
      if (firstEntry && !reduced) {
        // Native fragment positioning happens before hydration. Start the enhanced entry at the top.
        window.scrollTo({ top: 0, behavior: "instant" })
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => navigateHash(location.hash))
        })
      } else {
        navigateHash(
          location.hash,
          navigationType === NavigationType.Pop ? "instant" : undefined,
        )
      }
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [documentKey, location.hash, location.key, navigationType, initial])
}
