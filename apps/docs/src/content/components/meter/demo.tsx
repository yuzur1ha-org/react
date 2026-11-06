import { useState } from "react"
import { Meter, NumberField } from "@yuzur1ha/ui"
export function MeterDemo() {
  const [usage, setUsage] = useState<number | null>(62)
  const boundedUsage = Math.max(0, Math.min(100, usage ?? 0))
  return (
    <>
      <Meter
        label="Storage used"
        value={boundedUsage}
        valueText={`${boundedUsage} of 100 GB`}
      />
      <NumberField
        label="Used storage"
        value={usage}
        onValueChange={setUsage}
        min={0}
        max={100}
        incrementLabel="Increase usage"
        decrementLabel="Decrease usage"
      />
      <Meter label="Signal quality" value={0.65} max={1} valueText="0.65 / 1" />
      <Meter label="Capacity warning" value={92} tone="danger" />
    </>
  )
}
