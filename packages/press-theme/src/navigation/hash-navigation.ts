export function focusHashTarget(
  target: HTMLElement,
  behavior?: ScrollBehavior,
) {
  if (!target.hasAttribute("tabindex")) {
    target.tabIndex = -1
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
      once: true,
    })
  }
  target.focus({ preventScroll: true })
  target.scrollIntoView({
    behavior:
      behavior ??
      (matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth"),
    block: "start",
  })
}
export function navigateHash(hash: string, behavior?: ScrollBehavior) {
  try {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) focusHashTarget(target, behavior)
  } catch {
    // Invalid fragments leave normal navigation intact.
  }
}
