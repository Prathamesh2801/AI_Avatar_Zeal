import BrandLogos from "./BrandLogos";

/**
 * The frame every page shares: background image, dark overlay, faint grid,
 * and the brand logo bar.
 *
 * `min-h-dvh` rather than `min-h-screen`: on mobile browsers `100vh` counts the
 * area behind the collapsing URL bar, so a full-height screen ends up taller
 * than the viewport and the bottom of the page sits under the chrome. `dvh`
 * tracks the visible area instead.
 *
 * The background is a CSS class (see index.css) rather than an inline
 * `style={{ backgroundImage }}` so the browser decodes it once instead of once
 * per page.
 */
export default function PageShell({
  children,
  overlay = "bg-black/30",
  grid = "64px",
  animatedLogos = true,
  showLogos = true,
  className = "",
}) {
  return (
    <div className={`min-h-dvh relative app-bg ${className}`}>
      <div className={`absolute inset-0 ${overlay}`} />

      <div
        className="absolute inset-0 app-grid"
        style={{ backgroundSize: `${grid} ${grid}` }}
      />

      {showLogos && <BrandLogos animated={animatedLogos} />}

      {children}
    </div>
  );
}
