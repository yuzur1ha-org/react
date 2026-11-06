import { act, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { useViewportLayout } from "../../src/hooks/use-viewport"

it("shares two boundary subscriptions and releases them after the last consumer", () => {
  let width = 820
  const records: {
    matches: boolean
    callbacks: Set<() => void>
    removeEventListener: ReturnType<typeof vi.fn>
  }[] = []
  const matchMedia = vi.fn((query: string) => {
    const callbacks = new Set<() => void>()
    const record = {
      media: query,
      matches: query.includes("1024") ? width >= 1024 : width < 640,
      callbacks,
      addEventListener: vi.fn((_event: string, callback: () => void) =>
        callbacks.add(callback),
      ),
      removeEventListener: vi.fn((_event: string, callback: () => void) =>
        callbacks.delete(callback),
      ),
    }
    records.push(record)
    return record
  })
  vi.stubGlobal("matchMedia", matchMedia)
  const rendered = vi.fn()
  function Probe() {
    const layout = useViewportLayout()
    rendered()
    return <output>{layout}</output>
  }
  try {
    const first = render(<Probe />),
      second = render(<Probe />)
    expect(matchMedia).toHaveBeenCalledTimes(2)
    expect(records.every((record) => record.callbacks.size === 1)).toBe(true)
    const renders = rendered.mock.calls.length
    width = 900
    expect(rendered).toHaveBeenCalledTimes(renders)
    act(() => {
      width = 1024
      const desktop = records[1]
      if (!desktop) throw new Error("Missing desktop query")
      desktop.matches = true
      desktop.callbacks.forEach((callback) => callback())
    })
    expect(screen.getAllByText("desktop")).toHaveLength(2)
    first.unmount()
    expect(
      records.every(
        (record) => record.removeEventListener.mock.calls.length === 0,
      ),
    ).toBe(true)
    second.unmount()
    expect(
      records.every(
        (record) => record.removeEventListener.mock.calls.length === 1,
      ),
    ).toBe(true)
  } finally {
    vi.unstubAllGlobals()
  }
})
