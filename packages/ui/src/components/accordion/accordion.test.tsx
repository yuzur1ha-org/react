import { expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion"
function Items() {
  return (
    <>
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Unavailable</AccordionTrigger>
        <AccordionContent>Disabled content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second content</AccordionContent>
      </AccordionItem>
    </>
  )
}
it("skips disabled triggers with arrow keys and collapses the previous single panel", async () => {
  render(
    <Accordion type="single" collapsible defaultValue="a">
      <Items />
    </Accordion>,
  )
  const user = userEvent.setup()
  await user.tab()
  await user.keyboard("{ArrowDown}")
  expect(screen.getByRole("button", { name: "Second" })).toHaveFocus()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
    "aria-expanded",
    "true",
  )
  expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
    "aria-expanded",
    "false",
  )
  await waitFor(() =>
    expect(screen.queryByText("First content")).not.toBeInTheDocument(),
  )
})
it("keeps multiple panels open independently", async () => {
  render(
    <Accordion type="multiple" defaultValue={["a"]}>
      <Items />
    </Accordion>,
  )
  await userEvent.click(screen.getByRole("button", { name: "Second" }))
  expect(screen.getByText("First content")).toBeVisible()
  expect(screen.getByText("Second content")).toBeVisible()
})
