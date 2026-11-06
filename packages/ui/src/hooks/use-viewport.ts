import { useSyncExternalStore } from "react"
import { mediaQueries } from "@yuzur1ha/token"

type ViewportLayout = "phone" | "tablet" | "desktop"
const listeners = new Set<() => void>()
let media: { phone: MediaQueryList; desktop: MediaQueryList } | undefined

function queries() {
  return (media ??= {
    phone: window.matchMedia(mediaQueries.phone),
    desktop: window.matchMedia(mediaQueries.desktop),
  })
}
function snapshot(): ViewportLayout {
  const current = queries()
  return current.phone.matches
    ? "phone"
    : current.desktop.matches
      ? "desktop"
      : "tablet"
}
function notify() {
  listeners.forEach((listener) => listener())
}
function subscribe(listener: () => void) {
  const current = queries()
  if (!listeners.size)
    Object.values(current).forEach((query) =>
      query.addEventListener("change", notify),
    )
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (!listeners.size) {
      Object.values(current).forEach((query) =>
        query.removeEventListener("change", notify),
      )
      media = undefined
    }
  }
}
export function useViewportLayout() {
  return useSyncExternalStore(
    subscribe,
    snapshot,
    (): ViewportLayout => "desktop",
  )
}
