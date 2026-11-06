import { Button, Tooltip } from "@yuzur1ha/ui"

export function TooltipDemo() {
  return (
    <div className="demo-tooltips">
      {(
        [
          { side: "top", label: "Top" },
          { side: "right", label: "Right" },
          { side: "bottom", label: "Bottom" },
          { side: "left", label: "Left" },
        ] as const
      ).map(({ side, label }) => (
        <Tooltip key={side} side={side} content="Visible only to you.">
          <Button appearance="secondary" size="small" data-tooltip-side={side}>
            {label}
          </Button>
        </Tooltip>
      ))}
    </div>
  )
}
