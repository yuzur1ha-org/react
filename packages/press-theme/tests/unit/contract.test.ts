import { expect, it } from "vitest"
import type { ThemeModule } from "@yuzur1ha/press/react"
import * as theme from "../../src"
it("provides the complete public theme contract without browser globals", () => {
  const contract: ThemeModule = theme
  for (const value of Object.values(contract))
    expect(typeof value).toBe("function")
})
