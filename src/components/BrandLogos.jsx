import { motion } from "framer-motion";
import VedantaLogo from "../assets/img/ui/vedanta_logo.png";
import CarinLogo from "../assets/img/ui/carin_logo.png";

/**
 * Vedanta (left) + Carin (right) brand bar, pinned to the top of the screen.
 * Every page shows the same pair, so the markup lives here only.
 */
export default function BrandLogos({ animated = true, className = "" }) {
  const base = "h-8 sm:h-12 lg:h-14 w-auto object-contain select-none";

  return (
    <div
      // Top padding combines the notch inset with a real gap, so the logos
      // never sit flush against the browser chrome. `py-*` would override a
      // separate `pt-*`, so the safe-area inset is added inside calc().
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + var(--logo-gap))",
      }}
      className={`absolute top-0 inset-x-0 z-20 flex justify-between items-center gap-4 px-4 sm:px-8 pb-3 sm:pb-5 [--logo-gap:1rem] sm:[--logo-gap:1.25rem] pointer-events-none ${className}`}
    >
      {animated ? (
        <>
          <motion.img
            src={VedantaLogo}
            alt="Vedanta"
            className={base}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <motion.img
            src={CarinLogo}
            alt="Cairn"
            className={base}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
        </>
      ) : (
        <>
          <img src={VedantaLogo} alt="Vedanta" className={base} />
          <img src={CarinLogo} alt="Cairn" className={base} />
        </>
      )}
    </div>
  );
}
