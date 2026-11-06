import { createRef } from "react"
import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ScrollArea } from "./scroll-area"
it("exposes a named keyboard-focusable viewport and preserves root and viewport refs", () => {
  const root = createRef<HTMLDivElement>()
  const viewport = createRef<HTMLDivElement>()
  render(
    <ScrollArea
      label="Activity"
      ref={root}
      orientation="both"
      type="always"
      viewportProps={{ ref: viewport }}
    >
      <p>History</p>
    </ScrollArea>,
  )
  const region = screen.getByRole("region", { name: "Activity" })
  expect(region).toHaveAttribute("tabindex", "0")
  expect(viewport.current).toBe(region)
  expect(root.current).toHaveClass("yu-scroll-area")
  expect(root.current?.querySelectorAll(".yu-scrollbar")).toHaveLength(2)
})

it("maps Shift wheel only to an available horizontal axis and respects cancellation", () => {
  const { rerender } = render(
    <ScrollArea label="Timeline" orientation="both">
      <span>History</span>
    </ScrollArea>,
  )
  const viewport = screen.getByRole("region", { name: "Timeline" })
  let position = 0
  Object.defineProperties(viewport, {
    clientWidth: { configurable: true, value: 200 },
    scrollWidth: { configurable: true, value: 600 },
    scrollLeft: {
      configurable: true,
      get: () => position,
      set: (value: number) => {
        position = Math.max(0, Math.min(value, 400))
      },
    },
  })
  const wheel = (options: WheelEventInit) => {
    const event = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      ...options,
    })
    viewport.dispatchEvent(event)
    return event.defaultPrevented
  }
  expect(wheel({ shiftKey: true, deltaY: 80 })).toBe(true)
  expect(position).toBe(80)
  expect(wheel({ deltaY: 80 })).toBe(false)
  expect(position).toBe(80)
  expect(wheel({ shiftKey: true, deltaX: 20, deltaY: 80 })).toBe(false)
  expect(wheel({ shiftKey: true, ctrlKey: true, deltaY: 80 })).toBe(false)
  expect(wheel({ shiftKey: true, deltaY: 80, cancelable: false })).toBe(false)
  expect(position).toBe(80)
  position = 400
  expect(wheel({ shiftKey: true, deltaY: 80 })).toBe(false)
  const cancel = (event: Event) => event.preventDefault()
  viewport.addEventListener("wheel", cancel, { capture: true })
  position = 0
  wheel({ shiftKey: true, deltaY: 80 })
  expect(position).toBe(0)
  viewport.removeEventListener("wheel", cancel, { capture: true })
  rerender(
    <ScrollArea label="Timeline" orientation="vertical">
      History
    </ScrollArea>,
  )
  expect(wheel({ shiftKey: true, deltaY: 80 })).toBe(false)
  expect(position).toBe(0)
})

it("defaults to contrast and changes appearance without replacing the viewport", () => {
  const { rerender } = render(<ScrollArea label="Activity">History</ScrollArea>)
  const viewport = screen.getByRole("region", { name: "Activity" })
  const root = viewport.parentElement
  expect(root).toHaveAttribute("data-appearance", "contrast")
  rerender(
    <ScrollArea label="Activity" appearance="normal">
      History
    </ScrollArea>,
  )
  expect(root).toHaveAttribute("data-appearance", "normal")
  expect(screen.getByRole("region", { name: "Activity" })).toBe(viewport)
  expect(root).not.toHaveAttribute("appearance")
})

it("defaults to native scroll chaining and allows explicit containment or viewport overrides", () => {
  const { rerender } = render(<ScrollArea label="Chaining">Content</ScrollArea>)
  const viewport = screen.getByRole("region", { name: "Chaining" })
  expect(viewport).toHaveStyle({
    overscrollBehaviorX: "auto",
    overscrollBehaviorY: "auto",
  })
  expect(viewport.parentElement).not.toHaveAttribute("overscrollBehavior")
  rerender(
    <ScrollArea label="Chaining" overscrollBehavior="contain">
      Content
    </ScrollArea>,
  )
  expect(viewport).toHaveStyle({
    overscrollBehaviorX: "auto",
    overscrollBehaviorY: "contain",
  })
  rerender(
    <ScrollArea
      label="Chaining"
      overscrollBehavior="contain"
      viewportProps={{ style: { overscrollBehavior: "none" } }}
    >
      Content
    </ScrollArea>,
  )
  expect(viewport).toHaveStyle({ overscrollBehavior: "none" })
})

it("accumulates fractional Shift wheel input and clears residual input on reversal and external scrolling", () => {
  render(
    <ScrollArea label="Fractional" orientation="both">
      History
    </ScrollArea>,
  )
  const viewport = screen.getByRole("region", { name: "Fractional" })
  let position = 0
  Object.defineProperties(viewport, {
    clientWidth: { configurable: true, value: 200 },
    scrollWidth: { configurable: true, value: 600 },
    scrollLeft: {
      configurable: true,
      get: () => position,
      set: (value: number) => {
        position = Math.round(Math.max(0, Math.min(value, 400)))
      },
    },
  })
  let time = 0
  const wheel = (deltaY: number, elapsed = 1) => {
    const event = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      shiftKey: true,
      deltaY,
    })
    time += elapsed
    Object.defineProperty(event, "timeStamp", { value: time })
    viewport.dispatchEvent(event)
    return event.defaultPrevented
  }
  expect(wheel(0.2)).toBe(true)
  expect(wheel(0.2)).toBe(true)
  expect(position).toBe(0)
  expect(wheel(0.2)).toBe(true)
  expect(position).toBe(1)
  wheel(-0.2)
  expect(position).toBe(1)
  wheel(-0.2)
  wheel(-0.2)
  expect(position).toBe(0)
  expect(wheel(-0.2)).toBe(false)
  position = 400
  expect(wheel(0.2)).toBe(false)
  wheel(-0.2)
  position = 100
  wheel(-0.2)
  expect(position).toBe(100)
  position = 200
  wheel(0.2)
  wheel(0.2)
  wheel(0.2, 161)
  expect(position).toBe(200)
})
