import { useState } from "react"
import { Radio } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function RadioDemo() {
  const [value, setValue] = useState("private")
  return (
    <>
      <fieldset>
        <legend className="demo-label">Profile visibility</legend>
        {[
          { value: "private", label: "Private" },
          { value: "public", label: "Public" },
        ].map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            name="visibility"
            value={option.value}
            checked={value === option.value}
            onChange={() => setValue(option.value)}
          />
        ))}
        <Radio label="Disabled" name="visibility" disabled />
      </fieldset>
      <DemoResult>{value}</DemoResult>
    </>
  )
}
