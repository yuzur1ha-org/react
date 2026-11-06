export function linkRel(target?: string, rel?: string) {
  return target === "_blank"
    ? Array.from(
        new Set([
          ...(rel?.split(/\s+/).filter(Boolean) ?? []),
          "noopener",
          "noreferrer",
        ]),
      ).join(" ")
    : rel
}
