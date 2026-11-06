import { useState } from "react"
import { TextField } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function FieldDemo() {
  const [value, setValue] = useState("Alex Morgan")
  return (
    <>
      <TextField
        label="Display name"
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        hint="Use a name people recognize."
        autoComplete="nickname"
      />
      <TextField
        label="Username"
        defaultValue="alex"
        error="This username is unavailable."
      />
      <TextField label="Disabled" value="alex@example.test" disabled />
      <DemoResult>{value}</DemoResult>
    </>
  )
}
