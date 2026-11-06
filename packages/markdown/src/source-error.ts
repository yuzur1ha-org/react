export class MarkdownSourceError extends Error {
  readonly sourceName: string
  constructor(sourceName: string, message: string) {
    super(`${sourceName}: ${message}`)
    this.name = "MarkdownSourceError"
    this.sourceName = sourceName
  }
}
export function sourceError(sourceName: string, message: string): never {
  throw new MarkdownSourceError(sourceName, message)
}
