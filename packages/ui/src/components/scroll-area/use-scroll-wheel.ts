import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
  type WheelEvent as ReactWheelEvent,
} from "react"
import type { ScrollAreaProps } from "./scroll-area.types"

type Axis = "x" | "y"
type WheelAccumulator = {
  pending: number
  time: number
  position: number
  direction: number
}
const gestureIdleMs = 160
const accumulator = (): WheelAccumulator => ({
  pending: 0,
  time: 0,
  position: 0,
  direction: 0,
})

function horizontalBounds(node: HTMLElement) {
  const range = Math.max(0, node.scrollWidth - node.clientWidth)
  return getComputedStyle(node).direction === "rtl" ? [-range, 0] : [0, range]
}

function containsScroll(node: HTMLElement, axis: Axis) {
  const style = getComputedStyle(node)
  const [x, y = x] = (style.overscrollBehavior || "auto").split(/\s+/)
  return /contain|none/.test(
    (axis === "x"
      ? style.overscrollBehaviorX || x
      : style.overscrollBehaviorY || y) ?? "auto",
  )
}

function applyDelta(
  node: HTMLElement,
  axis: Axis,
  delta: number,
  time: number,
  state: WheelAccumulator,
) {
  if (!delta) return false
  const key = axis === "x" ? "scrollLeft" : "scrollTop"
  const previous = node[key]
  const direction = Math.sign(delta)
  if (
    time - state.time > gestureIdleMs ||
    direction !== state.direction ||
    previous !== state.position
  )
    state.pending = 0
  state.time = time
  state.direction = direction
  state.pending += delta
  const [minimum = 0, maximum = 0] =
    axis === "x"
      ? horizontalBounds(node)
      : [0, Math.max(0, node.scrollHeight - node.clientHeight)]
  if (
    (previous >= maximum && delta > 0) ||
    (previous <= minimum && delta < 0)
  ) {
    state.pending = 0
    state.position = previous
    return containsScroll(node, axis)
  }
  node[key] = Math.max(minimum, Math.min(previous + state.pending, maximum))
  state.pending -= node[key] - previous
  state.position = node[key]
  return true
}

function ownsHorizontalWheel(
  target: Element,
  viewport: HTMLElement,
  delta: number,
) {
  for (let child = target; child !== viewport;) {
    if (child instanceof HTMLElement) {
      const style = getComputedStyle(child)
      if (/auto|scroll/.test(style.overflowX)) {
        const [minimum = 0, maximum = 0] = horizontalBounds(child)
        if (
          containsScroll(child, "x") ||
          (delta > 0 ? child.scrollLeft < maximum : child.scrollLeft > minimum)
        )
          return false
      }
    }
    const parent = child.parentElement
    if (!parent) return false
    child = parent
  }
  return true
}

export function useScrollWheel(
  viewport: RefObject<HTMLDivElement | null>,
  orientation: ScrollAreaProps["orientation"],
) {
  const capturedEvents = useRef(
    new WeakMap<WheelEvent, ReactWheelEvent<HTMLDivElement>>(),
  )
  const captureWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    capturedEvents.current.set(event.nativeEvent, event)
  }, [])
  useEffect(() => {
    const node = viewport.current
    const root = node?.parentElement
    if (!node || !root) return
    const x = accumulator()
    const y = accumulator()
    let timer: ReturnType<typeof setTimeout> | undefined
    const restoreTracks = () => {
      clearTimeout(timer)
      root.removeAttribute("data-wheel-scrolling")
    }
    const wheel = (event: WheelEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const track = target.closest(".yu-scrollbar, .yu-scroll-corner")
      const ownTrack = track?.closest(".yu-scroll-area") === root
      if (ownTrack) {
        // Radix's document listener cancels even a zero delta on the track axis.
        event.stopPropagation()
      }
      // React's passive capture listener cannot cancel the native event itself.
      if (capturedEvents.current.get(event)?.isDefaultPrevented()) {
        if (event.cancelable) event.preventDefault()
        return
      }
      if (
        event.defaultPrevented ||
        !event.cancelable ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      )
        return
      if (target.closest("input, textarea, select, [contenteditable]")) return
      if (root.hasAttribute("data-wheel-scrolling") || ownTrack) {
        root.setAttribute("data-wheel-scrolling", "")
        clearTimeout(timer)
        timer = setTimeout(restoreTracks, gestureIdleMs)
      }
      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? parseFloat(getComputedStyle(node).lineHeight) || 16
          : 1
      const deltaX =
        (event.shiftKey && event.deltaX === 0 ? event.deltaY : event.deltaX) *
        (event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? node.clientWidth
          : unit)
      const deltaY =
        (event.shiftKey && event.deltaX === 0 ? 0 : event.deltaY) *
        (event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? node.clientHeight
          : unit)
      if (ownTrack) {
        // Rails are viewport siblings: compensate once, then let native hit testing own the gesture.
        const handledX =
          orientation !== "vertical" &&
          applyDelta(node, "x", deltaX, event.timeStamp, x)
        const handledY =
          orientation !== "horizontal" &&
          applyDelta(node, "y", deltaY, event.timeStamp, y)
        if (handledX || handledY) event.preventDefault()
        return
      }
      if (
        orientation === "vertical" ||
        !event.shiftKey ||
        event.deltaX !== 0 ||
        !deltaX ||
        !node.contains(target)
      )
        return
      if (!ownsHorizontalWheel(target, node, deltaX)) return
      if (applyDelta(node, "x", deltaX, event.timeStamp, x))
        event.preventDefault()
    }
    root.addEventListener("wheel", wheel, { passive: false })
    root.addEventListener("pointermove", restoreTracks)
    return () => {
      root.removeEventListener("wheel", wheel)
      root.removeEventListener("pointermove", restoreTracks)
      restoreTracks()
    }
  }, [viewport, orientation])
  return captureWheel
}
