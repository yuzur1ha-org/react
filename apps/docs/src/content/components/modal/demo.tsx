import { useState } from "react"
import { Button, Modal, ModalClose, TextField } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function ModalDemo() {
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState("Alex Morgan")
  const [draft, setDraft] = useState(name)
  const [error, setError] = useState("")
  return (
    <>
      <div className="demo-row">
        <Modal
          trigger={<Button appearance="secondary">Open notice</Button>}
          title="Changes saved"
          description="Your account settings have been updated."
          closeLabel="Close"
        >
          <div className="yu-modal-actions">
            <ModalClose asChild>
              <Button>Done</Button>
            </ModalClose>
          </div>
        </Modal>
        <Modal
          trigger={<Button appearance="secondary">Open confirmation</Button>}
          title="Sign out of this demo?"
          description="This only closes the example. No real session will be changed."
          closeLabel="Close"
        >
          <div className="yu-modal-actions">
            <ModalClose asChild>
              <Button appearance="secondary">Cancel</Button>
            </ModalClose>
            <ModalClose asChild>
              <Button>Sign out</Button>
            </ModalClose>
          </div>
        </Modal>
        <Modal
          open={formOpen}
          onOpenChange={(next) => {
            setFormOpen(next)
            if (next) {
              setDraft(name)
              setError("")
            }
          }}
          trigger={<Button>Open form</Button>}
          title="Edit display name"
          description="Use a name people recognize."
          closeLabel="Close"
        >
          <form
            style={{ display: "grid", gap: "var(--yu-space-4)" }}
            onSubmit={(event) => {
              event.preventDefault()
              if (draft.trim().length < 2 || draft.trim().length > 64) {
                setError("Use between 2 and 64 characters.")
                return
              }
              setName(draft.trim())
              setFormOpen(false)
            }}
          >
            <TextField
              label="Display name"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              {...(error ? { error } : {})}
            />
            <div className="yu-modal-actions">
              <ModalClose asChild>
                <Button appearance="secondary">Cancel</Button>
              </ModalClose>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Modal>
      </div>
      <DemoResult>{name}</DemoResult>
    </>
  )
}
