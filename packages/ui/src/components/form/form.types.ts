import type * as Primitive from "@radix-ui/react-form"
import type { ComponentPropsWithRef, ReactNode } from "react"

export type FormProps = ComponentPropsWithRef<typeof Primitive.Root>

export type FormFieldProps = ComponentPropsWithRef<typeof Primitive.Field>

export type FormLabelProps = ComponentPropsWithRef<typeof Primitive.Label>

export type FormControlProps = ComponentPropsWithRef<typeof Primitive.Control>

export type FormMessageProps = ComponentPropsWithRef<
  typeof Primitive.Message
> & { children: ReactNode }

export type FormDescriptionProps = Omit<
  FormMessageProps,
  "match" | "forceMatch"
>

export type FormFieldsetProps = ComponentPropsWithRef<"fieldset">

export type FormLegendProps = ComponentPropsWithRef<"legend">

export type FormActionsProps = ComponentPropsWithRef<"div">

export type FormSubmitProps = ComponentPropsWithRef<typeof Primitive.Submit>

export type FormValidityStateProps = Primitive.FormValidityStateProps
