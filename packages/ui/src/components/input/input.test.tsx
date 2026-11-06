import { createRef } from "react"
import { expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Input } from "./input"
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "../form/index"
it("composes one control and one label with FormField, preserving validation and ref", async () => {
  const ref = createRef<HTMLInputElement>()
  const { container } = render(
    <Form>
      <FormField name="email">
        <FormLabel>Email</FormLabel>
        <FormControl asChild>
          <Input ref={ref} type="email" required />
        </FormControl>
        <FormMessage match="valueMissing">Required</FormMessage>
      </FormField>
      <button>Submit</button>
    </Form>,
  )
  const input = screen.getByRole("textbox", { name: "Email" })
  expect(ref.current).toBe(input)
  expect(container.querySelectorAll("input")).toHaveLength(1)
  expect(container.querySelectorAll("label")).toHaveLength(1)
  await userEvent.click(screen.getByRole("button"))
  expect(input).toHaveAccessibleDescription("Required")
  expect(input).toBeInvalid()
  expect(input).toHaveAttribute("data-invalid")
})
