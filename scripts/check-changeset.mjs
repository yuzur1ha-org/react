import { execFileSync } from "node:child_process"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import {
  publicChanges,
  versionOnlyChange,
  parseChangeset,
} from "./changeset-policy.mjs"
const base = process.env.BASE_REF
if (!base) throw new Error("BASE_REF is required")
const git = (args) => execFileSync("git", args, { encoding: "utf8" })
const files = git(["diff", "--name-only", `${base}...HEAD`])
  .trim()
  .split("\n")
const changed = publicChanges(files)
const isChangeset = (file) =>
  /^\.changeset\/.+\.md$/.test(file) && !file.endsWith("README.md")
const packageNames = new Set(
  readdirSync("packages", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(
      (entry) =>
        JSON.parse(readFileSync(`packages/${entry.name}/package.json`, "utf8"))
          .name,
    ),
)
const changedPackages = new Set(
  changed.map(
    (file) =>
      JSON.parse(
        readFileSync(`packages/${file.split("/")[1]}/package.json`, "utf8"),
      ).name,
  ),
)
const addedChangesets = files
  .filter((file) => isChangeset(file) && existsSync(file))
  .map((file) => {
    const changeset = parseChangeset(readFileSync(file, "utf8"), packageNames)
    if (!changeset) throw new Error(`Invalid Changeset: ${file}`)
    return changeset
  })
const covered = new Set(
  addedChangesets.flatMap((changeset) => Object.keys(changeset)),
)
const internalOnly = addedChangesets.some(
  (changeset) => Object.keys(changeset).length === 0,
)
const added =
  internalOnly || [...changedPackages].every((name) => covered.has(name))
const consumed = files.some(
  (file) =>
    isChangeset(file) &&
    !existsSync(file) &&
    parseChangeset(git(["show", `${base}:${file}`]), packageNames),
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
