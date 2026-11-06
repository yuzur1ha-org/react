import { useState } from "react"
import { Checkbox } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function CheckboxDemo() {
  const [value, setValue] = useState(false)
  return (
    <>
      <Checkbox
        label="Keep me updated"
        checked={value}
        onChange={(event) => setValue(event.target.checked)}
      />
      <Checkbox label="Disabled" disabled />
      <DemoResult>{String(value)}</DemoResult>
    </>
  )
}
