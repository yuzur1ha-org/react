// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { useMinimumVisible } from "../../src/feedback/use-minimum-visible"

afterEach(() => vi.useRealTimers())
it("keeps a short wait visible for the minimum without delaying content", () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] })
  const { result, rerender } = renderHook(
    ({ pending }) => useMinimumVisible(pending),
    { initialProps: { pending: true } },
  )
  act(() => {
    vi.advanceTimersByTime(50)
  })
  rerender({ pending: false })
  act(() => {
    vi.advanceTimersByTime(349)
  })
  expect(result.current).toBe(true)
  act(() => {
    vi.advanceTimersByTime(1)
  })
  expect(result.current).toBe(false)
})
it("never hides a long wait and cancels a scheduled exit when loading resumes", () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] })
  const { result, rerender } = renderHook(
    ({ pending }) => useMinimumVisible(pending),
    { initialProps: { pending: true } },
  )
  act(() => {
    vi.advanceTimersByTime(100)
  })
  rerender({ pending: false })
  act(() => {
    vi.advanceTimersByTime(100)
  })
  rerender({ pending: true })
  act(() => {
    vi.advanceTimersByTime(500)
  })
  expect(result.current).toBe(true)
  rerender({ pending: false })
  act(() => {
    vi.advanceTimersByTime(0)
  })
  expect(result.current).toBe(false)
})
it("does not display anything for an idle page and cleans up its timer", () => {
  vi.useFakeTimers()
  const { result, rerender, unmount } = renderHook(
    ({ pending }) => useMinimumVisible(pending),
    { initialProps: { pending: false } },
  )
  expect(result.current).toBe(false)
  rerender({ pending: true })
  rerender({ pending: false })
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})
