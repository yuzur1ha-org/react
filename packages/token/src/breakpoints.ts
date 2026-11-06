export const breakpoints = Object.freeze({ tablet: 640, desktop: 1024 })

export const mediaQueries = Object.freeze({
  phone: `(width < ${breakpoints.tablet}px)`,
  tabletUp: `(width >= ${breakpoints.tablet}px)`,
  tablet: `(${breakpoints.tablet}px <= width < ${breakpoints.desktop}px)`,
  desktop: `(width >= ${breakpoints.desktop}px)`,
  belowDesktop: `(width < ${breakpoints.desktop}px)`,
})
