import { useEffect, useState } from "react"
import type { OutlineHeading } from "./outline"

export function useActiveHeading(headings: OutlineHeading[]) {
  const [active, setActive] = useState<string>()
  useEffect(() => {
    let frame = 0
    let disposed = false
    const update = () => {
      frame = 0
      const nodes = headings.flatMap((heading) => {
        const node = document.getElementById(heading.id)
        return node ? [node] : []
      })
      let current = nodes[0]?.id
      for (const node of nodes) {
        const offset =
          Number.parseFloat(getComputedStyle(node).scrollMarginTop) || 128
        if (node.getBoundingClientRect().top > offset + 1) break
        current = node.id
      }
      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
      ) {
        current = nodes.at(-1)?.id
      }
      setActive(current)
    }
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    const main = document.getElementById("main")
    if (main) observer.observe(main)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)
    void document.fonts.ready.then(schedule)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
    }
  }, [headings])
  return active
}
