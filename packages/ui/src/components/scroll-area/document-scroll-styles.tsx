import { css, Global } from "@emotion/react"
import { useTokens } from "../../theme/provider"

export function DocumentScrollStyles() {
  const theme = useTokens()
  return (
    <Global
      styles={css`
        html {
          scrollbar-gutter: stable;
        }
        @supports (scrollbar-gutter: stable) {
          /* The root retains its gutter while Radix locks body; do not reserve it twice. */
          body[data-scroll-locked][data-scroll-locked] {
            margin-right: 0 !important;
            --removed-body-scroll-bar-size: 0px;
          }
        }
        html,
        body * {
          scrollbar-width: thin;
          scrollbar-color: ${theme["scrollbar-thumb"]}
            ${theme["scrollbar-track"]};
        }
        @supports selector(::-webkit-scrollbar) {
          html,
          body * {
            scrollbar-width: auto;
            scrollbar-color: auto;
          }
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track,
          ::-webkit-scrollbar-corner {
            background: ${theme["scrollbar-track"]};
          }
          ::-webkit-scrollbar-thumb {
            background: ${theme["scrollbar-thumb"]};
            border: 1px solid ${theme["scrollbar-track"]};
            background-clip: padding-box;
            border-radius: 0;
            min-height: 24px;
            min-width: 24px;
          }
          ::-webkit-scrollbar-thumb:hover,
          ::-webkit-scrollbar-thumb:active {
            background-color: ${theme["scrollbar-thumb-hover"]};
          }
        }
        @media (forced-colors: active) {
          html,
          body * {
            scrollbar-color: auto;
          }
          ::-webkit-scrollbar-thumb {
            background-color: ButtonText;
            border-color: Canvas;
          }
          ::-webkit-scrollbar-track,
          ::-webkit-scrollbar-corner {
            background: Canvas;
          }
        }
      `}
    />
  )
}
