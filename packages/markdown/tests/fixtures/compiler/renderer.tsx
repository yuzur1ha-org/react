import type { ReactNode } from "react"
import "./renderer.css"
export function Note({ children }: { children?: ReactNode }) {
  return <aside className="fixture-note">{children}</aside>
}
export function Term({ children }: { children?: ReactNode }) {
  return <abbr>{children}</abbr>
}
export function Probe({
  payload,
  optional,
}: {
  payload: unknown
  optional?: unknown
}) {
  const object = payload && typeof payload === "object" ? payload : {}
  const negative: unknown = Object.getOwnPropertyDescriptor(
    object,
    "negative",
  )?.value
  const nested: unknown = Object.getOwnPropertyDescriptor(
    object,
    "nested",
  )?.value
  const nestedNegative: unknown = Array.isArray(nested) ? nested[0] : undefined
  return (
    <pre>
      {JSON.stringify({
        payload,
        ownPrototypeKey: Object.hasOwn(object, "__proto__"),
        negativeZero: Object.is(negative, -0),
        nestedNegativeZero: Object.is(nestedNegative, -0),
        optionalUndefined: optional === undefined,
        ownUndefined: Object.hasOwn(object, "optionalField"),
        nestedUndefined: Array.isArray(nested) && nested[1] === undefined,
      })}
    </pre>
  )
}
