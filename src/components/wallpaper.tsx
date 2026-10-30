/**
 * Fixed full-page wallpaper: damask pattern, faint grid and a vignette.
 * Pure decoration, sits behind all content.
 */
export function Wallpaper() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
      <div className="wallpaper-damask absolute inset-0" />
      <div className="wallpaper-grid absolute inset-0" />
      <div className="wallpaper-vignette absolute inset-0" />
    </div>
  )
}
