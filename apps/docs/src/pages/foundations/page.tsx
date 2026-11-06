import "./foundations.css"
import { useTokens } from "@yuzur1ha/ui"
import { HeroUIPreview } from "./hero-ui-preview"
import { ThemePreview } from "./theme-preview"

export default function Foundations() {
  const theme = useTokens()
  return (
    <>
      <div className="section-heading">
        <span className="eyebrow">00 / FOUNDATIONS</span>
        <h1>A considered foundation.</h1>
        <p>
          Paper, ink, space. The same language across independent applications.
        </p>
      </div>
      <div className="palette">
        {[
          { color: "ink", label: "Ink" },
          { color: "paper", label: "Paper" },
          { color: "raised", label: "Raised" },
          { color: "subtle", label: "Subtle" },
          { color: "border", label: "Border" },
          { color: "error", label: "Error" },
        ].map(({ color, label }) => (
          <div key={color}>
            <div className={`swatch swatch--${color}`} />
            <span>{label}</span>
            <code>--yu-{color === "raised" ? "surface" : color}</code>
          </div>
        ))}
      </div>
      <section className="semantic-colors" aria-label="Functional colors">
        <p className="eyebrow">Functional colors</p>
        <div className="semantic-grid">
          {(["primary", "warn", "error", "success", "info"] as const).map(
            (name) => (
              <div
                key={name}
                className="semantic-swatch"
                data-tone={name}
                style={{
                  background: theme[`${name}-subtle`],
                  color: theme[name],
                }}
              >
                <span
                  className="semantic-swatch-chip"
                  style={{
                    background: theme[name],
                    color: theme[`${name}-foreground`],
                  }}
                >
                  Aa
                </span>
                <span>
                  {name === "warn"
                    ? "Warning"
                    : name.charAt(0).toUpperCase() + name.slice(1)}
                </span>
                <span className="mono">{theme[name]}</span>
              </div>
            ),
          )}
        </div>
      </section>
      <section className="type-specimen">
        <p className="eyebrow">Typography</p>
        <h2>Make room for what matters.</h2>
        <p>Instrument Sans · interface</p>
        <p className="mono">JetBrains Mono · metadata</p>
      </section>
      <div className="foundation-notes">
        <p>Square geometry · 1px borders · 8px spacing base</p>
        <p>Touch targets ≥ 44px</p>
      </div>
      <HeroUIPreview />
      <ThemePreview />
      <div className="spacing-scale" aria-label="8, 12, 16, 24, 32, 48 pixels">
        {[8, 12, 16, 24, 32, 48].map((space) => (
          <div key={space}>
            <span style={{ width: space, height: space }} />
            <code>{space}</code>
          </div>
        ))}
      </div>
    </>
  )
}
