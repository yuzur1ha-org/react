import type { ReferenceMetadata } from "../types"

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})
export function formatDocumentDate(value: string) {
  return dateFormat.format(new Date(`${value}T00:00:00Z`))
}
export function documentDates(metadata: ReferenceMetadata) {
  const dates: { label: "Created" | "Updated"; value: string }[] = []
  if (metadata.created && metadata.created !== metadata.updated)
    dates.push({ label: "Created", value: metadata.created })
  if (metadata.updated)
    dates.push({ label: "Updated", value: metadata.updated })
  return dates
}
export function formatDocumentVersion(value: string) {
  if (value.toLowerCase() === "draft") return "Draft"
  return /^\d+\.\d+\.\d+(?:[-+].+)?$/.test(value) ? `v${value}` : value
}
