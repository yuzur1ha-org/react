import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { Segmented } from "./segmented"
describe("Segmented", () => {
  it("supports native radio keyboard movement", async () => {
    function Example() {
      const [value, setValue] = useState("a")
      return (
        <Segmented
          label="Theme"
          value={value}
          onChange={setValue}
          options={[
            { value: "a", label: "Light" },
            { value: "b", label: "Dark" },
          ]}
        />
      )
    }
    render(<Example />)
    await userEvent.tab()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked()
  })
})
