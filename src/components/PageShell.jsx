import BrandHeader from "./BrandHeader";
import DoodleField from "./DoodleField";

/**
 * The frame every page shares: light brand background, decorative doodles and
 * the logo lockup.
 *
 * `min-h-dvh` rather than `min-h-screen`: on mobile browsers `100vh` counts the
 * area behind the collapsing URL bar, so a full-height screen ends up taller
 * than the viewport and the bottom sits under the chrome. `dvh` tracks the
 * visible area instead.
 *
 * Safe-area insets are applied as *margins* on an inner wrapper rather than as
 * inline padding on this element: inline padding would silently beat the
 * `px-*`/`pb-*` utilities a page passes in `className`, leaving content flush
 * against the screen edge. The background still paints edge to edge behind the
 * notch and home indicator. The top inset belongs to BrandHeader, which owns
 * the top of the page.
 */
export default function PageShell({
  children,
  doodles = true,
  showHeader = true,
  animatedHeader = true,
  pinnedHeader = true,
  className = "",
}) {
  return (
    <div className="min-h-dvh relative app-bg overflow-hidden flex flex-col">
      {doodles && <DoodleField />}

      {showHeader && pinnedHeader && <BrandHeader animated={animatedHeader} />}

      <div
        style={{
          marginLeft: "env(safe-area-inset-left, 0px)",
          marginRight: "env(safe-area-inset-right, 0px)",
          marginBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        className={`relative flex-1 min-h-0 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
