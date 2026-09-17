import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MaleIcon from "../assets/img/male.json";
import FemaleIcon from "../assets/img/woman.json";
import PageShell from "../components/PageShell";
import GenderIcon from "../components/GenderIcon";

const OPTIONS = [
  {
    gender: "male",
    label: "Male",
    icon: MaleIcon,
    card: "from-red-950/50 to-orange-950/30 border-red-500/25",
    ring: "ring-red-400 shadow-red-500/40",
    halo: "from-red-500/20 to-orange-500/20",
    accent: "text-red-300",
  },
  {
    gender: "female",
    label: "Female",
    icon: FemaleIcon,
    card: "from-slate-900/60 to-red-950/30 border-white/20",
    ring: "ring-white/70 shadow-white/30",
    halo: "from-white/15 to-red-500/20",
    accent: "text-red-200",
  },
];

export default function StartupPage() {
  const [activeGender, setActiveGender] = useState(null);
  const navigate = useNavigate();

  const handleSelection = (gender) => {
    if (activeGender) return; // ignore double taps
    setActiveGender(gender);
    setTimeout(() => navigate("/model", { state: { gender } }), 450);
  };

  return (
    <PageShell
      grid="72px"
      className="flex flex-col px-4 pt-24 pb-5 sm:px-6 sm:py-28 sm:justify-center"
    >
      {/* `flex-1` + `min-h-0` lets the card grid absorb the leftover height on
          a phone instead of leaving dead space above and below it. */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto flex-1 min-h-0 flex flex-col sm:block sm:flex-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5 sm:mb-12 shrink-0"
        >
          {/* The badge is decoration; on a short phone the cards need that
              room more than it does. */}
          <div className="hidden min-[380px]:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs sm:text-sm text-gray-300 font-medium">
              AI-Powered Avatar
            </span>
          </div>

          <h1 className="text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 tracking-tight text-balance">
            Choose Your Identity
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto text-balance">
            Select a profile to begin
          </p>
        </motion.div>

        {/* Stacked on phones, side by side from `sm`: full-width cards use the
            vertical space a phone has instead of leaving wide empty margins
            beside two narrow ones. The row cap keeps them a sensible band
            rather than stretching into huge empty panels on a tall phone. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 flex-1 min-h-0 sm:flex-none content-center auto-rows-[minmax(0,11rem)] sm:auto-rows-auto">
          {OPTIONS.map((opt, i) => {
            const isActive = activeGender === opt.gender;
            const dimmed = activeGender && !isActive;

            return (
              <motion.button
                key={opt.gender}
                type="button"
                onClick={() => handleSelection(opt.gender)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl
                  bg-gradient-to-br ${opt.card} border backdrop-blur-xl
                  p-4 sm:p-8 lg:p-12 transition-all duration-300
                  ${isActive ? `ring-4 ${opt.ring} shadow-2xl` : ""}
                  ${dimmed ? "opacity-40 pointer-events-none" : ""}`}
              >
                {/* Row on phones (icon beside the label, using the full card
                    width), column once the cards sit side by side. */}
                <div className="relative z-10 h-full flex flex-row sm:flex-col items-center justify-center gap-5 sm:gap-0 text-left sm:text-center">
                  <div
                    // Scales with the card height on phones (where the card
                    // stretches), fixed size once the cards sit side by side.
                    className={`shrink-0 aspect-square h-[62%] max-h-28
                      sm:h-36 sm:max-h-36 lg:h-44 lg:max-h-44 sm:mb-6
                      rounded-full bg-gradient-to-br ${opt.halo}
                      flex items-center justify-center overflow-hidden backdrop-blur-sm`}
                  >
                    <GenderIcon src={opt.icon} />
                  </div>

                  <div className="flex-1 sm:flex-none">
                    <h2
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-white transition-colors ${
                        isActive ? opt.accent : ""
                      }`}
                    >
                      {opt.label}
                    </h2>

                    <span
                      className={`mt-1 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium ${opt.accent} transition-opacity duration-300 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
                      }`}
                    >
                      {isActive ? "Selected" : "Select"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </PageShell>
  );
}
