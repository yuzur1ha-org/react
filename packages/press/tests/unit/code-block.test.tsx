// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, expect, it, vi } from "vitest"
import { CodeBlock } from "../../src/react/code-block"
import type { HighlightedCode } from "../../src/content/code"
const data: HighlightedCode = {
  source: "  中文 <>&\n\n",
  lines: [[{ text: "  中文 <>&" }], [{ text: "" }], [{ text: "" }]],
  copy: true,
  lineNumbers: true,
  enhanced: true,
}
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
function clipboard(writeText: (source: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })
}
it("renders complete safe code during SSR without a theme or clipboard API", () => {
  const html = renderToString(<CodeBlock data={data} />)
  expect(html).toContain("中文 &lt;&gt;&amp;")
  expect(html).not.toContain("<button")
  expect(html).toContain('aria-hidden="true"')
})
it("copies the exact source, resets after two seconds and reports/retries failure", async () => {
  vi.useFakeTimers()
  const write = vi.fn().mockResolvedValue(undefined)
  clipboard(write)
  render(<CodeBlock data={data} />)
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }))
    await Promise.resolve()
  })
  expect(write).toHaveBeenCalledWith(data.source)
  expect(screen.getByRole("status").textContent).toBe("Code copied.")
  act(() => {
    vi.advanceTimersByTime(2000)
  })
  expect(screen.getByRole("status").textContent).toBe("")
  write.mockRejectedValueOnce(new Error("denied"))
  await act(async () => {
    fireEvent.click(screen.getByRole("button"))
    await Promise.resolve()
  })
  expect(screen.getByRole("status").textContent).toContain("Copy unavailable")
  expect(screen.getByRole("button").textContent).toBe("Retry")
  await act(async () => {
    fireEvent.click(screen.getByRole("button"))
    await Promise.resolve()
  })
  expect(screen.getByRole("status").textContent).toBe("Code copied.")
})
it("ignores stale promises after source changes, repeated copies and unmount", async () => {
  const resolvers: (() => void)[] = []
  clipboard(
    () =>
      new Promise<void>((resolve) => {
        resolvers.push(resolve)
      }),
  )
  const { rerender, unmount } = render(<CodeBlock data={data} />)
  fireEvent.click(screen.getByRole("button"))
  rerender(<CodeBlock data={{ ...data, source: "new" }} />)
  await act(async () => {
    resolvers[0]?.()
    await Promise.resolve()
  })
  expect(screen.getByRole("status").textContent).toBe("")
  fireEvent.click(screen.getByRole("button"))
  fireEvent.click(screen.getByRole("button"))
  await act(async () => {
    resolvers[1]?.()
    await Promise.resolve()
  })
  expect(screen.getByRole("status").textContent).toBe("")
  unmount()
  await act(async () => {
    resolvers[2]?.()
    await Promise.resolve()
  })
})
it("handles missing clipboard and disabled copying", async () => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: undefined,
  })
  const { rerender } = render(<CodeBlock data={data} />)
  await act(async () => {
    fireEvent.click(screen.getByRole("button"))
    await Promise.resolve()
  })
  expect(screen.getByRole("status").textContent).toContain("Copy unavailable")
  rerender(<CodeBlock data={{ ...data, copy: false }} />)
  expect(screen.queryByRole("button")).toBeNull()
})
