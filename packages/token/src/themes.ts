import { deriveTokens } from "./derive"

export const tokens = deriveTokens()
export const darkTokens = deriveTokens({ mode: "dark" })
