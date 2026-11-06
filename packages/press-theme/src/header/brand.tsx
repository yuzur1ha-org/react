import { UIProvider } from "@yuzur1ha/ui"
import { darkTokens, mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
import { SiteLink } from "../links"
import { pressLayout } from "../layout/metrics"
import type { PublicSite } from "@yuzur1ha/press/content"
export function SiteBrand({
  site,
  home,
  tone = "dark",
}: {
  site: Pick<PublicSite, "title" | "logo">
  home: string
  tone?: "dark" | "inherit"
}) {
  return (
    <UIProvider {...(tone === "dark" ? { theme: darkTokens } : {})}>
      <SiteLink
        className="press-brand"
        href={home}
        underline={false}
        showIcon={false}
        aria-label={site.title}
        css={css`
          display: flex;
          align-items: center;
          gap: 12px;
          inline-size: ${pressLayout.brandWidth}px;
          max-inline-size: 100%;
          flex: none;
          min-width: 0;
          text-decoration: none;
          font-weight: 500;
          letter-spacing: -0.035em;
          font-size: 21px;
          line-height: 32px;
          .yu-link-content {
            display: flex;
            align-items: center;
            gap: 12px;
            inline-size: 100%;
            flex: none;
            min-width: 0;
          }
          .press-brand-mark {
            display: block;
            width: 26px;
            height: 26px;
            flex: none;
            background: currentColor;
            mask-position: center;
            mask-size: contain;
            mask-repeat: no-repeat;
          }
          @media ${mediaQueries.phone} {
            font-size: 19px;
            line-height: 28px;
            .press-brand-mark {
              width: 24px;
              height: 24px;
            }
          }
          .press-brand-label {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        `}
      >
        {site.logo && (
          <span
            className="press-brand-mark"
            role="img"
            aria-label={site.logo.alt}
            style={{ maskImage: `url("${site.logo.src}")` }}
          />
        )}
        <span className="press-brand-label">{site.title}</span>
      </SiteLink>
    </UIProvider>
  )
}
