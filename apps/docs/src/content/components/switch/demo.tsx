import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function SwitchDemo() {
  const [value, setValue] = useState(true)
  return (
    <>
      <section className="demo-switch-group" aria-label="Interactive switch">
        <h2>Notifications</h2>
        <Switch
          label="Email notifications"
          checked={value}
          onChange={(event) => setValue(event.target.checked)}
        />
      </section>
      <section className="demo-switch-group" aria-label="Disabled switches">
        <h2>Disabled states</h2>
        <div className="demo-switch-states">
          <Switch label="Disabled" checked disabled />
          <Switch label="Disabled off" checked={false} disabled />
        </div>
      </section>
      <section
        className="demo-switch-group"
        aria-label="Switch sizes with icons"
      >
        <h2>Sizes with icons</h2>
        <div className="demo-switch-samples">
          {(["small", "medium", "large"] as const).map((size) => (
            <div className="demo-switch-sample" key={size}>
              <span>{size}</span>
              <Switch
                size={size}
                label={`${size} theme`}
                hideLabel
                uncheckedIcon={<Sun aria-hidden="true" />}
                checkedIcon={<Moon aria-hidden="true" />}
              />
            </div>
          ))}
        </div>
      </section>
      <DemoResult>{String(value)}</DemoResult>
    </>
  )
}
