// @vitest-environment jsdom
import { createElement, useContext, useEffect } from "react"
import { createMemoryRouter, RouterProvider } from "react-router"
import { act, cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import { PageLoading } from "../../src/feedback/page-loading"
import { LoadingContext } from "../../src/feedback/loading-context"

let complete: () => void = () => undefined
let begin: () => (() => void) | undefined = () => undefined
function PendingBody() {
  const register = useContext(LoadingContext)
  useEffect(() => {
    begin = () => register?.()
    const unregister = register?.()
    complete = () => unregister?.()
  }, [register])
  return createElement("p", {}, "Ready content remains available")
}
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
for (const reduced of [false, true]) {
  it(`shares body loading and releases its marker after the minimum${reduced ? " without motion" : " with an exit phase"}`, () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] })
    vi.stubGlobal("matchMedia", () => ({ matches: reduced }))
    const router = createMemoryRouter([
      {
        path: "/",
        element: createElement(PageLoading, {
          children: createElement(PendingBody),
        }),
      },
    ])
    render(createElement(RouterProvider, { router }))
    expect(screen.getByRole("status")).toBeTruthy()
    expect(screen.getByText("Ready content remains available")).toBeTruthy()
    act(() => {
      complete()
      vi.advanceTimersByTime(399)
    })
    expect(screen.getByRole("status").getAttribute("data-leaving")).toBe(
      "false",
    )
    act(() => {
      vi.advanceTimersByTime(1)
    })
    if (!reduced) {
      expect(screen.getByRole("status").getAttribute("data-leaving")).toBe(
        "true",
      )
      act(() => {
        vi.advanceTimersByTime(159)
      })
      expect(screen.getByRole("status")).toBeTruthy()
      act(() => {
        vi.advanceTimersByTime(1)
      })
    } else
      act(() => {
        vi.advanceTimersByTime(0)
      })
    expect(screen.queryByRole("status")).toBeNull()
    router.dispose()
  })
}

it("cancels an exit when another body starts loading", () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] })
  vi.stubGlobal("matchMedia", () => ({ matches: false }))
  const router = createMemoryRouter([
    {
      path: "/",
      element: createElement(PageLoading, {
        children: createElement(PendingBody),
      }),
    },
  ])
  render(createElement(RouterProvider, { router }))
  act(() => {
    complete()
  })
  act(() => {
    vi.advanceTimersByTime(400)
  })
  expect(screen.getByRole("status").getAttribute("data-leaving")).toBe("true")
  let finish: (() => void) | undefined
  act(() => {
    finish = begin()
  })
  act(() => {
    vi.advanceTimersByTime(160)
  })
  expect(screen.getByRole("status").getAttribute("data-leaving")).toBe("false")
  act(() => {
    finish?.()
  })
  act(() => {
    vi.advanceTimersByTime(400)
  })
  act(() => {
    vi.advanceTimersByTime(160)
  })
  expect(screen.queryByRole("status")).toBeNull()
  router.dispose()
})
