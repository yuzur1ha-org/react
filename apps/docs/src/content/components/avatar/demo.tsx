import { useState } from "react"
import { Avatar, TextField } from "@yuzur1ha/ui"

export function AvatarDemo() {
  const [name, setName] = useState("Alex Morgan")
  return (
    <>
      <div className="demo-row">
        <Avatar name={name} />
        <Avatar name={name} size="small" />
      </div>
      <TextField
        label="Display name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </>
  )
}
