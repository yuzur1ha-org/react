import type { SelectProps } from "./select.types"
export type { SelectOption, SelectProps } from "./select.types"
import { selectStyles, selectContentStyles } from "./select.styles"
import { useId, useState } from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { FieldShell } from "../../internal/field-shell"

export function Select({
  label,
  size = "medium",
  font = "body",
  appearance = "field",
  hideLabel = false,
  hint,
  error,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  name,
  form,
  required,
  disabled,
  id: suppliedId,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  onKeyDown,
  onPointerDown,
  ...props
}: SelectProps) {
  const generated = useId()
  const [navigation, setNavigation] = useState<"keyboard" | "pointer">(
    "pointer",
  )
  const id = suppliedId ?? generated
  return (
    <FieldShell
      {...{ id, label, hideLabel }}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
    >
      <SelectPrimitive.Root
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(onValueChange ? { onValueChange } : {})}
        {...(name ? { name } : {})}
        {...(form ? { form } : {})}
        {...(required !== undefined ? { required } : {})}
        {...(disabled !== undefined ? { disabled } : {})}
      >
        <SelectPrimitive.Trigger
          css={selectStyles}
          data-size={size}
          data-font={font}
          data-appearance={appearance}
          {...props}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (!event.defaultPrevented) setNavigation("keyboard")
          }}
          onPointerDown={(event) => {
            onPointerDown?.(event)
            if (!event.defaultPrevented) setNavigation("pointer")
          }}
          id={id}
          className={`yu-input yu-select ${className}`}
          aria-invalid={error ? true : invalid}
          aria-describedby={
            [describedBy, error || hint ? `${id}-hint` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              className="yu-select-chevron"
              size={16}
              aria-hidden="true"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            css={selectContentStyles}
            className="yu-select-content"
            data-navigation={navigation}
            data-size={size}
            data-font={font}
            onKeyDownCapture={() => setNavigation("keyboard")}
            onPointerMoveCapture={() => setNavigation("pointer")}
            position="popper"
            sideOffset={6}
            collisionPadding={12}
          >
            <SelectPrimitive.ScrollUpButton className="yu-select-scroll">
              <ChevronUp size={16} aria-hidden="true" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled ?? false}
                  className="yu-select-option"
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check size={16} aria-hidden="true" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="yu-select-scroll">
              <ChevronDown size={16} aria-hidden="true" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </FieldShell>
  )
}
