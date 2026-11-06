import { ScrollArea } from "@yuzur1ha/ui"

const sections = [
  "Overview",
  "Personal info",
  "Security",
  "Devices & sessions",
  "Preferences",
  "Notifications",
  "Privacy",
  "Connections",
  "Appearance",
  "Language",
  "Help",
  "About",
]

export function ScrollAreaDemo() {
  return (
    <>
      <section className="demo-scroll-group" aria-label="Scrollbar appearances">
        <h2>Appearance</h2>
        <p className="demo-label">
          Normal and contrast rails, or a hidden rail with native scrolling.
        </p>
        <div className="demo-scroll-comparison">
          {(["normal", "contrast", "hidden"] as const).map((appearance) => (
            <div className="demo-scroll-variant" key={appearance}>
              <h3>
                {appearance === "normal"
                  ? "Normal"
                  : appearance === "contrast"
                    ? "Contrast"
                    : "Hidden"}
              </h3>
              <ScrollArea
                label={`${appearance} list`}
                appearance={appearance}
                type="always"
                className="demo-scroll-list"
              >
                <ol className="demo-scroll-items">
                  {sections.map((section, index) => (
                    <li key={section}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {section}
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            </div>
          ))}
        </div>
      </section>
      <section
        className="demo-scroll-group"
        aria-label="Two-axis scrolling example"
      >
        <h2>Both axes</h2>
        <p className="demo-label">
          Scroll vertically, or hold Shift and use the wheel to move
          horizontally. Arrow keys work when focused.
        </p>
        <ScrollArea
          label="Release notes"
          orientation="both"
          className="demo-scroll-both"
        >
          <div className="demo-scroll-notes">
            <h3>Release notes</h3>
            {Array.from({ length: 24 }, (_, index) => (
              <p key={index}>
                Entry {String(index + 1).padStart(2, "0")} — A shared visual
                language for independent applications.
              </p>
            ))}
          </div>
        </ScrollArea>
      </section>
      <section
        className="demo-scroll-group"
        aria-label="Horizontal scrolling example"
      >
        <h2>Horizontal</h2>
        <p className="demo-label">
          Use a trackpad, Shift + wheel, or the Left and Right arrow keys.
        </p>
        <ScrollArea
          label="Component collections"
          orientation="horizontal"
          type="always"
          className="demo-scroll-horizontal"
        >
          <div className="demo-scroll-cards">
            {[
              {
                title: "Inputs",
                description: "Fields, choices and validation.",
              },
              { title: "Actions", description: "Buttons, links and menus." },
              {
                title: "Feedback",
                description: "Notices, status and progress.",
              },
              {
                title: "Overlays",
                description: "Dialogs, drawers and popovers.",
              },
              {
                title: "Structure",
                description: "Groups, disclosure and scrolling.",
              },
            ].map(({ title, description }, index) => (
              <article className="demo-scroll-card" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </ScrollArea>
      </section>
    </>
  )
}
