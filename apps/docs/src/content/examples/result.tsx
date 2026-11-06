import type { ReactNode } from "react"
export function DemoResult({ children }: { children: ReactNode }) {
  return <output className="demo-result">{children}</output>
}
