import { useState } from "react"
import { Button, Drawer, DrawerClose, TextField, Segmented } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"
export function DrawerDemo() {
  const [side, setSide] = useState<"left" | "right" | "bottom">("right")
  const [name, setName] = useState("Alex Morgan")
  const [saved, setSaved] = useState("No changes saved.")
  return (
    <>
      <Segmented
        label="Placement"
        value={side}
        onChange={setSide}
        options={[
          { value: "left", label: "Left" },
          { value: "right", label: "Right" },
          { value: "bottom", label: "Bottom" },
        ]}
      />
      <Drawer
        trigger={<Button>Open drawer</Button>}
        title="Edit profile"
        description="Keep your profile up to date."
        closeLabel="Close drawer"
        side={side}
        footer={
          <DrawerClose asChild>
            <Button onClick={() => setSaved(name)}>Save changes</Button>
          </DrawerClose>
        }
      >
        <TextField
          label="Display name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Drawer>
      <DemoResult>{saved}</DemoResult>
    </>
  )
}
