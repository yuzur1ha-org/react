import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { ScrollArea } from "./scroll-area"

function dimensions(node: HTMLElement) {
  let x = 0
  let y = 0
  Object.defineProperties(node, {
    clientWidth: { configurable: true, value: 200 },
    scrollWidth: { configurable: true, value: 600 },
    clientHeight: { configurable: true, value: 200 },
    scrollHeight: { configurable: true, value: 800 },
    scrollLeft: {
      configurable: true,
      get: () => x,
      set: (value: number) => {
        x = Math.round(Math.max(0, Math.min(value, 400)))
      },
    },
    scrollTop: {
      configurable: true,
      get: () => y,
      set: (value: number) => {
        y = Math.round(Math.max(0, Math.min(value, 600)))
      },
    },
  })
}
function wheel(node: Element, options: WheelEventInit) {
  const event = new WheelEvent("wheel", {
    bubbles: true,
    cancelable: true,
    ...options,
  })
  node.dispatchEvent(event)
  return event
}

it("hands Shift wheel from an exhausted nested viewport to its ancestor without moving a sibling", () => {
  render(
    <>
      <ScrollArea label="Outer" orientation="both" type="always">
        <ScrollArea label="Inner" orientation="both" type="always">
          Content
        </ScrollArea>
      </ScrollArea>
      <ScrollArea label="Sibling" orientation="both" type="always">
        Other
      </ScrollArea>
    </>,
  )
  const outer = screen.getByRole("region", { name: "Outer" })
  const inner = screen.getByRole("region", { name: "Inner" })
  const sibling = screen.getByRole("region", { name: "Sibling" })
  for (const node of [outer, inner, sibling]) dimensions(node)
  wheel(inner, { shiftKey: true, deltaY: 80 })
  expect(inner.scrollLeft).toBe(80)
  expect(outer.scrollLeft).toBe(0)
  inner.scrollLeft = 400
  wheel(inner, { shiftKey: true, deltaY: 80 })
  expect(outer.scrollLeft).toBe(80)
  expect(sibling.scrollLeft).toBe(0)
  inner.scrollLeft = 0
  wheel(inner, { shiftKey: true, deltaY: -40 })
  expect(outer.scrollLeft).toBe(40)
})

it("respects containment at a nested boundary", () => {
  render(
    <ScrollArea label="Outer" orientation="both" type="always">
      <ScrollArea
        label="Inner"
        orientation="both"
        type="always"
        overscrollBehavior="contain"
      >
        Content
      </ScrollArea>
    </ScrollArea>,
  )
  const outer = screen.getByRole("region", { name: "Outer" })
  const inner = screen.getByRole("region", { name: "Inner" })
  dimensions(outer)
  dimensions(inner)
  inner.scrollLeft = 400
  expect(wheel(inner, { shiftKey: true, deltaY: 80 }).defaultPrevented).toBe(
    true,
  )
  expect(outer.scrollLeft).toBe(0)
})

it("lets native nested scroll regions own their range and releases only their auto boundary", () => {
  render(
    <ScrollArea label="Outer" orientation="both" type="always">
      <div data-testid="native" style={{ overflowX: "auto" }}>
        Content
      </div>
    </ScrollArea>,
  )
  const outer = screen.getByRole("region", { name: "Outer" })
  const native = screen.getByTestId("native")
  dimensions(outer)
  dimensions(native)
  expect(wheel(native, { shiftKey: true, deltaY: 80 }).defaultPrevented).toBe(
    false,
  )
  expect(outer.scrollLeft).toBe(0)
  native.scrollLeft = 400
  expect(wheel(native, { shiftKey: true, deltaY: 80 }).defaultPrevented).toBe(
    true,
  )
  expect(outer.scrollLeft).toBe(80)
  native.style.overscrollBehaviorX = "contain"
  wheel(native, { shiftKey: true, deltaY: 80 })
  expect(outer.scrollLeft).toBe(80)
})

