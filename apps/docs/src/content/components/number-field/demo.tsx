import { useState } from "react"
import { NumberField } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function NumberDemo() {
  const [value, setValue] = useState<number | null>(4)
  const [fraction, setFraction] = useState<number | null>(0.2)
  return (
    <>
      <NumberField
        label="Number"
        value={value}
        onValueChange={setValue}
        min={0}
        max={99}
        hint="0–99 · step 1. Use buttons or ↑ / ↓; Home / End jumps to the limits."
        incrementLabel="Increase"
        decrementLabel="Decrease"
      />
      <DemoResult>{value ?? "—"}</DemoResult>
      <NumberField
        label="Decimal number"
        value={fraction}
        onValueChange={setFraction}
        min={-1}
        max={1}
        step={0.1}
        hint="−1 to 1 · step 0.1. Values are normalized when editing ends."
        incrementLabel="Increase decimal"
        decrementLabel="Decrease decimal"
      />
      <DemoResult>{fraction ?? "—"}</DemoResult>
      <NumberField
        label="Disabled"
        defaultValue={8}
        disabled
        incrementLabel="Increase"
        decrementLabel="Decrease"
      />
    </>
  )
}
