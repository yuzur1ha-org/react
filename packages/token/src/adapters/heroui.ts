import { tokens } from "../themes"
import { toCSSVariables } from "./css"
import type { DesignTokens, TokenName } from "../types"

export const heroUIVariables = {
  background: "paper",
  foreground: "ink",
  surface: "surface",
  "surface-foreground": "ink",
  "surface-secondary": "subtle",
  "surface-secondary-foreground": "ink",
  "surface-tertiary": "paper",
  "surface-tertiary-foreground": "ink",
  overlay: "surface",
  "overlay-foreground": "ink",
  accent: "primary",
  "accent-foreground": "primary-foreground",
  default: "subtle",
  "default-foreground": "ink",
  muted: "secondary",
  border: "border",
  separator: "border",
  focus: "focus",
  link: "link",
  danger: "error",
  "danger-foreground": "error-foreground",
  success: "success",
  "success-foreground": "success-foreground",
  warning: "warn",
  "warning-foreground": "warn-foreground",
  "field-background": "surface",
  "field-foreground": "ink",
  "field-placeholder": "secondary",
  "field-border": "border",
  "field-radius": "radius",
  "field-border-width": "border-width",
  "border-width": "border-width",
  radius: "radius",
  "font-sans": "font",
  "font-mono": "mono",
} as const satisfies Record<string, TokenName>

export function toHeroUIVariables(
  theme: DesignTokens = tokens,
): Record<string, string> {
  return {
    ...toCSSVariables(theme),
    ...Object.fromEntries(
      Object.entries(heroUIVariables).map(([name, token]) => [
        `--${name}`,
        theme[token],
      ]),
    ),
  }
}
