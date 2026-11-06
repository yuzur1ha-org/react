import { useMessages, useSite } from "../context"
import { SiteLink } from "../links"
import { notFoundStyles } from "./not-found.styles"

export function NotFound() {
  const text = useMessages()
  const site = useSite()
  return (
    <main id="main" className="press-not-found" css={notFoundStyles}>
      <div className="press-error-figure" aria-hidden="true">
        <span className="press-error-code">404</span>
        <span className="press-error-coordinate">— / —</span>
      </div>
      <div className="press-error-copy">
        <span className="press-error-index" aria-hidden="true">
          404 /
        </span>
        <h1>{text.notFound}</h1>
        <p>{text.notFoundDescription}</p>
        <SiteLink
          href={site.homes[0]?.route ?? site.documents[0]?.route ?? "/"}
          appearance="primary"
          underline={false}
        >
          {text.returnHome}
        </SiteLink>
      </div>
    </main>
  )
}
