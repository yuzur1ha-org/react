import ts from "typescript"
import { existsSync } from "node:fs"
import { readdir, readFile, writeFile, mkdir, rm, cp } from "node:fs/promises"
import { dirname, resolve, relative, join } from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

export function declarationSpecifier(value, file, files) {
  if (!value.startsWith(".")) {
    if (value.startsWith("#"))
      throw new Error(`Private declaration alias: ${value}`)
    return value
  }
  const target = resolve(dirname(file), value)
  const candidates = [
    target.replace(/\.js$/, ".d.ts"),
    target + ".d.ts",
    join(target, "index.d.ts"),
  ]
  const found = candidates.find((candidate) => files.has(candidate))
  if (!found)
    throw new Error(`Unresolved declaration import ${value} in ${file}`)
  let output = relative(dirname(file), found)
    .replaceAll("\\", "/")
    .replace(/\.d\.ts$/, ".js")
  if (!output.startsWith(".")) output = "./" + output
  return output
}

export function rewriteDeclaration(source, file, files) {
  const tree = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const changes = []
  function visit(node) {
    const module =
      ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
        ? node.moduleSpecifier
        : ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)
          ? node.argument.literal
          : undefined
    if (module && ts.isStringLiteral(module)) {
      changes.push({
        start: module.getStart(tree),
        end: module.end,
        text: JSON.stringify(declarationSpecifier(module.text, file, files)),
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return changes
    .sort((a, b) => b.start - a.start)
    .reduce(
      (text, change) =>
        text.slice(0, change.start) + change.text + text.slice(change.end),
      source,
    )
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(join(directory, entry.name))
          : [join(directory, entry.name)],
      ),
    )
  ).flat()
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = process.cwd(),
    temporary = join(root, ".cache/declarations")
  await rm(temporary, { recursive: true, force: true })
  const compiler = fileURLToPath(import.meta.resolve("typescript/bin/tsc"))
  execFileSync(
    process.execPath,
    [
      compiler,
      "-p",
      "tsconfig.build.json",
      "--emitDeclarationOnly",
      "--declarationMap",
      "false",
      "--outDir",
      temporary,
    ],
    { stdio: "inherit" },
  )
  const files = new Set(await walk(temporary))
  for (const file of files) {
    if (!file.endsWith(".d.ts")) continue
    const destination = join(root, "dist", relative(temporary, file))
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(
      destination,
      rewriteDeclaration(await readFile(file, "utf8"), file, files),
    )
  }
  // Ambient shims with no exports are inputs rather than emitted declarations.
  const shim = join(root, "src/client.ts")
  if (existsSync(shim) && !existsSync(join(root, "dist/client.d.ts")))
    await cp(shim, join(root, "dist/client.d.ts"))
}
