import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import ts from "typescript"
import { expect, it } from "vitest"
import { compileDocument } from "../../scripts/content/compile"
import { componentIds } from "../helpers/inventory"

const documents = await Promise.all(
  componentIds.map(async (id) => {
    const directory = new URL(
      `../../src/content/components/${id}/`,
      import.meta.url,
    )
    const { schemas } = await compileDocument(
      id,
      readFileSync(new URL("index.md", directory), "utf8"),
      (file) => readFileSync(new URL(file, directory), "utf8"),
    )
    const schema = schemas[0]
    if (!schema) throw new Error(`Missing ${id} API`)
    return schema
  }),
)

it("keeps authored prop types, required flags and literal defaults compatible with the built public API", () => {
  const file = resolve(import.meta.dirname, "schema-contracts.virtual.ts")
  const reactTypes = [
    "CSSProperties",
    "ChangeEventHandler",
    "ClipboardEventHandler",
    "ComponentPropsWithRef",
    "FocusEventHandler",
    "HTMLAttributeAnchorTarget",
    "HTMLInputAutoCompleteAttribute",
    "HTMLInputTypeAttribute",
    "KeyboardEventHandler",
    "MouseEventHandler",
    "PointerEventHandler",
    "ReactElement",
    "ReactEventHandler",
    "ReactNode",
    "Ref",
    "SubmitEventHandler",
    "WheelEventHandler",
  ]
  const uiTypes = [
    "ComponentSize",
    "ToastDuration",
    "ToastTone",
    "SelectOption",
    "DrawerProps",
    "PopoverProps",
    "FormMessageProps",
  ]
  const lines = [
    'import type * as UI from "@yuzur1ha/ui";',
    'import type * as React from "react";',
    `import type { ${reactTypes.join(", ")} } from "react";`,
    `import type { ${uiTypes.join(", ")} } from "@yuzur1ha/ui";`,
    "type T = string;",
    "type Assert<T extends true> = T;",
    "type Prop<T, K extends PropertyKey> = T extends unknown ? K extends keyof T ? T[K] : undefined : never;",
    "type Keys<T> = T extends unknown ? keyof T : never;",
    "type RequiredInAll<T, K extends PropertyKey> = [T] extends [Record<K, unknown>] ? true : false;",
  ]
  const parts = documents.flatMap((document) => document.parts)
  const aliases = new Map<string, number>()
  for (const [index, part] of parts.entries()) {
    const type =
      part.typeName === "SegmentedProps<T>"
        ? "UI.SegmentedProps<string>"
        : part.typeName.startsWith("ComponentPropsWithRef<")
          ? part.typeName.replace("typeof ", "typeof UI.")
          : `UI.${part.typeName}`
    const component = part.name === "Toast / ToastItem" ? "Toast" : part.name
    lines.push(
      `type Part_${index} = ${type};`,
      `type Rendered_${index} = React.ComponentProps<typeof UI.${component}>;`,
      `type Binding_${index}_Accepts = Assert<[Part_${index}] extends [Rendered_${index}] ? true : false>;`,
      `type Binding_${index}_Covers = Assert<[Rendered_${index}] extends [Part_${index}] ? true : false>;`,
    )
    aliases.set(`Part_${index}`, index)
    for (const [member, property] of part.props.entries()) {
      const key = JSON.stringify(property.name)
      const name = `P_${index}_${member}`
      lines.push(
        `// ${part.name}.${property.name}`,
        `type ${name}_Actual = Prop<Part_${index}, ${key}>;`,
        `type ${name}_Documented = (${property.type})${property.required ? "" : " | undefined"};`,
        `type ${name}_Exists = Assert<${key} extends Keys<Part_${index}> ? true : false>;`,
        `type ${name}_Required = Assert<RequiredInAll<Part_${index}, ${key}> extends ${property.required} ? true : false>;`,
        `type ${name}_Accepts = Assert<[${name}_Documented] extends [${name}_Actual] ? true : false>;`,
        `type ${name}_Covers = Assert<[${name}_Actual] extends [${name}_Documented] ? true : false>;`,
      )
      if (property.default !== undefined) {
        try {
          const literal: unknown = JSON.parse(property.default)
          if (
            literal === null ||
            ["boolean", "number", "string"].includes(typeof literal)
          )
            lines.push(
              `type ${name}_Default = Assert<${JSON.stringify(literal)} extends ${name}_Actual ? true : false>;`,
            )
        } catch {
          // Inherited defaults are explanatory text, not independent values.
        }
      }
    }
  }
  lines.push(
    'type SelectOwnsTrigger = Assert<"asChild" extends keyof UI.SelectProps ? false : true>;',
  )
  const source = lines.join("\n")
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    exactOptionalPropertyTypes: true,
    skipLibCheck: true,
    noEmit: true,
    types: [],
  }
  const host = ts.createCompilerHost(options)
  const read = host.getSourceFile.bind(host)
  host.getSourceFile = (name, languageVersion, ...rest) =>
    name === file
      ? ts.createSourceFile(name, source, languageVersion, true)
      : read(name, languageVersion, ...rest)
  const program = ts.createProgram([file], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  expect(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => import.meta.dirname,
      getNewLine: () => "\n",
    }),
  ).toBe("")
  const checker = program.getTypeChecker()
  const ast = program.getSourceFile(file)
  if (!ast) throw new Error("Missing contract source")
  for (const statement of ast.statements) {
    if (!ts.isTypeAliasDeclaration(statement)) continue
    const index = aliases.get(statement.name.text)
    if (index === undefined) continue
    const part = parts[index]
    if (!part) throw new Error("Missing API part")
    const type = checker.getTypeAtLocation(statement)
    const branches = type.isUnion() ? type.types : [type]
    const documented = new Set(part.props.map((property) => property.name))
    for (const branch of branches)
      for (const property of checker.getPropertiesOfType(branch)) {
        const owned = property.declarations?.some((declaration) =>
          declaration.getSourceFile().fileName.includes("/packages/ui/dist/"),
        )
        if (owned)
          expect(
            documented.has(property.name),
            `${part.name}.${property.name} is missing from schema`,
          ).toBe(true)
      }
  }
})

