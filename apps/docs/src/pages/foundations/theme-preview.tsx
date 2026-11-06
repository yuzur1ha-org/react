import { useState } from "react"
import { Button, Select, UIProvider, useTokens } from "@yuzur1ha/ui"
import { deriveTokens } from "@yuzur1ha/token"
export function ThemePreview() {
  const parent = useTokens()
  const dark = parent["color-scheme"] === "dark"
  const customTheme = deriveTokens({
    mode: dark ? "dark" : "light",
    ink: dark ? "#91cfb3" : "#006b5a",
    surface: dark ? "#182b24" : "#f0faf7",
    motionNormal: 220,
  })
  const [value, setValue] = useState("private")
  return (
    <section className="theme-preview" aria-label="Scoped theme injection">
      <p className="eyebrow">Scoped theme injection</p>
      <div className="demo-row">
        <div data-testid="default-theme">
          <Button>Default theme</Button>
        </div>
        <UIProvider theme={customTheme}>
          <div data-testid="derived-theme">
            <Button>Derived theme</Button>
            <Select
              label="Profile visibility"
              value={value}
              onValueChange={setValue}
              options={[
                { value: "private", label: "Private" },
                { value: "public", label: "Public" },
              ]}
            />
          </div>
        </UIProvider>
      </div>
    </section>
  )
}
