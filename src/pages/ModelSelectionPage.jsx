import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { getModelsByGender } from "../assets/data/models";
import PageShell from "../components/PageShell";
import PillButton from "../components/PillButton";

export default function ModelSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const gender = location.state?.gender;

  // Direct link / reload with no gender in history state: start over.
  useEffect(() => {
    if (!gender) navigate("/", { replace: true });
  }, [gender, navigate]);

  if (!gender) return null;

  const templates = getModelsByGender(gender);

  const goNext = () => {
    if (!selected) return;
    navigate("/camera", { state: { modelId: selected, gender } });
  };

  return (
    <PageShell doodles={false} className="flex flex-col px-5 pt-24 min-[380px]:pt-28 sm:pt-36 pb-5 sm:pb-6">
      <div className="relative z-10 w-full max-w-md sm:max-w-2xl mx-auto flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Back"
            className="shrink-0 w-10 h-10 rounded-full bg-white border-2 border-black/10 flex items-center justify-center active:bg-black/5 transition"
          >
            <ArrowLeft className="w-5 h-5 text-brand-ink" />
          </button>
          <p className="text-brand-ink/60 font-semibold text-sm sm:text-base">
            Pick your look
          </p>
        </div>

        {/* 2 up on phones, 4 across on tablets. */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {templates.map((model, i) => {
            const isSelected = selected === model.id;
            return (
              <motion.button
                key={model.id}
                type="button"
                onClick={() => setSelected(model.id)}
                aria-pressed={isSelected}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.35 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-2xl overflow-hidden bg-white transition-all duration-200
                  ${
                    isSelected
                      ? "ring-4 ring-brand shadow-lg shadow-brand/20"
                      : "ring-1 ring-black/10"
                  }`}
              >
                {/* 2:3 — the print ratio, so the card shows the framing the
                    printed photo will have. */}
                <div className="relative aspect-[2/3] bg-black/5">
                  <img
                    src={model.image}
                    alt={model.name}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-brand flex items-center justify-center shadow"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg mx-auto pt-6">
        <PillButton
          variant="solid"
          onClick={goNext}
          disabled={!selected}
          className="h-14 sm:h-16"
        >
          Next
        </PillButton>
      </div>
    </PageShell>
  );
}
