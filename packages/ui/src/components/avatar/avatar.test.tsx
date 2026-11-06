import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Avatar } from "./avatar"
describe("Avatar", () => {
  it("uses initials when an image fails", () => {
    render(<Avatar name="Alex Morgan" src="/missing.png" />)
    const image = screen
      .getByRole("img", { name: "Alex Morgan" })
      .querySelector("img")
    if (!image) throw new Error("Missing image")
    fireEvent.error(image)
    expect(screen.getByRole("img", { name: "Alex Morgan" })).toHaveTextContent(
      "AM",
    )
  })
})
