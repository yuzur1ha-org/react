import { useState } from "react"
import { Avatar, Badge, Button, Checkbox, NumberField } from "@yuzur1ha/ui"
export function BadgeDemo() {
  const [count, setCount] = useState<number | null>(5)
  const [showZero, setShowZero] = useState(false)
  const notificationCount = Math.max(0, Math.min(150, Math.trunc(count ?? 0)))
  return (
    <>
      <div className="demo-row demo-badges">
        <Badge
          count={notificationCount}
          showZero={showZero}
          label={`${notificationCount} unread messages`}
        >
          <Button appearance="secondary">Inbox</Button>
        </Badge>
        <Badge variant="dot" label="Available" position="bottom-end">
          <Avatar name="Alex Morgan" size="small" />
        </Badge>
        <Badge variant="label" content="New" label="New release" tone="danger">
          <Button appearance="secondary">Releases</Button>
        </Badge>
      </div>
      <NumberField
        label="Notification count"
        value={count}
        onValueChange={setCount}
        min={0}
        max={150}
        incrementLabel="Increase notifications"
        decrementLabel="Decrease notifications"
      />
      <Checkbox
        label="Show zero"
        checked={showZero}
        onChange={(event) => setShowZero(event.target.checked)}
      />
    </>
  )
}
