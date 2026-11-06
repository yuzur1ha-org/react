import { ArrowUpRight } from "lucide-react"
import { homeStyles } from "./home.styles"
import { useEffect, useState, type ReactNode } from "react"
import { deploymentHref, type SiteHome } from "@yuzur1ha/press/content"
import { useSite } from "../context"
import { SiteLink, SiteCardLink } from "../links"
export function SiteHomePage({
  home,
  children,
}: {
  home: SiteHome
  children?: ReactNode
}) {
  const site = useSite()
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return (
    <main
      id="main"
      className="press-home"
      data-press-ready={ready ? "true" : undefined}
      tabIndex={-1}
      css={homeStyles}
    >
      <section className="press-hero">
        <div className="press-hero-copy">
          {home.hero.name && (
            <p className="press-hero-name">{home.hero.name}</p>
          )}
          <h1>{home.hero.text}</h1>
          {home.hero.tagline && (
            <p className="press-hero-tagline">{home.hero.tagline}</p>
          )}
          <div className="press-hero-actions">
            {home.hero.actions?.map((action) => (
              <SiteLink
                key={action.link}
                href={action.link}
                appearance={action.appearance ?? "primary"}
              >
                {action.text}
              </SiteLink>
            ))}
          </div>
        </div>
        {!home.hero.image && site.logo && (
          <div
            className="press-hero-symbol"
            aria-hidden="true"
            style={{ maskImage: `url("${site.logo.src}")` }}
          />
        )}
        {home.hero.image && (
          <img
            className="press-hero-image"
            src={
              home.hero.image.src.startsWith("/")
                ? deploymentHref(site.base, home.hero.image.src)
                : home.hero.image.src
            }
            alt={home.hero.image.alt}
          />
        )}
      </section>
      {home.features?.length ? (
        <section className="press-features">
          {home.features.map((feature, index) => {
            const content = (
              <>
                <span className="press-feature-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>
                  {feature.title}
                  {feature.link && (
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  )}
                </h2>
                <p>{feature.description}</p>
              </>
            )
            return feature.link ? (
              <SiteCardLink
                className="press-feature-card"
                href={feature.link}
                key={feature.title}
                underline={false}
              >
                {content}
              </SiteCardLink>
            ) : (
              <article className="press-feature-card" key={feature.title}>
                {content}
              </article>
            )
          })}
        </section>
      ) : null}
      {children && (
        <section
          className="press-home-content press-prose yu-markdown"
          data-markdown="gfm"
        >
          {children}
        </section>
      )}
    </main>
  )
}
