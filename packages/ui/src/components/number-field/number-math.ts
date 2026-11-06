export type NumberRange = { min?: number; max?: number; step: number }

function decimalPlaces(value: number) {
  const [coefficient = "", exponent = "0"] = value.toString().split("e")
  return Math.max(
    0,
    (coefficient.split(".")[1]?.length ?? 0) - Number(exponent),
  )
}
function scaled(value: number, places: number) {
  const [coefficient = "", exponent = "0"] = value.toString().split("e")
  const decimals = coefficient.split(".")[1]?.length ?? 0
  return (
    BigInt(coefficient.replace(".", "")) *
    10n ** BigInt(places + Number(exponent) - decimals)
  )
}
function formatScaled(value: bigint, places: number) {
  const sign = value < 0n ? "-" : ""
  const digits = (value < 0n ? -value : value)
    .toString()
    .padStart(places + 1, "0")
  return (
    sign +
    (places ? `${digits.slice(0, -places)}.${digits.slice(-places)}` : digits)
  )
}
export function formatNumber(value: number | null) {
  if (value === null) return ""
  const places = decimalPlaces(value)
  return formatScaled(scaled(value, places), places)
}
function floorDivide(value: bigint, divisor: bigint) {
  const quotient = value / divisor
  return value < 0n && value % divisor !== 0n ? quotient - 1n : quotient
}

// Integer decimal arithmetic keeps fractional steps on the min-based grid.
export function resolveNumber(
  value: number | null,
  range: NumberRange,
  direction: -1 | 0 | 1 = 0,
) {
  const start = value ?? range.min ?? 0
  const origin = range.min ?? 0
  const places = Math.max(
    ...[start, origin, range.step, range.max ?? 0].map(decimalPlaces),
  )
  const current = scaled(start, places)
  const base = scaled(origin, places)
  const step = scaled(range.step, places)
  const delta = current - base
  const floor = floorDivide(delta, step)
  let index: bigint
  if (direction === 1 && value !== null) index = floor + 1n
  else if (direction === -1 && value !== null)
    index = -floorDivide(-delta, step) - 1n
  else index = floor + (2n * (delta - floor * step) >= step ? 1n : 0n)
  if (range.min !== undefined) index = index < 0n ? 0n : index
  if (range.max !== undefined) {
    const highest = floorDivide(scaled(range.max, places) - base, step)
    index = index > highest ? highest : index
  }
  const result = Number(formatScaled(base + index * step, places))
  return Number.isFinite(result) ? result : start
}

export function parseNumber(text: string): number | null {
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/u.test(text)) return null
  const value = Number(text)
  return Number.isFinite(value) ? value : null
}
