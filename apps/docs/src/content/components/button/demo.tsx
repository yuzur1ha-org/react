import { useState } from "react"
import { Button } from "@yuzur1ha/ui"
import { DemoResult } from "../../examples/result"

export function ButtonDemo() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className="demo-button-groups">
        <section className="demo-button-group" aria-label="Button appearances">
          <h2>Appearance</h2>
          <div className="demo-row">
            <Button onClick={() => setCount((value) => value + 1)}>
              Continue
            </Button>
            <Button
              appearance="secondary"
              onClick={() => setCount((value) => value + 1)}
            >
              Cancel
            </Button>
            <Button
              appearance="text"
              onClick={() => setCount((value) => value + 1)}
            >
              Text action
            </Button>
          </div>
        </section>
        <section className="demo-button-group" aria-label="Button states">
          <h2>State</h2>
          <div className="demo-row">
            <Button disabled>Disabled</Button>
            <Button loading>Loading…</Button>
          </div>
        </section>
        <section className="demo-button-group" aria-label="Button sizes">
          <h2>Size</h2>
          <div className="demo-row demo-button-sizes">
            {(["small", "medium", "large"] as const).map((size) => (
              <Button
                size={size}
                key={size}
                onClick={() => setCount((value) => value + 1)}
              >
                {size} action
              </Button>
            ))}
          </div>
        </section>
        <section
          className="demo-button-group"
          aria-label="Button press feedback"
        >
          <h2>Without scale</h2>
          <div className="demo-row">
            <Button
              scaleOnPress={false}
              onClick={() => setCount((value) => value + 1)}
            >
              No scale action
            </Button>
          </div>
        </section>
      </div>
      <DemoResult>{count}</DemoResult>
    </>
  )
}
