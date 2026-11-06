import { expect, it } from "vitest"
import { resolveNumber } from "./number-math"
it("handles repeated steps, scientific decimal steps and negative grids", () => {
  let value = 0
  for (let index = 0; index < 10; index++)
    value = resolveNumber(value, { step: 0.1 }, 1)
  expect(value).toBe(1)
  expect(resolveNumber(0.0000001, { step: 0.0000001 }, 1)).toBe(0.0000002)
  expect(resolveNumber(-0.25, { step: 0.1 }, -1)).toBe(-0.3)
  expect(resolveNumber(-0.25, { step: 0.1 }, 1)).toBe(-0.2)
  expect(resolveNumber(1.05, { step: 0.1, max: 1.05 })).toBe(1)
})
