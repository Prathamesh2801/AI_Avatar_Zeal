import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Home,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { useAppFlags } from "../hooks/useAppFlags";
import { saveImage, isIOS } from "../utils/saveImage";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { canDownload } = useAppFlags();

  const { resultImage, modelId, gender } = location.state ?? {};
  const [imageFailed, setImageFailed] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle|saving|done|error

  useEffect(() => {
    if (!location.state) navigate("/", { replace: true });
  }, [location.state, navigate]);

  if (!location.state) return null;

  // Back returns to the template list for the same gender, so "try a different
  // look" doesn't mean starting from the gender choice again.
  const goBack = () => navigate("/model", { replace: true, state: { gender } });
  const goHome = () => navigate("/", { replace: true });

  const handleDownload = async () => {
    setSaveState("saving");
    try {
      const how = await saveImage(resultImage);
      setSaveState("done");
      // "opened" means it went to a new tab and the user still has to act, so
      // leave the hint up longer than a silent save.
      setTimeout(() => setSaveState("idle"), how === "saved" ? 2500 : 5000);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 4000);
    }
  };

  const showImage = resultImage && !imageFailed;

  const saveLabel = {
    idle: "Download",
    saving: "Saving…",
    done: isIOS() ? "Save to Photos" : "Saved",
    error: "Try again",
  }[saveState];

  return (
    <PageShell className="px-4 sm:px-6 pt-16 sm:pt-28 pb-6 sm:pb-10">
      <div className="relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-3 sm:mb-6 space-y-1 sm:space-y-2"
        >
          <h1 className="text-xl sm:text-4xl font-bold text-white tracking-tight">
            Your AI Avatar
          </h1>
          <p className="hidden sm:block text-gray-400 text-sm sm:text-base">
            {showImage ? "Here's how you turned out" : "Generation complete"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl p-3 sm:p-6 space-y-3 sm:space-y-4"
        >
          {showImage ? (
            // This is what gets printed, so it is shown at the print ratio
            // (2:3) and never cropped.
            <div className="relative mx-auto aspect-[2/3] max-h-[46dvh] sm:max-h-[52dvh] rounded-2xl overflow-hidden border border-white/20 bg-black/40">
              <img
                src={resultImage}
                alt="Your generated avatar"
                onError={() => setImageFailed(true)}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <AlertCircle className="w-10 h-10 text-yellow-400" />
              <p className="text-white font-medium">Your avatar was generated</p>
              <p className="text-gray-400 text-xs sm:text-sm text-balance">
                {resultImage
                  ? "The image could not be loaded on this device."
                  : "The server did not return an image."}
              </p>
              {modelId && (
                <p className="text-gray-600 text-[11px]">Template #{modelId}</p>
              )}
            </div>
          )}

          {showImage && canDownload && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={saveState === "saving"}
              className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition
                ${
                  saveState === "error"
                    ? "bg-red-900/70 border border-red-500/40 text-red-100"
                    : "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-600/30 active:from-red-700"
                } disabled:opacity-70`}
            >
              {saveState === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveState === "done" ? (
                <Check className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {saveLabel}
            </button>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex-1 py-3 sm:py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold flex items-center justify-center gap-2 active:bg-white/20 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={goHome}
              className="flex-1 py-3 sm:py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold flex items-center justify-center gap-2 active:bg-white/15 transition"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
