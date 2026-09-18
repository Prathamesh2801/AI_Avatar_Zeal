import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCcw, ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import PillButton from "../components/PillButton";
import { faceSwap } from "../api/faceswap";

export default function CameraPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const modelId = location.state?.modelId;
  const gender = location.state?.gender;

  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Navigating during render warns in React and can loop, so the guard is an
  // effect and render just bails out.
  useEffect(() => {
    if (!modelId) navigate("/", { replace: true });
  }, [modelId, navigate]);

  // Release the last blob when leaving the page.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!modelId) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setError(null);
    setImageFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const retakePhoto = () => {
    setError(null);
    setImageFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    // Without this, picking the *same* photo again won't fire onChange.
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmPhoto = async () => {
    setLoading(true);
    setError(null);

    const response = await faceSwap({ source: imageFile, id: modelId });

    setLoading(false);

    if (!response.ok) {
      // faceswap.js already words the connection failures (unreachable vs
      // CORS-blocked vs timeout), so prefer its message.
      setError(
        response.error ||
          `Generation failed (error ${response.status}). Please try again.`
      );
      return;
    }

    navigate("/result", {
      state: {
        modelId,
        gender,
        resultImage: response.resultImage,
        data: response.data,
      },
    });
  };

  return (
    <PageShell doodles={false} className="flex flex-col px-5 pt-24 min-[380px]:pt-28 sm:pt-32 lg:pt-36 pb-5 sm:pb-6">
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            aria-label="Back"
            className="shrink-0 w-10 h-10 rounded-full bg-white border-2 border-black/10 flex items-center justify-center active:bg-black/5 transition disabled:opacity-40"
          >
            <ArrowLeft className="w-5 h-5 text-brand-ink" />
          </button>
          <p className="text-brand-ink/60 font-semibold text-sm sm:text-base">
            {previewUrl ? "Looking good?" : "Take your photo"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-brand/10 flex items-center justify-center">
                <Camera
                  className="w-12 h-12 sm:w-16 sm:h-16 text-brand"
                  strokeWidth={1.75}
                />
              </div>
              <p className="text-center text-brand-ink/60 text-sm sm:text-base max-w-xs text-balance">
                Face the camera in good light for the best result
              </p>

              {/* capture="user" opens the front camera for a selfie. */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center"
            >
              {/* 2:3 preview box matching the printed output. */}
              <div className="relative mx-auto w-full aspect-[2/3] max-h-[38dvh] min-[380px]:max-h-[44dvh] sm:max-h-[46dvh] rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white">
                <img
                  src={previewUrl}
                  alt="Your photo"
                  className="absolute inset-0 w-full h-full object-contain"
                />

                {loading && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-10 h-10 border-4 border-brand/25 border-t-brand rounded-full"
                    />
                    <p className="text-brand-ink font-semibold text-sm">
                      Creating your avatar…
                    </p>
                    <p className="text-brand-ink/50 text-xs">
                      This can take up to a minute
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-brand/10 border border-brand/30">
                  <AlertCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <p className="text-brand-ink text-xs sm:text-sm">{error}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto pt-6 space-y-3">
        {!previewUrl ? (
          <PillButton
            variant="solid"
            onClick={() => fileInputRef.current?.click()}
            className="h-14 sm:h-16"
          >
            <Camera className="w-5 h-5" />
            Open Camera
          </PillButton>
        ) : (
          <>
            <PillButton
              variant="solid"
              onClick={confirmPhoto}
              disabled={loading}
              className="h-14 sm:h-16"
            >
              {loading ? "Working…" : "Next"}
            </PillButton>
            <PillButton
              variant="muted"
              onClick={retakePhoto}
              disabled={loading}
              className="h-12 text-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              Retake
            </PillButton>
          </>
        )}
      </div>
    </PageShell>
  );
}
