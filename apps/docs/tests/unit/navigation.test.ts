import { expect, it } from "vitest"
import { sections } from "../../yupress.config"
import { componentIds } from "../helpers/inventory"
it("includes each authored component in the configured UI section", () => {
  const ui = sections.find((section) => section.id === "ui")
  expect(ui?.documents.filter((id) => id !== "foundations").sort()).toEqual(
    [...componentIds].sort(),
  )
})
