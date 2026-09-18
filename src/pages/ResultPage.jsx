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
import PillButton from "../components/PillButton";
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
    <PageShell doodles={false} className="flex flex-col px-5 pt-24 min-[380px]:pt-28 sm:pt-36 pb-5 sm:pb-6">
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-brand-ink/60 font-semibold text-sm sm:text-base mb-4"
        >
          {showImage ? "Here's your avatar" : "Generation complete"}
        </motion.p>

        {showImage ? (
          // This is what gets printed, so it is shown at the print ratio (2:3)
          // and never cropped.
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative mx-auto w-full aspect-[2/3] max-h-[40dvh] min-[380px]:max-h-[46dvh] sm:max-h-[52dvh] rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-lg bg-white"
          >
            <img
              src={resultImage}
              alt="Your generated avatar"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertCircle className="w-10 h-10 text-brand" />
            <p className="text-brand-ink font-semibold">
              Your avatar was generated
            </p>
            <p className="text-brand-ink/60 text-xs sm:text-sm text-balance">
              {resultImage
                ? "The image could not be loaded on this device."
                : "The server did not return an image."}
            </p>
            {modelId && (
              <p className="text-brand-ink/40 text-[11px]">
                Template #{modelId}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto pt-6 space-y-3">
        {showImage && canDownload && (
          <PillButton
            variant={saveState === "error" ? "ghost" : "solid"}
            onClick={handleDownload}
            disabled={saveState === "saving"}
            className="h-14 sm:h-16"
          >
            {saveState === "saving" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saveState === "done" ? (
              <Check className="w-5 h-5" strokeWidth={3} />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {saveLabel}
          </PillButton>
        )}

        <div className="flex gap-3">
          <PillButton
            variant="muted"
            onClick={goBack}
            className="h-12 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </PillButton>
          <PillButton
            variant="muted"
            onClick={goHome}
            className="h-12 text-sm"
          >
            <Home className="w-4 h-4" />
            Home
          </PillButton>
        </div>
      </div>
    </PageShell>
  );
}
