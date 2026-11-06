import type { defaults } from "./defaults"

export type TokenName = keyof typeof defaults
export type DesignTokens = Readonly<Record<TokenName, string>>
export type TokenOverrides = Partial<DesignTokens>
export type ThemeMode = "light" | "dark"
export type SeedTokens = {
  mode: ThemeMode
  primary: string
  warn: string
  success: string
  info: string
  ink: string
  paper: string
  surface: string
  error: string
  font: string
  mono: string
  spaceUnit: number
  radius: number
  motionFast: number
  motionNormal: number
  motionEase: string
}
