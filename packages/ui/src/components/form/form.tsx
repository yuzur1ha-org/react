import type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormMessageProps,
  FormDescriptionProps,
  FormFieldsetProps,
  FormLegendProps,
  FormActionsProps,
  FormSubmitProps,
  FormValidityStateProps,
} from "./form.types"
export type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormMessageProps,
  FormDescriptionProps,
  FormFieldsetProps,
  FormLegendProps,
  FormActionsProps,
  FormSubmitProps,
  FormValidityStateProps,
} from "./form.types"
import * as Primitive from "@radix-ui/react-form"

import {
  formStyles,
  fieldStyles,
  controlStyles,
  fieldsetStyles,
  actionsStyles,
} from "./form.styles"
import { buttonStyles } from "../button/button.styles"

export function Form({
  className = "",
  onSubmit,
  onReset,
  onClearServerErrors,
  ...props
}: FormProps) {
  return (
    <Primitive.Root
      {...props}
      onSubmit={(event) => {
        onClearServerErrors?.()
        onSubmit?.(event)
      }}
      onReset={(event) => {
        onReset?.(event)
        if (!event.defaultPrevented) onClearServerErrors?.()
      }}
      css={formStyles}
      className={`yu-form ${className}`}
    />
  )
}

export function FormField({ className = "", ...props }: FormFieldProps) {
  return (
    <Primitive.Field
      {...props}
      css={fieldStyles}
      className={`yu-form-field ${className}`}
    />
  )
}

export function FormLabel({ className = "", ...props }: FormLabelProps) {
  return <Primitive.Label {...props} className={`yu-form-label ${className}`} />
}

export function FormControl({ className = "", ...props }: FormControlProps) {
  return (
    <Primitive.Control
      {...props}
      css={controlStyles}
      className={`yu-form-control ${className}`}
    />
  )
}

export function FormMessage({ className = "", ...props }: FormMessageProps) {
  return (
    <Primitive.Message {...props} className={`yu-form-message ${className}`} />
  )
}

export function FormDescription({
  className = "",
  ...props
}: FormDescriptionProps) {
  return (
    <Primitive.Message
      {...props}
      className={`yu-form-description ${className}`}
    />
  )
}

export function FormFieldset({ className = "", ...props }: FormFieldsetProps) {
  return (
    <fieldset
      {...props}
      css={fieldsetStyles}
      className={`yu-form-fieldset ${className}`}
    />
  )
}

export function FormLegend({ className = "", ...props }: FormLegendProps) {
  return <legend {...props} className={`yu-form-legend ${className}`} />
}

export function FormActions({ className = "", ...props }: FormActionsProps) {
  return (
    <div
      {...props}
      css={actionsStyles}
      className={`yu-form-actions ${className}`}
    />
  )
}

export function FormSubmit({ className = "", ...props }: FormSubmitProps) {
  return (
    <Primitive.Submit
      {...props}
      css={buttonStyles}
      className={`yu-button ${className}`}
    />
  )
}

export function FormValidityState(props: FormValidityStateProps) {
  return <Primitive.ValidityState {...props} />
}
