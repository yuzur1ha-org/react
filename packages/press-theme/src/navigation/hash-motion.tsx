import { useEffect } from "react"
import { useNavigate } from "react-router"

function hashLink(event: MouseEvent) {
  if (
    event.button ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  )
    return
  const link =
    event.target instanceof Element ? event.target.closest("a[href]") : null
  if (
    !(link instanceof HTMLAnchorElement) ||
    link.hasAttribute("download") ||
    (link.target && link.target !== "_self")
  )
    return
  let url: URL
  try {
    url = new URL(link.href)
  } catch {
    return
  }
  return url.hash &&
    url.origin === location.origin &&
    url.pathname === location.pathname &&
    url.search === location.search
    ? url
    : undefined
}
export function HashMotion() {
  const navigate = useNavigate()
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const root = document.documentElement
    const clear = () => {
      clearTimeout(timer)
      root.removeAttribute("data-yupress-hash-navigation")
    }
    const capture = (event: MouseEvent) => {
      if (!hashLink(event)) return
      root.setAttribute("data-yupress-hash-navigation", "")
      clearTimeout(timer)
      timer = setTimeout(clear, 3000)
    }
    const click = (event: MouseEvent) => {
      const url = hashLink(event)
      if (!url || event.defaultPrevented) return
      event.preventDefault()
      void navigate(
        { search: url.search, hash: url.hash },
        { preventScrollReset: true },
      )
    }
    document.addEventListener("click", capture, true)
    document.addEventListener("click", click)
    window.addEventListener("scrollend", clear)
    window.addEventListener("popstate", clear, true)
    return () => {
      clear()
      document.removeEventListener("click", capture, true)
      document.removeEventListener("click", click)
      window.removeEventListener("scrollend", clear)
      window.removeEventListener("popstate", clear, true)
    }
  }, [navigate])
  return null
}
