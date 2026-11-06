import { renderToString } from "react-dom/server"
import { expect, it, vi } from "vitest"
import { SettingRow } from "../../src/components/setting-row"
import { Meter } from "../../src/components/meter"
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "../../src/components/disclosure"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/components/accordion"

it("renders structural components on the server without unsafe selector warnings", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
  const markup = renderToString(
    <>
      <SettingRow
        label="Display name"
        value="Sample profile"
        action={<button>Edit</button>}
      />
      <Meter label="Usage" value={25} />
      <Disclosure defaultOpen>
        <DisclosureTrigger>Details</DisclosureTrigger>
        <DisclosureContent>
          <h3>Heading</h3>
          <p>First paragraph</p>
          <p>Last paragraph</p>
        </DisclosureContent>
      </Disclosure>
      <Accordion type="single" defaultValue="details">
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            <h3>Heading</h3>
            <p>First paragraph</p>
            <p>Last paragraph</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>,
  )
  expect(markup).toContain("Sample profile")
  expect(markup).toContain("yu-setting-row-content")
  expect(markup).toContain("yu-meter-value")
  const messages = [...error.mock.calls, ...warn.mock.calls]
    .flat()
    .filter((value): value is string => typeof value === "string")
  expect(
    messages.filter((message) =>
      /potentially unsafe|first-child|nth-child/.test(message),
    ),
  ).toEqual([])
  error.mockRestore()
  warn.mockRestore()
})
