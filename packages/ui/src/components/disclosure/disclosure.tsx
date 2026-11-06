import type {
  DisclosureProps,
  DisclosureTriggerProps,
  DisclosureContentProps,
} from "./disclosure.types"
export type {
  DisclosureProps,
  DisclosureTriggerProps,
  DisclosureContentProps,
} from "./disclosure.types"
import * as Primitive from "@radix-ui/react-collapsible"
import { useId, createContext, useContext } from "react"
import { disclosureStyles } from "./disclosure.styles"
const TriggerId = createContext<string | undefined>(undefined)

export function Disclosure({ className = "", ...props }: DisclosureProps) {
  const id = useId()
  return (
    <TriggerId.Provider value={id}>
      <Primitive.Root
        {...props}
        css={disclosureStyles}
        className={`yu-disclosure ${className}`}
      />
    </TriggerId.Provider>
  )
}

export function DisclosureTrigger({
  children,
  className = "",
  headingLevel = 3,
  ...props
}: DisclosureTriggerProps) {
  const id = useContext(TriggerId)
  const Heading = `h${headingLevel}` as const
  return (
    <Heading className="yu-disclosure-heading">
      <Primitive.Trigger
        id={id}
        {...props}
        className={`yu-disclosure-trigger ${className}`}
      >
        <svg
          className="yu-disclosure-marker"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path d="M3 2 9 6 3 10Z" fill="currentColor" />
        </svg>
        <span>{children}</span>
      </Primitive.Trigger>
    </Heading>
  )
}

export function DisclosureContent({
  children,
  className = "",
  ...props
}: DisclosureContentProps) {
  const id = useContext(TriggerId)
  return (
    <Primitive.Content
      role="region"
      aria-labelledby={id}
      {...props}
      className={`yu-disclosure-content ${className}`}
    >
      <div className="yu-disclosure-body">{children}</div>
    </Primitive.Content>
  )
}
