import { defaults } from "./defaults"
import { seedTokens, lightPalette, darkPalette } from "./seed"
import type { SeedTokens, DesignTokens, TokenOverrides } from "./types"

export function deriveTokens(
  seed: Partial<SeedTokens> = {},
  overrides: TokenOverrides = {},
): DesignTokens {
  const palette = seed.mode === "dark" ? darkPalette : lightPalette
  const value = { ...seedTokens, ...palette, ...seed }
  const primary = seed.primary ?? value.ink
  const tint = (color: string) =>
    `color-mix(in srgb, ${color} 10%, ${value.surface})`
  for (const number of [
    value.spaceUnit,
    value.spaceUnit * 14,
    value.radius,
    value.motionFast,
    value.motionNormal,
  ]) {
    if (!Number.isFinite(number) || number < 0)
      throw new RangeError(
        "Token dimensions and durations must be finite and non-negative",
      )
  }
  if (value.spaceUnit === 0)
    throw new RangeError("Token spacing unit must be positive")
  return Object.freeze({
    ...defaults,
    ...palette,
    "color-scheme": value.mode,
    primary,
    "primary-foreground": value.paper,
    "primary-subtle": tint(primary),
    warn: value.warn,
    "warn-foreground": value.paper,
    "warn-subtle": tint(value.warn),
    success: value.success,
    "success-foreground": value.paper,
    "success-subtle": tint(value.success),
    info: value.info,
    "info-foreground": value.paper,
    "info-subtle": tint(value.info),
    "error-foreground": value.paper,
    "error-subtle": tint(value.error),
    "scrollbar-track": value.subtle,
    "scrollbar-thumb": value.secondary,
    "scrollbar-thumb-hover": value.ink,
    ink: value.ink,
    paper: value.paper,
    surface: value.surface,
    error: value.error,
    focus: primary,
    font: value.font,
    mono: value.mono,
    "space-1": `${value.spaceUnit * 2}px`,
    "space-2": `${value.spaceUnit * 3}px`,
    "space-3": `${value.spaceUnit * 4}px`,
    "space-4": `${value.spaceUnit * 6}px`,
    "space-5": `${value.spaceUnit * 8}px`,
    "space-6": `${value.spaceUnit * 12}px`,
    "action-height": `${Math.max(44, value.spaceUnit * 12)}px`,
    "input-height": `${Math.max(44, value.spaceUnit * 14)}px`,
    "touch-target": `${Math.max(44, value.spaceUnit * 11)}px`,
    radius: `${value.radius}px`,
    "motion-fast": `${value.motionFast}ms`,
    "motion-normal": `${value.motionNormal}ms`,
    "motion-ease": value.motionEase,
    ...overrides,
  })
}
