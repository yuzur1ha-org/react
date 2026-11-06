import { execFileSync } from "node:child_process"
import { readFileSync, existsSync } from "node:fs"
import { parse } from "yaml"
import { publicChanges, versionOnlyChange } from "./changeset-policy.mjs"
const base = process.env.BASE_REF
if (!base) throw new Error("BASE_REF is required")
const git = (args) => execFileSync("git", args, { encoding: "utf8" })
const files = git(["diff", "--name-only", `${base}...HEAD`])
  .trim()
  .split("\n")
const changed = publicChanges(files)
const isChangeset = (file) =>
  /^\.changeset\/.+\.md$/.test(file) && !file.endsWith("README.md")
function validChangeset(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(source)
  if (!match || !match[2].trim()) return false
  const value = parse(match[1])
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.entries(value).every(
      ([name, bump]) =>
        name.startsWith("@yuzur1ha/") &&
        ["major", "minor", "patch"].includes(bump),
    )
  )
}
const added = files.some(
  (file) =>
    isChangeset(file) &&
    existsSync(file) &&
    validChangeset(readFileSync(file, "utf8")),
)
const consumed = files.some(
  (file) =>
    isChangeset(file) &&
    !existsSync(file) &&
    validChangeset(git(["show", `${base}:${file}`])),
)
const versionPR =
  consumed &&
  changed.length > 0 &&
  changed.every(
    (file) =>
      file.endsWith("/package.json") &&
      versionOnlyChange(
        JSON.parse(git(["show", `${base}:${file}`])),
        JSON.parse(readFileSync(file, "utf8")),
      ),
  )
if (changed.length && !added && !versionPR)
  throw new Error(
    "Public changes require a valid Changeset; internal-only changes may use {} with a reason. Consuming changesets is permitted only for version-only changes.",
  )
