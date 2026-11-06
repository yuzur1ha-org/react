import { useEffect, useRef } from "react"
import { pressLayout } from "../layout/metrics"
export function useHeaderScroll() {
  const header = useRef<HTMLElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const progress = Math.min(
        Math.max(scrollY / pressLayout.headerTravel, 0),
        1,
      )
      const height =
        pressLayout.headerExpanded -
        progress * (pressLayout.headerExpanded - pressLayout.headerCollapsed)
      const shell = header.current?.closest<HTMLElement>(".press-shell")
      shell?.style.setProperty("--press-header-height", `${height}px`)
      shell?.style.setProperty("--press-header-progress", String(progress))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])
  return header
}
