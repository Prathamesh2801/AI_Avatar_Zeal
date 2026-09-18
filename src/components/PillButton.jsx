import { motion } from "framer-motion";

/**
 * The brand's pill button. The artwork uses a solid red fill with white
 * uppercase text; `ghost` is the outlined counterpart for secondary actions.
 *
 * min-h-14 keeps every pill at or above the ~44px touch target both platforms
 * recommend, even when the label wraps.
 */
export default function PillButton({
  children,
  variant = "solid",
  className = "",
  as: Comp = motion.button,
  ...props
}) {
  const base =
    "relative inline-flex items-center justify-center gap-2 w-full min-h-14 px-6 rounded-full font-extrabold uppercase tracking-wide text-base sm:text-lg transition-colors disabled:opacity-60 disabled:pointer-events-none";

  const variants = {
    solid:
      "bg-brand text-white shadow-lg shadow-brand/25 active:bg-brand-dark",
    ghost:
      "bg-white text-brand border-2 border-brand active:bg-brand/10",
    muted:
      "bg-white text-brand-ink border-2 border-black/10 active:bg-black/5",
  };

  return (
    <Comp
      type="button"
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
