export type CodeOptions = {
  highlight?: boolean
  theme?: "tokens" | { light: string; dark: string }
  copy?: boolean
  lineNumbers?: boolean
  languages?: string[]
}
export type CodeToken = {
  text: string
  color?: string
  darkColor?: string
  fontStyle?: number
}
export type HighlightedCode = {
  source: string
  language?: string
  lines: CodeToken[][]
  copy: boolean
  lineNumbers: boolean
  enhanced: boolean
}
