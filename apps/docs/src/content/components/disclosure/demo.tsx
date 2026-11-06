import { useState } from "react"
import {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
  TextField,
} from "@yuzur1ha/ui"
export function DisclosureDemo() {
  const [note, setNote] = useState("")
  return (
    <>
      <Disclosure defaultOpen>
        <DisclosureTrigger>Additional details</DisclosureTrigger>
        <DisclosureContent>
          <TextField
            label="Internal note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional note"
            hint="Your input is retained when this section is collapsed."
          />
        </DisclosureContent>
      </Disclosure>
      <Disclosure>
        <DisclosureTrigger>Privacy information</DisclosureTrigger>
        <DisclosureContent>
          <p>
            Only the information needed for this session is stored in this demo.
          </p>
        </DisclosureContent>
      </Disclosure>
      <Disclosure disabled>
        <DisclosureTrigger>Unavailable details</DisclosureTrigger>
        <DisclosureContent>Unavailable</DisclosureContent>
      </Disclosure>
    </>
  )
}
