import { createContext } from "react"
export const DismissMenu = createContext<(reason: "link" | "action") => void>(
  () => undefined,
)

export type MenuActiveAppearance = "subtle" | "solid" | "emphasis"
export const MenuActiveStyle = createContext<MenuActiveAppearance>("subtle")
