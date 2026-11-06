import { Link } from "@yuzur1ha/ui"
export function LinkDemo() {
  return (
    <>
      <div className="demo-row">
        <Link href="#link-destination" size="small">
          Small link
        </Link>
        <Link href="#link-destination">Read the guide</Link>
        <Link href="#link-destination" size="large">
          Explore documentation
        </Link>
      </div>
      <div className="demo-row">
        <Link href="#link-destination" appearance="primary" size="large">
          Get started
        </Link>
        <Link
          href="#link-destination"
          appearance="secondary"
          size="small"
          showIcon={false}
        >
          Back to overview
        </Link>
      </div>
      <Link.Container
        href="#link-destination"
        className="demo-link-card"
        size="large"
      >
        <span className="demo-label">COMPOSED LINK</span>
        <h2>
          <Link.Underline>Account settings</Link.Underline>
        </h2>
        <p>Hover anywhere on this card to underline only its title.</p>
      </Link.Container>
      <p id="link-destination" tabIndex={-1}>
        Link destination. Navigation uses a native anchor; the icon stays at the
        upper right of its content.
      </p>
    </>
  )
}
