import inventory from "../../.cache/press/index.json" with { type: "json" }
import type { DocumentId } from "../../.cache/press/documents"

export type ComponentName = Exclude<
  DocumentId,
  | "home"
  | "foundations"
  | "markdown"
  | "press"
  | `markdown/${string}`
  | `press/${string}`
>

export function isComponentName(value: string): value is ComponentName {
  return (
    !["home", "foundations", "markdown", "press"].includes(value) &&
    !value.includes("/") &&
    inventory.some((document) => document.id === value)
  )
}
export const componentIds = inventory
  .map((document) => document.id)
  .filter(isComponentName)
