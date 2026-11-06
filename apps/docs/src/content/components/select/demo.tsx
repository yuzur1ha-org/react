import { useState } from "react"
import { Select } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function SelectDemo() {
  const [value, setValue] = useState("private")
  return (
    <>
      <Select
        label="Profile visibility"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "private", label: "Private" },
          { value: "public", label: "Public" },
          { value: "disabled", label: "Disabled", disabled: true },
        ]}
      />
      <div className="demo-row">
        {(["small", "medium", "large"] as const).map((size) => (
          <Select
            key={size}
            size={size}
            label={`${size} selection`}
            defaultValue="one"
            options={[
              { value: "one", label: "First" },
              { value: "two", label: "Second" },
            ]}
          />
        ))}
      </div>
      <Select
        label="Text appearance"
        appearance="text"
        size="small"
        defaultValue="one"
        options={[
          { value: "one", label: "First" },
          { value: "two", label: "Second" },
        ]}
      />
      <DemoResult>{value}</DemoResult>
    </>
  )
}
