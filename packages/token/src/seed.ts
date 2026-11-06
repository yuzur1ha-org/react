import { defaults } from "./defaults"
import type { SeedTokens } from "./types"

export const lightPalette = {
  ink: defaults.ink,
  paper: defaults.paper,
  surface: defaults.surface,
  subtle: defaults.subtle,
  secondary: defaults.secondary,
  border: defaults.border,
  muted: defaults.muted,
  error: defaults.error,
  warn: defaults.warn,
  success: defaults.success,
  info: defaults.info,
  link: defaults.link,
}
export const darkPalette = {
  paper: "#171819",
  ink: "#eeede8",
  surface: "#202224",
  subtle: "#292c2e",
  secondary: "#c2c5c4",
  border: "#414648",
  muted: "#909692",
  error: "#ff9b92",
  warn: "#dfbb7d",
  success: "#93c6a5",
  info: "#95c5d1",
  link: "#a0cfdb",
}
export const seedTokens: Readonly<SeedTokens> = Object.freeze({
  mode: "light",
  primary: defaults.primary,
  warn: defaults.warn,
  success: defaults.success,
  info: defaults.info,
  ink: defaults.ink,
  paper: defaults.paper,
  surface: defaults.surface,
  error: defaults.error,
  font: defaults.font,
  mono: defaults.mono,
  spaceUnit: 4,
  radius: 0,
  motionFast: 140,
  motionNormal: 180,
  motionEase: defaults["motion-ease"],
})
