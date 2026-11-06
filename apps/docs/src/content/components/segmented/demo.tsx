import { useState } from "react"
import { Segmented } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function SegmentedDemo() {
  const [value, setValue] = useState("system")
  return (
    <>
      <Segmented
        label="Appearance"
        value={value}
        onChange={setValue}
        options={[
          { value: "system", label: "System" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />
      <DemoResult>{value}</DemoResult>
    </>
  )
}
