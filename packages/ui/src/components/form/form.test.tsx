import { useState } from "react"
import { expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormSubmit,
  FormFieldset,
  FormLegend,
} from "./form"
it("associates labels/help/errors and blocks invalid submission until corrected", async () => {
  const submitted = vi.fn()
  render(
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        submitted(new FormData(event.currentTarget).get("email"))
      }}
    >
      <FormField name="email">
        <FormLabel>Email</FormLabel>
        <FormControl type="email" required />
        <FormDescription>No email will be sent.</FormDescription>
        <FormMessage match="valueMissing">Email required.</FormMessage>
        <FormMessage match="typeMismatch">Email is invalid.</FormMessage>
      </FormField>
      <FormSubmit>Save</FormSubmit>
    </Form>,
  )
  const user = userEvent.setup()
  const email = screen.getByLabelText("Email")
  expect(email).toHaveAccessibleDescription("No email will be sent.")
  await user.click(screen.getByRole("button", { name: "Save" }))
  await waitFor(() => expect(screen.getByText("Email required.")).toBeVisible())
  expect(submitted).not.toHaveBeenCalled()
  expect(email).toHaveFocus()
  expect(email).toHaveAccessibleDescription(
    "No email will be sent. Email required.",
  )
  await user.type(email, "alex@example.test")
  await user.click(screen.getByRole("button", { name: "Save" }))
  expect(submitted).toHaveBeenCalledWith("alex@example.test")
})
it("supports server-invalid feedback and disabled fieldsets", () => {
  render(
    <Form>
      <FormField name="name" serverInvalid>
        <FormLabel>Name</FormLabel>
        <FormControl defaultValue="Alex" />
        <FormMessage>Already used.</FormMessage>
      </FormField>
      <FormFieldset disabled>
        <FormLegend>Disabled group</FormLegend>
        <FormField name="team">
          <FormLabel>Team</FormLabel>
          <FormControl />
        </FormField>
      </FormFieldset>
    </Form>,
  )
  expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true")
  expect(screen.getByLabelText("Name")).toHaveAccessibleDescription(
    "Already used.",
  )
  expect(screen.getByLabelText("Team")).toBeDisabled()
})

it("clears previous server errors before submission and keeps the new result", async () => {
  function Example() {
    const [invalid, setInvalid] = useState(false)
    return (
      <Form
        onClearServerErrors={() => setInvalid(false)}
        onSubmit={(event) => {
          event.preventDefault()
          setInvalid(true)
        }}
      >
        <FormField name="email" serverInvalid={invalid}>
          <FormLabel>Email</FormLabel>
          <FormControl defaultValue="taken@example.test" />
          {invalid && <FormMessage>Already used.</FormMessage>}
        </FormField>
        <FormSubmit>Save</FormSubmit>
        <button type="reset">Reset</button>
      </Form>
    )
  }
  render(<Example />)
  await userEvent.click(screen.getByRole("button", { name: "Save" }))
  expect(screen.getByText("Already used.")).toBeVisible()
  await userEvent.click(screen.getByRole("button", { name: "Reset" }))
  expect(screen.queryByText("Already used.")).not.toBeInTheDocument()
})
