import { expect, it } from "vitest"
import {
  documentDates,
  formatDocumentDate,
  formatDocumentVersion,
} from "@yuzur1ha/press-reference"
const base = { title: "Button", description: "A native action." }
it("omits missing metadata and collapses equal creation/update dates", () => {
  expect(documentDates(base)).toEqual([])
  expect(
    documentDates({ ...base, created: "2026-10-24", updated: "2026-10-24" }),
  ).toEqual([{ label: "Updated", value: "2026-10-24" }])
})
it("retains distinct dates and handles either date on its own", () => {
  expect(
    documentDates({ ...base, created: "2026-10-23", updated: "2026-10-24" }),
  ).toEqual([
    { label: "Created", value: "2026-10-23" },
    { label: "Updated", value: "2026-10-24" },
  ])
  expect(documentDates({ ...base, created: "2026-10-23" })).toEqual([
    { label: "Created", value: "2026-10-23" },
  ])
  expect(documentDates({ ...base, updated: "2026-10-24" })).toEqual([
    { label: "Updated", value: "2026-10-24" },
  ])
})
it("formats dates in a stable timezone and preserves custom version labels", () => {
  expect(formatDocumentDate("2026-10-24")).toBe("24 Oct 2026")
  expect(formatDocumentVersion("draft")).toBe("Draft")
  expect(formatDocumentVersion("1.2.3-beta.1")).toBe("v1.2.3-beta.1")
  expect(formatDocumentVersion("v1.2.3")).toBe("v1.2.3")
  expect(formatDocumentVersion("Preview 2")).toBe("Preview 2")
})
