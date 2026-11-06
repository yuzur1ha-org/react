import { ThemeProvider, useTheme } from "@emotion/react"
import { tokens, type DesignTokens } from "@yuzur1ha/token"
import { useMemo, type ReactNode } from "react"

declare module "@emotion/react" {
  export interface Theme {
    yuzur1ha?: DesignTokens
  }
}
export function UIProvider({
  theme,
  children,
}: {
  theme?: DesignTokens
  children: ReactNode
}) {
  const parent = useTheme()
  const value = useMemo(
    () => ({ yuzur1ha: theme ?? parent.yuzur1ha ?? tokens }),
    [theme, parent.yuzur1ha],
  )
  return <ThemeProvider theme={value}>{children}</ThemeProvider>
}
export function useTokens(): DesignTokens {
  return useTheme().yuzur1ha ?? tokens
}
