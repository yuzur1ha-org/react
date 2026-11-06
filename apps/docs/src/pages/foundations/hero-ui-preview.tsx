/** @jsxImportSource @emotion/react */
import { useTokens } from "@yuzur1ha/ui"
import { toHeroUIVariables } from "@yuzur1ha/token"
import { Button, Input } from "@heroui/react"
import "./hero-ui.css"
import { heroUIStyles } from "./hero-ui.styles"

export function HeroUIPreview() {
  const theme = useTokens()
  return (
    <section
      css={heroUIStyles}
      className="hero-ui-preview"
      data-theme="yuzur1ha"
      style={toHeroUIVariables(theme)}
      aria-label="HeroUI token adapter"
    >
      <p className="eyebrow">HEROUI V3 / TOKEN ADAPTER</p>
      <div className="demo-row">
        <Button data-testid="heroui-button">Continue</Button>
        <Input
          data-testid="heroui-input"
          aria-label="Display name"
          defaultValue="Alex Morgan"
        />
      </div>
    </section>
  )
}
