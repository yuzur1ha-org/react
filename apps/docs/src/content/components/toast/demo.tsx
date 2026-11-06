import { useRef, useState } from "react"
import {
  Button,
  Toast,
  ToastProvider,
  Segmented,
  type ToastTone,
  type ToastDuration,
} from "@yuzur1ha/ui"
const toneLabels: Record<ToastTone, string> = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  error: "Error",
}
type Item = {
  id: number
  tone: ToastTone
  variant: "simple" | "rich"
  open: boolean
  duration?: ToastDuration
}
export function ToastDemo() {
  const [variant, setVariant] = useState<"simple" | "rich">("rich")
  const [lifetime, setLifetime] = useState<"default" | "custom" | "persistent">(
    "default",
  )
  const [result, setResult] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const sequence = useRef(0)
  function add(tone: ToastTone) {
    const item: Item = {
      id: ++sequence.current,
      tone,
      variant,
      open: true,
      ...(lifetime === "default"
        ? {}
        : { duration: lifetime === "persistent" ? false : 10000 }),
    }
    setItems((current) => [...current, item])
  }
  return (
    <>
      <Segmented
        label="Display mode"
        value={variant}
        onChange={setVariant}
        options={[
          { value: "simple", label: "Simple" },
          { value: "rich", label: "Rich" },
        ]}
      />
      <Segmented
        label="Auto close"
        value={lifetime}
        onChange={setLifetime}
        options={[
          { value: "default", label: "Default · 5s" },
          { value: "custom", label: "10 seconds" },
          { value: "persistent", label: "Persistent" },
        ]}
      />
      <div className="demo-row">
        {(["info", "success", "warning", "error"] as const).map((tone) => (
          <Button appearance="secondary" key={tone} onClick={() => add(tone)}>
            {toneLabels[tone]}
          </Button>
        ))}
      </div>
      <p className="demo-label">
        Each message keeps its own mode and duration. Persistent messages stay
        until dismissed. Hover or focus pauses expiry.
      </p>
      <ToastProvider
        label="Notifications"
        viewportLabel="Notifications ({hotkey})"
      >
        {items.map((item) => (
          <Toast
            key={item.id}
            open={item.open}
            {...(item.duration !== undefined
              ? { duration: item.duration }
              : {})}
            onOpenChange={(open) =>
              setItems((current) =>
                current.map((entry) =>
                  entry.id === item.id ? { ...entry, open } : entry,
                ),
              )
            }
            onExitComplete={() =>
              setItems((current) =>
                current.filter((entry) => entry.id !== item.id),
              )
            }
            tone={item.tone}
            toneLabel={toneLabels[item.tone]}
            title={
              item.tone === "error"
                ? "Unable to save. Your draft is preserved."
                : "Changes saved"
            }
            {...(item.variant === "rich"
              ? {
                  variant: "rich",
                  description: "Your account settings have been updated.",
                  action: {
                    label: "Undo",
                    onClick: () => setResult("Changes undone in this demo."),
                  },
                }
              : { variant: "simple" })}
            closeLabel="Close"
          />
        ))}
      </ToastProvider>
      {result && <output className="demo-result">{result}</output>}
    </>
  )
}