it("keeps documented literal defaults in sync with component implementations", () => {
  const aliases: Record<string, string> = {
    LinkRoot: "Link",
    LinkContainer: "Link.Container",
    LinkUnderline: "Link.Underline",
    MenuSurface: "ResponsiveMenu",
    Toast: "Toast / ToastItem",
  }
  const parts = new Map(
    documents.flatMap((document) =>
      document.parts.map((part) => [part.name, part] as const),
    ),
  )
  for (const id of [...componentIds, "close-button"]) {
    const directory = new URL(
      `../../../../packages/ui/src/components/${id}/`,
      import.meta.url,
    )
    for (const name of readdirSync(directory).filter(
      (name) => name.endsWith(".tsx") && !name.endsWith(".test.tsx"),
    )) {
      const ast = ts.createSourceFile(
        name,
        readFileSync(new URL(name, directory), "utf8"),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      )
      for (const declaration of ast.statements) {
        if (!ts.isFunctionDeclaration(declaration) || !declaration.name)
          continue
        const part = parts.get(
          aliases[declaration.name.text] ?? declaration.name.text,
        )
        if (!part) continue
        const bindings = declaration.parameters.map(
          (parameter) => parameter.name,
        )
        for (const statement of declaration.body?.statements ?? [])
          if (ts.isVariableStatement(statement))
            for (const item of statement.declarationList.declarations)
              if (
                item.initializer &&
                ts.isIdentifier(item.initializer) &&
                item.initializer.text === "props"
              )
                bindings.push(item.name)
        for (const binding of bindings) {
          if (!ts.isObjectBindingPattern(binding)) continue
          for (const element of binding.elements) {
            const key = element.propertyName ?? element.name
            if (!ts.isIdentifier(key) && !ts.isStringLiteral(key)) continue
            const property = part.props.find(
              (property) => property.name === key.text,
            )
            const initial = element.initializer
            if (!property || !initial) continue
            let literal: string | number | boolean | null
            if (ts.isStringLiteral(initial)) literal = initial.text
            else if (ts.isNumericLiteral(initial))
              literal = Number(initial.text)
            else if (initial.kind === ts.SyntaxKind.TrueKeyword) literal = true
            else if (initial.kind === ts.SyntaxKind.FalseKeyword)
              literal = false
            else if (initial.kind === ts.SyntaxKind.NullKeyword) literal = null
            else continue
            expect(property.default, `${part.name}.${property.name}`).toBe(
              JSON.stringify(literal),
            )
          }
        }
      }
    }
  }
})
