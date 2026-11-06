import { StrictMode, useState } from "react"
import { expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Toast, ToastProvider } from "./toast"
it("Toast supports an accessible close action", async () => {
  const changed = vi.fn()
  render(
    <ToastProvider>
      <Toast
        open
        onOpenChange={changed}
        tone="error"
        toneLabel="Error"
        title="Save failed"
        closeLabel="Dismiss"
      />
    </ToastProvider>,
  )
  await userEvent.click(await screen.findByRole("button", { name: "Dismiss" }))
  expect(changed).toHaveBeenCalledWith(false)
})

it("renders a compact announcement or rich content with an action", async () => {
  const action = vi.fn()
  const { rerender } = render(
    <ToastProvider>
      <Toast
        variant="simple"
        open
        onOpenChange={() => undefined}
        tone="success"
        toneLabel="Success"
        title="Saved"
        closeLabel="Dismiss"
      />
    </ToastProvider>,
  )
  expect(
    screen.getByText("Saved", { exact: true }).closest(".yu-toast"),
  ).toHaveAttribute("data-variant", "simple")
  expect(document.querySelector(".yu-toast-heading")).not.toBeInTheDocument()
  rerender(
    <ToastProvider>
      <Toast
        open
        onOpenChange={() => undefined}
        tone="success"
        toneLabel="Success"
        title="Saved"
        description="Draft updated."
        closeLabel="Dismiss"
        action={{ label: "Undo", onClick: action }}
      />
    </ToastProvider>,
  )
  expect(screen.getByText("Draft updated.", { exact: true })).toBeVisible()
  await userEvent.click(screen.getByRole("button", { name: "Undo" }))
  expect(action).toHaveBeenCalledOnce()
})

it("stacks independently configured items in one viewport", async () => {
  const richChange = vi.fn()
  const simpleChange = vi.fn()
  render(
    <ToastProvider>
      <Toast
        open
        onOpenChange={simpleChange}
        variant="simple"
        title="Copied"
        tone="success"
        toneLabel="Success"
        closeLabel="Dismiss copied"
      />
      <Toast
        open
        onOpenChange={richChange}
        title="Upload failed"
        description="Try again."
        tone="error"
        toneLabel="Error"
        closeLabel="Dismiss upload"
      />
    </ToastProvider>,
  )
  expect(document.querySelectorAll(".yu-toast-viewport")).toHaveLength(1)
  expect(document.querySelectorAll(".yu-toast")).toHaveLength(2)
  await userEvent.click(screen.getByRole("button", { name: "Dismiss copied" }))
  expect(simpleChange).toHaveBeenCalledWith(false)
  expect(richChange).not.toHaveBeenCalled()
})

it("notifies removal only after a controlled item closes, including StrictMode", async () => {
  const exited = vi.fn()
  function Example() {
    const [open, setOpen] = useState(true)
    return (
      <ToastProvider>
        <Toast
          open={open}
          onOpenChange={setOpen}
          onExitComplete={exited}
          title="Saved"
          tone="success"
          toneLabel="Success"
          closeLabel="Dismiss"
        />
      </ToastProvider>
    )
  }
  render(
    <StrictMode>
      <Example />
    </StrictMode>,
  )
  expect(exited).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole("button", { name: "Dismiss" }))
  await waitFor(() =>
    expect(document.querySelector(".yu-toast")).not.toBeInTheDocument(),
  )
  expect(exited).toHaveBeenCalledOnce()
})

it("expires after five seconds by default and honors per-item duration overrides", () => {
  vi.useFakeTimers()
  try {
    function Example() {
      const [first, setFirst] = useState(true)
      const [second, setSecond] = useState(true)
      return (
        <ToastProvider>
          <Toast
            open={first}
            onOpenChange={setFirst}
            variant="simple"
            tone="success"
            toneLabel="Success"
            title="Default expiry"
            closeLabel="Dismiss default"
          />
          <Toast
            open={second}
            onOpenChange={setSecond}
            duration={8000}
            tone="error"
            toneLabel="Error"
            title="Longer expiry"
            closeLabel="Dismiss longer"
          />
        </ToastProvider>
      )
    }
    const { unmount } = render(<Example />)
    act(() => {
      vi.advanceTimersByTime(4999)
    })
    expect(
      screen.getByRole("button", { name: "Dismiss default" }),
    ).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(
      screen.queryByRole("button", { name: "Dismiss default" }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Dismiss longer" }),
    ).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(
      screen.queryByRole("button", { name: "Dismiss longer" }),
    ).not.toBeInTheDocument()
    unmount()
  } finally {
    vi.useRealTimers()
  }
})

it.each([false, 5000] as const)(
  "supports persistent messages and per-item overrides with provider duration %s",
  (duration) => {
    vi.useFakeTimers()
    try {
      function Example() {
        const [inherited, setInherited] = useState(true)
        const [sticky, setSticky] = useState(true)
        const [timed, setTimed] = useState(true)
        return (
          <ToastProvider duration={duration}>
            <Toast
              open={inherited}
              onOpenChange={setInherited}
              tone="info"
              toneLabel="Info"
              title="Inherited"
              closeLabel="Dismiss inherited"
            />
            <Toast
              open={sticky}
              onOpenChange={setSticky}
              duration={false}
              tone="error"
              toneLabel="Error"
              title="Persistent"
              closeLabel="Dismiss persistent"
            />
            <Toast
              open={timed}
              onOpenChange={setTimed}
              duration={1000}
              tone="success"
              toneLabel="Success"
              title="Timed"
              closeLabel="Dismiss timed"
            />
          </ToastProvider>
        )
      }
      const { unmount } = render(<Example />)
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(
        screen.queryByRole("button", { name: "Dismiss timed" }),
      ).not.toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(60000)
      })
      expect(
        screen.getByRole("button", { name: "Dismiss persistent" }),
      ).toBeInTheDocument()
      if (duration === false)
        expect(
          screen.getByRole("button", { name: "Dismiss inherited" }),
        ).toBeInTheDocument()
      else
        expect(
          screen.queryByRole("button", { name: "Dismiss inherited" }),
        ).not.toBeInTheDocument()
      fireEvent.click(
        screen.getByRole("button", { name: "Dismiss persistent" }),
      )
      expect(
        screen.queryByRole("button", { name: "Dismiss persistent" }),
      ).not.toBeInTheDocument()
      unmount()
    } finally {
      vi.useRealTimers()
    }
  },
)
