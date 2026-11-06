import { useState } from "react"
import { Textarea } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function TextareaDemo() {
  const [value, setValue] = useState("Building things with care.")
  return (
    <>
      <Textarea
        label="About you"
        hint="A few words about yourself."
        maxLength={280}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <DemoResult>{value.length} / 280</DemoResult>
    </>
  )
}
