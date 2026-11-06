import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "../button/index"
import { Tooltip } from "./tooltip"
it("Tooltip opens on focus and dismisses on Escape", async () => {
  render(
    <Tooltip content="Only you">
      <Button>Visibility</Button>
    </Tooltip>,
  )
  await userEvent.tab()
  expect(await screen.findByRole("tooltip")).toHaveTextContent("Only you")
  await userEvent.keyboard("{Escape}")
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
})
