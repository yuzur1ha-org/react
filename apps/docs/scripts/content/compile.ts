import type { ProjectContext } from "@yuzur1ha/press/node"
import { compileDocument as compileMarkdown } from "@yuzur1ha/markdown/compiler"
import { remarkTables, staticHtml } from "@yuzur1ha/markdown/plugins"
import type { ComponentApi } from "@yuzur1ha/press-reference"
import { Ajv } from "ajv"
import { resolve } from "node:path"
import ts from "typescript"
import schemaDefinition from "../../schemas/component-api.schema.json" with { type: "json" }
import { figmaDirective } from "./figma"
import { analyzeReference } from "./metadata"
const ajv = new Ajv({ allErrors: true })
const validateApi = ajv.compile<ComponentApi>(schemaDefinition)

export async function compileDocument(
  id: string,
  source: string,
  read: (file: string) => string,
  directory = resolve(import.meta.dirname, "../../src/content/components", id),
  renderer = "@yuzur1ha/press-reference",
  project?: ProjectContext,
) {
  const demos: { file: string; exportName: string }[] = []
  const schemas: ComponentApi[] = []
  const result = await (project?.compileDocument ?? compileMarkdown)(
    source,
    `${id}/index.md`,
    {
      html: staticHtml,
      remarkPlugins: [remarkTables],
      analyze: (tree, context) => analyzeReference(id, tree, context),
      directives: {
        figma: figmaDirective,
        demo: {
          kind: "leafDirective",
          async render(node, context) {
            const fail = context.fail
            const file = node.attributes.src
            const exportName = node.attributes.export
            if (
              !file ||
              !/^\.\/[\w-]+\.tsx$/.test(file) ||
              !exportName ||
              !/^[A-Za-z_$][\w$]*$/.test(exportName)
            )
              return fail("Invalid demo reference", node.position)
            const code = read(file)
            const ast = ts.createSourceFile(
              file,
              code,
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TSX,
            )
            const exported = ast.statements.some(
              (statement) =>
                ts.canHaveModifiers(statement) &&
                ts
                  .getModifiers(statement)
                  ?.some(
                    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
                  ) &&
                ((ts.isFunctionDeclaration(statement) &&
                  statement.name?.text === exportName) ||
                  (ts.isVariableStatement(statement) &&
                    statement.declarationList.declarations.some(
                      (declaration) =>
                        ts.isIdentifier(declaration.name) &&
                        declaration.name.text === exportName,
                    ))),
            )
            if (!exported) fail(`Missing demo export ${file}#${exportName}`)
            demos.push({ file, exportName })
            return {
              component: { from: renderer, name: "Demo" },
              props: {
                Component: context.import({
                  from: resolve(directory, file),
                  name: exportName,
                }),
                source: code,
                ...(project
                  ? { code: await project.highlightCode(code, "tsx") }
                  : {}),
                file: `content/components/${id}/${file.slice(2)}`,
                id,
              },
            }
          },
        },
        schema: {
          kind: "leafDirective",
          render(node, context) {
            const fail = context.fail
            const file = node.attributes.src
            if (!file || !/^\.\/[\w-]+\.json$/.test(file))
              return fail("Invalid schema reference", node.position)
            const value: unknown = JSON.parse(read(file))
            if (!validateApi(value))
              fail(
                `Invalid API schema ${file}: ${ajv.errorsText(validateApi.errors)}`,
              )
            if (validateApi(value)) {
              if (value.component !== id)
                fail(`API schema component must be ${id}`)
              const parts = new Set<string>()
              for (const part of value.parts) {
                if (parts.has(part.name))
                  fail(`Duplicate API part ${part.name}`)
                parts.add(part.name)
                for (const members of [part.props, part.methods]) {
                  if (
                    new Set(members.map((member) => member.name)).size !==
                    members.length
                  )
                    fail(`Duplicate API member in ${part.name}`)
                }
              }
              schemas.push(value)
              return {
                component: { from: renderer, name: "Schema" },
                props: { schema: value },
              }
            }
            return fail("Invalid API schema", node.position)
          },
        },
      },
    },
  )
  if (!demos.length || !schemas.length)
    throw new Error(
      `${id}/index.md: Each document needs a demo and API reference`,
    )
  return { ...result, demos, schemas }
}
