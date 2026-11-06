import { createContext } from "react"

export const LoadingContext = createContext<(() => () => void) | undefined>(
  undefined,
)
