import { createContext, useContext } from "react"
import { useMessages } from "@yuzur1ha/press/react"
import type { PressMessages } from "@yuzur1ha/press/content"

export type ReferenceMessages = Pick<
  PressMessages,
  | "playground"
  | "version"
  | "draft"
  | "created"
  | "updated"
  | "properties"
  | "property"
  | "type"
  | "required"
  | "default"
  | "description"
  | "yes"
  | "no"
  | "inheritedProperties"
  | "methods"
  | "method"
  | "signature"
  | "noMethods"
> & { sourceLanguage: string }

export const ReferenceMessagesContext = createContext<
  Partial<ReferenceMessages>
>({})

export function useReferenceMessages(): ReferenceMessages {
  const site = useMessages()
  const overrides = useContext(ReferenceMessagesContext)
  return { ...site, sourceLanguage: "React / TypeScript", ...overrides }
}
