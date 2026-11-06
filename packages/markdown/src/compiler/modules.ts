import type { Expression, ImportDeclaration, Program } from "estree"
import { dataExpression } from "./literal"
import type { Binding, ModuleReference } from "./types"

export function moduleBindings() {
  const imports: ImportDeclaration[] = []
  const bindings = new Map<string, Binding>()
  const identities = new WeakMap<object, string>()

  const reference = ({ from, name = "default" }: ModuleReference): Binding => {
    const key = JSON.stringify([from, name])
    const existing = bindings.get(key)
    if (existing) return existing
    const local = {
      type: "Identifier",
      name: `_documentImport${bindings.size}`,
    } as const
    const binding: Binding = { type: "binding", name: local.name }
    imports.push({
      type: "ImportDeclaration",
      attributes: [],
      source: { type: "Literal", value: from },
      specifiers: [
        name === "default"
          ? { type: "ImportDefaultSpecifier", local }
          : {
              type: "ImportSpecifier",
              local,
              imported: { type: "Identifier", name },
            },
      ],
    })
    identities.set(binding, local.name)
    bindings.set(key, binding)
    return binding
  }

  const expression = (value: unknown): Expression => {
    if (value && typeof value === "object") {
      const name = identities.get(value)
      if (name) return { type: "Identifier", name }
    }
    return dataExpression(value)
  }

  return {
    reference,
    expression,
    program: (): Program => ({
      type: "Program",
      sourceType: "module",
      body: imports,
    }),
  }
}
