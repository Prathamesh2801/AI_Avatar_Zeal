import { motion } from "framer-motion";
import Logo from "../assets/img/brand/logo.png";

/**
 * The HDFC ERGO Insurance Quiz lockup.
 *
 * Two modes:
 * - `inline` (default on the landing screen): the logo sits in the normal flow
 *   so it can breathe roughly 16% down the page and run ~62% of the width, as
 *   in the source artwork, instead of being pinned to the very top.
 * - `pinned`: absolute at the top, for the deeper screens where the content
 *   (template grid, camera, result) needs the vertical room.
 *
 * Either way the top padding adds the iOS safe-area inset to a real gap so the
 * lockup clears the notch / Dynamic Island in a home-screen web app. It goes
 * inside calc() because a `py-*` utility would override a separate `pt-*`.
 */
export default function BrandHeader({
  animated = true,
  pinned = true,
  className = "",
}) {
  const Img = animated ? motion.img : "img";
  const motionProps = animated
    ? {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }
    : {};

  const sizing = pinned
    ? "h-11 min-[380px]:h-12 sm:h-16 lg:h-20 w-auto"
    : // Width-driven so it scales with the screen like the artwork does, which
      // runs it to ~72% and keeps the landing screen from feeling empty. The
      // cap only kicks in on tablets, where 72% would be oversized.
      "w-[78%] min-[380px]:w-[74%] sm:w-[58%] max-w-[520px] h-auto";

  return (
    <div
      style={
        pinned
          ? {
              paddingTop:
                "calc(env(safe-area-inset-top, 0px) + var(--hdr-gap))",
            }
          : undefined
      }
      className={
        pinned
          ? `absolute top-0 inset-x-0 z-20 flex justify-center px-4 pb-2 [--hdr-gap:0.875rem] sm:[--hdr-gap:1.5rem] pointer-events-none ${className}`
          : `relative z-20 flex justify-center px-4 pointer-events-none ${className}`
      }
    >
      <Img
        src={Logo}
        alt="HDFC ERGO Insurance Quiz Junior 2026"
        className={`object-contain select-none ${sizing}`}
        {...motionProps}
      />
    </div>
  );
}
