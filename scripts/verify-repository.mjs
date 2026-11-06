import assert from "node:assert/strict"
import { readFile, readdir, access } from "node:fs/promises"
import { resolve, dirname, join } from "node:path"
const names = (await readdir("packages", { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name),
  manifests = new Map()
for (const name of names)
  manifests.set(
    `@yuzur1ha/${name}`,
    JSON.parse(await readFile(`packages/${name}/package.json`, "utf8")),
  )
function visit(name, stack = []) {
  assert.ok(
    !stack.includes(name),
    `Dependency cycle: ${[...stack, name].join(" -> ")}`,
  )
  for (const dependency of Object.keys(manifests.get(name)?.dependencies ?? {}))
    if (manifests.has(dependency)) visit(dependency, [...stack, name])
}
for (const name of manifests.keys()) visit(name)
const core = manifests.get("@yuzur1ha/press")
for (const dependency of Object.keys(core.dependencies))
  assert.ok(
    !/emotion|press-theme|press-reference|@yuzur1ha\/(ui|token)/.test(
      dependency,
    ),
    `Core visual dependency: ${dependency}`,
  )
async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries
        .filter(
          (entry) =>
            !["node_modules", "dist", ".cache", "tests"].includes(entry.name),
        )
        .map((entry) =>
          entry.isDirectory()
            ? markdownFiles(join(directory, entry.name))
            : entry.name.endsWith(".md")
              ? [join(directory, entry.name)]
              : [],
        ),
    )
  ).flat()
}
const docs = [
  "README.md",
  "README.zh-cn.md",
  "CONTRIBUTING.md",
  "apps/docs/README.md",
  ...(await markdownFiles("docs")),
  ...(await markdownFiles(".agents")),
  ...(await markdownFiles("packages")),
]
for (const file of docs) {
  const source = await readFile(file, "utf8")
  for (const match of source.matchAll(/\]\(([^\s)]+)\)/g)) {
    const target = match[1]
    if (/^(https?:|mailto:|#)/.test(target) || target.includes("${")) continue
    const path = target.split("#")[0]
    if (path)
      await access(resolve(dirname(file), path)).catch(() => {
        throw new Error(`Broken local link ${target} in ${file}`)
      })
  }
}
console.log(`Six-package DAG and ${docs.length} Markdown files checked`)

async function sourceFiles(directory) {
  return (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? sourceFiles(join(directory, entry.name))
          : /\.tsx?$/.test(entry.name)
            ? [join(directory, entry.name)]
            : [],
      ),
    )
  ).flat()
}
const ts = (await import("typescript")).default
for (const name of names) {
  for (const file of await sourceFiles(`packages/${name}/src`)) {
    const source = ts.createSourceFile(
      file,
      await readFile(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    )
    function inspect(node) {
      const value =
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : undefined
      if (value) {
        assert.ok(
          !(value.startsWith(".") && value.endsWith(".js")),
          `Source extension in ${file}: ${value}`,
        )
        assert.ok(
          !/@yuzur1ha\/[^/]+\/src\//.test(value),
          `Private package import in ${file}`,
        )
        if (name === "press")
          assert.ok(
            !/^(@emotion\/|@yuzur1ha\/(ui|token|press-theme|press-reference)(\/|$))/.test(
              value,
            ),
            `Core visual import in ${file}: ${value}`,
          )
        if (file.startsWith("packages/markdown/src/compiler/"))
          assert.ok(
            !/^(node:|vite$|@yuzur1ha\/)/.test(value),
            `Compiler boundary violation: ${value}`,
          )
        if (
          ["token", "ui", "press-theme", "press-reference"].includes(name) ||
          file.startsWith("packages/press/src/react/")
        )
          assert.ok(
            !value.startsWith("node:"),
            `Browser entry imports ${value}`,
          )
      }
      ts.forEachChild(node, inspect)
    }
    inspect(source)
  }
}
console.log("Source import and runtime boundaries checked")

// Global viewport tiers use range queries; container/content breakpoints stay independent.
async function checkBreakpoints(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["node_modules", "dist", ".cache", "tests"].includes(entry.name))
      continue
    const file = join(directory, entry.name)
    if (entry.isDirectory()) await checkBreakpoints(file)
    else if (/\.(?:css|tsx?)$/.test(file)) {
      const source = await readFile(file, "utf8")
      assert.ok(
        !/@media[^{};`]*\(\s*(?:max-width\s*:\s*(?:600|639|640|1023|1024)px|min-width\s*:\s*(?:640|641|1024|1025)px)/.test(
          source,
        ),
        `Legacy viewport tier in ${file}`,
      )
    }
  }
}
await checkBreakpoints("packages")
await checkBreakpoints("apps/docs/src")
