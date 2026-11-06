import { tokens } from "../themes"
import type { DesignTokens, TokenName } from "../types"

export function toCSSVariables(
  theme: DesignTokens = tokens,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(theme).map(([name, value]) => [`--yu-${name}`, value]),
  )
}
export function tokenVar(name: TokenName) {
  return `var(--yu-${name})`
}
