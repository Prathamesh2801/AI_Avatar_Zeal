import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import PageShell from "../components/PageShell";
import BrandHeader from "../components/BrandHeader";
import PillButton from "../components/PillButton";

const OPTIONS = [
  { gender: "male", label: "Male" },
  { gender: "female", label: "Female" },
];

export default function StartupPage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const goNext = () => {
    if (!selected) return;
    navigate("/model", { state: { gender: selected } });
  };

  return (
    <PageShell pinnedHeader={false} className="flex flex-col px-6 pb-8">
      {/* Vertical rhythm follows the artwork, which distributes the content
          rather than pinning it: ~16% of empty space, then the logo at ~62%
          width, the two choices, and NEXT near the foot. The flex spacers
          below hold those proportions at any screen height. */}
      <div className="shrink-0 pt-[11dvh] sm:pt-[13dvh]" />

      <BrandHeader animated pinned={false} />

      <div className="shrink-0 h-[15dvh] sm:h-[13dvh]" />

      <div className="relative z-10 w-full max-w-[17rem] sm:max-w-xs mx-auto flex flex-col">
        <div className="space-y-6 sm:space-y-8">
          {OPTIONS.map((opt, i) => {
            const isSelected = selected === opt.gender;
            return (
              <motion.div
                key={opt.gender}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              >
                <PillButton
                  variant={isSelected ? "solid" : "ghost"}
                  onClick={() => setSelected(opt.gender)}
                  aria-pressed={isSelected}
                  className="h-14 sm:h-16 text-lg sm:text-xl"
                >
                  {opt.label}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-5 inline-flex"
                    >
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </motion.span>
                  )}
                </PillButton>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Spacer: absorbs the gap between the choices and NEXT. */}
      <div className="flex-1 min-h-6" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 w-full max-w-[17rem] sm:max-w-xs mx-auto shrink-0 pb-[14dvh] sm:pb-[15dvh]"
      >
        <PillButton
          variant="solid"
          onClick={goNext}
          disabled={!selected}
          className="h-14 sm:h-16 text-base sm:text-lg"
        >
          Next
        </PillButton>
      </motion.div>
    </PageShell>
  );
}
