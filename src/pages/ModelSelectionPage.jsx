import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { getModelsByGender } from "../assets/data/models";
import PageShell from "../components/PageShell";

export default function ModelSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState(null);

  const gender = location.state?.gender;

  // Direct link / reload with no gender in history state: start over.
  useEffect(() => {
    if (!gender) navigate("/", { replace: true });
  }, [gender, navigate]);

  if (!gender) return null;

  const templates = getModelsByGender(gender);

  const handleSelect = (model) => {
    if (selectedModel) return;
    setSelectedModel(model.id);
    setTimeout(
      () => navigate("/camera", { state: { modelId: model.id, gender } }),
      450
    );
  };

  return (
    <PageShell className="px-4 sm:px-6 pt-20 sm:pt-28 pb-10">
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 sm:mb-8"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-3 py-2 -ml-1 rounded-xl bg-white/5 border border-white/10 active:bg-white/15 transition"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-300">Back</span>
          </button>

          <div className="text-center mt-4 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="text-xs sm:text-sm font-semibold text-white capitalize">
                {gender} templates
              </span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight text-balance">
              Choose Your Look
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Tap a template to continue
            </p>
          </div>
        </motion.div>

        {/* Template grid — 2 up on phones, 4 across on tablets. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {templates.map((model, i) => {
            const isSelected = selectedModel === model.id;
            const dimmed = selectedModel && !isSelected;

            return (
              <motion.button
                key={model.id}
                type="button"
                onClick={() => handleSelect(model)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.4 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300
                  ${
                    isSelected
                      ? "border-white/70 ring-4 ring-white/40"
                      : "border-white/10"
                  }
                  ${dimmed ? "opacity-40" : ""}`}
              >
                {/* 2:3 — the print ratio. The card shows the same framing the
                    printed photo will have, so nothing surprises the user. */}
                <div className="relative aspect-[2/3] bg-black/40">
                  <img
                    src={model.image}
                    alt={model.name}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </motion.div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                    <p className="text-white font-semibold text-sm sm:text-base leading-tight">
                      {model.name}
                    </p>
                    <p className="text-gray-400 text-[11px] sm:text-xs mt-0.5">
                      #{model.id}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
