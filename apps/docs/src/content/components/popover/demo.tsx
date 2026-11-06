import { useState } from "react"
import { Button, Popover, PopoverClose, TextField } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"
export function PopoverDemo() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("Alex Morgan")
  const [draft, setDraft] = useState(name)
  const [error, setError] = useState("")
  return (
    <>
      <Popover
        label="Edit profile"
        className="demo-profile-popover"
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) {
            setDraft(name)
            setError("")
          }
        }}
        trigger={<Button appearance="secondary">Edit display name</Button>}
      >
        <h2>Edit profile</h2>
        <p>Choose the name shown on your profile.</p>
        <form
          className="popover-demo-form"
          onSubmit={(event) => {
            event.preventDefault()
            const normalized = draft.trim()
            if (normalized.length < 2) {
              setError("Enter at least two non-space characters.")
              return
            }
            setName(normalized)
            setOpen(false)
          }}
        >
          <TextField
            label="Display name"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              setError("")
            }}
            {...(error ? { error } : {})}
            required
            minLength={2}
            maxLength={64}
          />
          <div className="popover-demo-actions">
            <PopoverClose asChild>
              <Button appearance="text" size="small">
                Cancel
              </Button>
            </PopoverClose>
            <Button type="submit" size="small">
              Apply
            </Button>
          </div>
        </form>
      </Popover>
      <DemoResult>{name}</DemoResult>
    </>
  )
}
