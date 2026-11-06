import "@testing-library/jest-dom/vitest"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
// JSDOM does not implement pointer capture used by Radix.
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false
  HTMLElement.prototype.setPointerCapture = () => undefined
  HTMLElement.prototype.releasePointerCapture = () => undefined
}
afterEach(cleanup)
// Layout observation is unavailable in JSDOM; Chromium covers arrow placement.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  },
)

if (!HTMLElement.prototype.scrollIntoView)
  HTMLElement.prototype.scrollIntoView = vi.fn()