it("routes both wheel axes over either track to its own viewport and restores dragging after the gesture", () => {
  vi.useFakeTimers()
  try {
    const { unmount } = render(
      <ScrollArea label="Tracks" orientation="both" type="always">
        Content
      </ScrollArea>,
    )
    const viewport = screen.getByRole("region", { name: "Tracks" })
    dimensions(viewport)
    const root = viewport.parentElement
    if (!root) throw new Error("Missing scroll root")
    const horizontal = root.querySelector(
      '.yu-scrollbar[data-orientation="horizontal"]',
    )
    const vertical = root.querySelector(
      '.yu-scrollbar[data-orientation="vertical"]',
    )
    if (!horizontal || !vertical) throw new Error("Missing tracks")
    viewport.scrollLeft = 80
    const documentWheel = vi.fn()
    document.addEventListener("wheel", documentWheel)
    try {
      expect(wheel(horizontal, { deltaY: 40 }).defaultPrevented).toBe(true)
      expect(viewport.scrollTop).toBe(40)
      expect(viewport.scrollLeft).toBe(80)
      expect(documentWheel).not.toHaveBeenCalled()
      expect(root).toHaveAttribute("data-wheel-scrolling")
      vi.advanceTimersByTime(161)
      expect(root).not.toHaveAttribute("data-wheel-scrolling")
      wheel(vertical, { deltaX: 40 })
      expect(viewport.scrollLeft).toBe(120)
      fireEvent.pointerMove(viewport)
      expect(root).not.toHaveAttribute("data-wheel-scrolling")
      wheel(horizontal, { deltaY: 0.2 })
      wheel(horizontal, { deltaY: 0.2 })
      wheel(horizontal, { deltaY: 0.2 })
      expect(viewport.scrollTop).toBe(41)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      document.removeEventListener("wheel", documentWheel)
    }
  } finally {
    vi.useRealTimers()
  }
})

it("applies containment only to enabled axes and allows viewport policies to override it", () => {
  const { rerender } = render(
    <ScrollArea
      label="Policy"
      orientation="horizontal"
      overscrollBehavior="contain"
    >
      Content
    </ScrollArea>,
  )
  const viewport = screen.getByRole("region", { name: "Policy" })
  expect(viewport).toHaveStyle({
    overscrollBehaviorX: "contain",
    overscrollBehaviorY: "auto",
  })
  rerender(
    <ScrollArea
      label="Policy"
      orientation="both"
      overscrollBehavior="contain auto"
    >
      Content
    </ScrollArea>,
  )
  expect(viewport).toHaveStyle({
    overscrollBehaviorX: "contain",
    overscrollBehaviorY: "auto",
  })
  rerender(
    <ScrollArea
      label="Policy"
      orientation="horizontal"
      overscrollBehavior="contain"
      viewportProps={{ style: { overscrollBehaviorY: "none" } }}
    >
      Content
    </ScrollArea>,
  )
  expect(viewport).toHaveStyle({
    overscrollBehaviorX: "contain",
    overscrollBehaviorY: "none",
  })
})

it("lets root capture handlers cancel both viewport and rail compensation", () => {
  render(
    <ScrollArea
      label="Cancelled"
      orientation="both"
      type="always"
      onWheelCapture={(event) => event.preventDefault()}
    >
      Content
    </ScrollArea>,
  )
  const viewport = screen.getByRole("region", { name: "Cancelled" })
  dimensions(viewport)
  expect(wheel(viewport, { shiftKey: true, deltaY: 80 }).defaultPrevented).toBe(
    true,
  )
  expect(viewport.scrollLeft).toBe(0)
  const track = viewport.parentElement?.querySelector(
    '.yu-scrollbar[data-orientation="horizontal"]',
  )
  if (!track) throw new Error("Missing horizontal rail")
  expect(wheel(track, { deltaY: 80 }).defaultPrevented).toBe(true)
  expect(viewport.scrollTop).toBe(0)
})

it("honors a nested React capture cancellation before either scroll owner consumes the event", () => {
  render(
    <ScrollArea label="Outer capture" orientation="both" type="always">
      <ScrollArea
        label="Inner capture"
        orientation="both"
        type="always"
        viewportProps={{ onWheelCapture: (event) => event.preventDefault() }}
      >
        Content
      </ScrollArea>
    </ScrollArea>,
  )
  const outer = screen.getByRole("region", { name: "Outer capture" })
  const inner = screen.getByRole("region", { name: "Inner capture" })
  dimensions(outer)
  dimensions(inner)
  expect(wheel(inner, { shiftKey: true, deltaY: 80 }).defaultPrevented).toBe(
    true,
  )
  expect(inner.scrollLeft).toBe(0)
  expect(outer.scrollLeft).toBe(0)
})
