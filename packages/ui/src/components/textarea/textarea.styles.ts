import { css } from "@emotion/react"
import { themed } from "../../theme/themed"
import { input } from "../../internal/styles"
export const textareaStyles = themed(css`
  ${input};
  height: 128px;
  resize: vertical;
`)
