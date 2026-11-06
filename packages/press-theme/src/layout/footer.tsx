import { mediaQueries } from "@yuzur1ha/token"
import { css } from "@emotion/react"
import { useMessages, useSite } from "../context"
export function SiteFooter({ isHome }: { isHome: boolean }) {
  const site = useSite(),
    text = useMessages()
  return (
    <footer
      className="press-footer"
      data-layout={isHome ? "home" : "docs"}
      css={css`
        border-top: 1px solid var(--yu-border);
        padding: 24px 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        color: var(--yu-secondary);
        font-size: 12px;
        &[data-layout="home"] {
          padding: 48px clamp(20px, 5vw, 80px);
        }
        &[data-layout="home"] strong {
          display: block;
          font-size: 18px;
          color: var(--yu-ink);
          font-weight: 500;
          margin-bottom: 12px;
        }
        &[data-layout="docs"] {
          margin-left: var(--press-sidebar-width);
        }
        @media ${mediaQueries.phone} {
          &[data-layout="docs"] {
            margin-left: 0;
          }
        }
        @media ${mediaQueries.phone} {
          padding: 24px 20px;
          align-items: flex-start;
          flex-direction: column;
        }
      `}
    >
      <div>
        {isHome && <strong>{site.title}</strong>}
        <p>{site.footer.message ?? text.poweredBy}</p>
        {site.footer.copyright && <p>{site.footer.copyright}</p>}
      </div>
    </footer>
  )
}
