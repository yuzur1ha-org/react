import { baseMarkdownStyles } from "./base"
import { gfmMarkdownStyles } from "./gfm"

/** Scoped HTML typography; supply theme variables on the containing element. */
export const markdownStyles = baseMarkdownStyles + gfmMarkdownStyles
