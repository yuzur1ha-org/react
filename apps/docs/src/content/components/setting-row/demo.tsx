import { useState } from "react"
import {
  Button,
  Modal,
  ModalClose,
  Select,
  SettingRow,
  Switch,
  TextField,
} from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function SettingRowDemo() {
  const [name, setName] = useState("Alex Morgan")
  const [draft, setDraft] = useState(name)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")
  const [previews, setPreviews] = useState(false)
  const [presence, setPresence] = useState("contacts")
  const [resolved, setResolved] = useState(false)
  const [result, setResult] = useState("Changes apply only to this example.")

  return (
    <>
      <p className="demo-label">
        Local examples for Account and Service. No real profile or support
        request is updated.
      </p>
      <div className="setting-row-demo">
        <section aria-label="Account examples">
          <h2>Account</h2>
          <SettingRow
            label="Display name"
            value={name}
            action={
              <Modal
                open={editing}
                onOpenChange={(next) => {
                  setEditing(next)
                  if (next) {
                    setDraft(name)
                    setError("")
                  }
                }}
                trigger={
                  <Button appearance="text" size="small">
                    Edit
                  </Button>
                }
                title="Edit display name"
                description="Update the name in this local example."
                closeLabel="Close editor"
              >
                <form
                  className="setting-row-demo-editor"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const next = draft.trim()
                    if (!next) {
                      setError("Enter a display name.")
                      return
                    }
                    setName(next)
                    setEditing(false)
                    setResult("Sample display name updated.")
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
                  />
                  <div className="yu-modal-actions">
                    <ModalClose asChild>
                      <Button appearance="secondary">Cancel</Button>
                    </ModalClose>
                    <Button type="submit">Save changes</Button>
                  </div>
                </form>
              </Modal>
            }
          />
          <SettingRow
            label="Message previews"
            value={previews ? "Shown" : "Hidden"}
            action={
              <Switch
                label="Message previews"
                hideLabel
                size="small"
                checked={previews}
                onChange={(event) => {
                  setPreviews(event.target.checked)
                  setResult(
                    event.target.checked
                      ? "Sample previews shown."
                      : "Sample previews hidden.",
                  )
                }}
              />
            }
          />
          <SettingRow
            label="Last seen & online"
            value={
              <div className="setting-row-demo-select">
                <Select
                  label="Presence visibility"
                  hideLabel
                  size="small"
                  appearance="text"
                  value={presence}
                  onValueChange={(value) => {
                    setPresence(value)
                    setResult("Sample presence preference updated.")
                  }}
                  options={[
                    { value: "contacts", label: "Contacts" },
                    { value: "nobody", label: "Nobody" },
                  ]}
                />
              </div>
            }
          />
        </section>
        <section aria-label="Service examples">
          <h2>Service</h2>
          <SettingRow label="Topic" value="Connection & setup" />
          <SettingRow label="Related service" value="VPN" />
          <SettingRow label="Client" value="macOS · sample" />
          <SettingRow
            label="Request status"
            value={resolved ? "Resolved" : "Open"}
            action={
              <Modal
                trigger={
                  <Button appearance="text" size="small">
                    {resolved ? "Review" : "Resolve"}
                  </Button>
                }
                title={
                  resolved
                    ? "Sample request resolved"
                    : "Resolve this sample request?"
                }
                description="This only changes the example status. Nothing is sent to support."
                closeLabel="Close confirmation"
              >
                <div className="yu-modal-actions">
                  {resolved ? (
                    <ModalClose asChild>
                      <Button>Done</Button>
                    </ModalClose>
                  ) : (
                    <>
                      <ModalClose asChild>
                        <Button appearance="secondary">Cancel</Button>
                      </ModalClose>
                      <ModalClose asChild>
                        <Button
                          onClick={() => {
                            setResolved(true)
                            setResult("Sample request marked as resolved.")
                          }}
                        >
                          Mark as resolved
                        </Button>
                      </ModalClose>
                    </>
                  )}
                </div>
              </Modal>
            }
          />
          <Button
            appearance="text"
            size="small"
            disabled={!resolved}
            onClick={() => {
              setResolved(false)
              setResult("Sample request reset to Open.")
            }}
          >
            Reset sample request
          </Button>
        </section>
      </div>
      <DemoResult>{result}</DemoResult>
    </>
  )
}
