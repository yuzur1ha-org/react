import ts from "typescript"
import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  mkdtemp,
  rm,
} from "node:fs/promises"
import { dirname, resolve, relative, join } from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

export function declarationSpecifier(
  value: string,
  file: string,
  files: ReadonlySet<string>,
): string {
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

export function rewriteDeclaration(
  source: string,
  file: string,
  files: ReadonlySet<string>,
): string {
  const tree = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const changes: { start: number; end: number; text: string }[] = []
  function visit(node: ts.Node): void {
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

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map(async (entry) =>
        entry.isDirectory()
          ? walk(join(directory, entry.name))
          : [join(directory, entry.name)],
      ),
    )
  ).flat()
}

export interface DeclarationBuildOptions {
  root?: string
  config?: string
  outDir?: string
  /** Parent directory for per-build scratch files. */
  temporaryDir?: string
  shims?: readonly { source: string; target: string }[]
}

export async function buildDeclarations({
  root = process.cwd(),
  config = "tsconfig.build.json",
  outDir = "dist",
  temporaryDir = ".cache/declarations",
  shims = [],
}: DeclarationBuildOptions = {}): Promise<void> {
  root = resolve(root)
  const parent = resolve(root, temporaryDir)
  await mkdir(parent, { recursive: true })
  const temporary = await mkdtemp(join(parent, "build-"))
  try {
    const compiler = fileURLToPath(import.meta.resolve("typescript/bin/tsc"))
    execFileSync(
      process.execPath,
      [
        compiler,
        "-p",
        config,
        "--emitDeclarationOnly",
        "--declarationMap",
        "false",
        "--outDir",
        temporary,
      ],
      { cwd: root, stdio: "inherit" },
    )
    const files = new Set(await walk(temporary))
    for (const file of files) {
      if (!file.endsWith(".d.ts")) continue
      const destination = resolve(root, outDir, relative(temporary, file))
      await mkdir(dirname(destination), { recursive: true })
      await writeFile(
        destination,
        rewriteDeclaration(await readFile(file, "utf8"), file, files),
      )
    }
    for (const shim of shims) {
      const destination = resolve(root, outDir, shim.target)
      await mkdir(dirname(destination), { recursive: true })
      await writeFile(
        destination,
        rewriteDeclaration(
          await readFile(resolve(root, shim.source), "utf8"),
          resolve(temporary, shim.target),
          files,
        ),
      )
    }
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}
