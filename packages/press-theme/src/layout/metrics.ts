// Layout dimensions are in CSS pixels.
export const pressLayout = Object.freeze({
  sidebarWidth: 256,
  readingWidth: 800,
  outlineWidth: 160,
  readingGap: 40,
  brandInsetPhone: 20,
  brandInset: 32,
  // Reserve space for the brand without crowding controls at 320px.
  brandWidth: 180,
  headerExpanded: 96,
  headerCollapsed: 64,
  headerTravel: 160,
  subheader: 48,
} as const)
