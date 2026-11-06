import { parseExpressionAt, type Expression as AcornExpression } from "acorn"
import type { Expression } from "estree"

function validateData(value: unknown, ancestors = new Set<object>()): void {
  if (
    value === undefined ||
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  )
    return
  if (typeof value === "number" && Number.isFinite(value)) return
  if (typeof value !== "object" || value === null)
    throw new TypeError(
      "Component props must contain JSON data or undefined values",
    )
  if (
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) !== Object.prototype &&
    Object.getPrototypeOf(value) !== null
  )
    throw new TypeError("Component props cannot contain class instances")
  if (ancestors.has(value))
    throw new TypeError("Component props cannot contain circular data")
  const toJSON = Object.getOwnPropertyDescriptor(value, "toJSON")
  if (
    Object.getOwnPropertySymbols(value).length ||
    (toJSON && (!("value" in toJSON) || typeof toJSON.value === "function"))
  )
    throw new TypeError(
      "Component props cannot contain symbols or custom serialization",
    )
  const keys = Object.keys(value)
  if (
    Array.isArray(value) &&
    (keys.length !== value.length ||
      keys.some((key, index) => key !== String(index)))
  )
    throw new TypeError(
      "Component props cannot contain sparse arrays or extra array properties",
    )
  ancestors.add(value)
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (!descriptor || !("value" in descriptor))
      throw new TypeError("Component props cannot contain accessors")
    const child: unknown = descriptor.value
    validateData(child, ancestors)
  }
  ancestors.delete(value)
}

function normalize(node: AcornExpression, value: unknown): AcornExpression {
  if (value === undefined)
    return parseExpressionAt("void 0", 0, { ecmaVersion: 2022 })
  if (typeof value === "number" && Object.is(value, -0))
    return parseExpressionAt("-0", 0, { ecmaVersion: 2022 })
  if (node.type === "ArrayExpression" && Array.isArray(value)) {
    node.elements = node.elements.map((element, index) => {
      if (!element || element.type === "SpreadElement")
        throw new Error("Unexpected JSON array node")
      const child: unknown = value[index]
      return normalize(element, child)
    })
  }
  if (node.type === "ObjectExpression" && value && typeof value === "object") {
    for (const property of node.properties) {
      if (
        property.type !== "Property" ||
        property.key.type !== "Literal" ||
        typeof property.key.value !== "string"
      )
        throw new Error("Unexpected JSON object node")
      // A computed key preserves __proto__ as data rather than an object-literal prototype setter.
      property.computed = property.key.value === "__proto__"
      const child: unknown = Object.getOwnPropertyDescriptor(
        value,
        property.key.value,
      )?.value
      property.value = normalize(property.value, child)
    }
  }
  return node
}

function isDataExpression(
  node: AcornExpression,
): node is AcornExpression & Expression {
  switch (node.type) {
    case "Literal":
      return (
        node.value === null ||
        typeof node.value === "string" ||
        typeof node.value === "boolean" ||
        (typeof node.value === "number" && Number.isFinite(node.value))
      )
    case "UnaryExpression":
      return (
        (node.operator === "-" || node.operator === "void") &&
        node.prefix &&
        node.argument.type === "Literal" &&
        typeof node.argument.value === "number" &&
        Number.isFinite(node.argument.value)
      )
    case "ArrayExpression":
      return node.elements.every(
        (child) =>
          child !== null &&
          child.type !== "SpreadElement" &&
          isDataExpression(child),
      )
    case "ObjectExpression":
      return node.properties.every(
        (property) =>
          property.type === "Property" &&
          property.kind === "init" &&
          !property.method &&
          !property.shorthand &&
          property.key.type === "Literal" &&
          typeof property.key.value === "string" &&
          isDataExpression(property.value),
      )
    default:
      return false
  }
}

export function dataExpression(value: unknown): Expression {
  validateData(value)
  // JSON placeholders keep undefined properties available for normalization against the original data.
  const source = JSON.stringify(value, (_key, item: unknown) =>
    item === undefined ? null : item,
  )
  if (source === undefined)
    throw new TypeError("Component prop could not be serialized")
  const parsed = parseExpressionAt(source, 0, { ecmaVersion: 2022 })
  if (parsed.end !== source.length)
    throw new Error("Unexpected trailing component prop source")
  const expression = normalize(parsed, value)
  if (!isDataExpression(expression))
    throw new Error("Unexpected component prop expression")
  return expression
}
