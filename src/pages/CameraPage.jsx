import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCcw, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { getModelById } from "../assets/data/models";
import { faceSwap } from "../api/faceswap";

export default function CameraPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const modelId = location.state?.modelId;
  const gender = location.state?.gender;
  const model = getModelById(modelId);

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
      setError(
        response.status === 0
          ? "Could not reach the server. Check the connection and try again."
          : response.error ||
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
    <PageShell className="px-4 sm:px-6 pt-20 sm:pt-28 pb-10">
      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 -ml-1 rounded-xl bg-white/5 border border-white/10 active:bg-white/15 transition disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-300">Back</span>
          </button>

          <div className="text-center mt-6 space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Take Your Photo
            </h1>
            <p className="text-gray-400 text-sm sm:text-base text-balance">
              Face the camera in good light for the best result
            </p>
            {model && (
              <p className="text-gray-500 text-xs">
                Template: {model.name} · #{model.id}
              </p>
            )}
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl p-4 sm:p-6"
        >
          <AnimatePresence mode="wait">
            {!previewUrl ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 py-4"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                  <Camera
                    className="w-12 h-12 sm:w-16 sm:h-16 text-white"
                    strokeWidth={1.5}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 active:from-red-700 active:to-red-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Open Camera
                </button>

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
                className="space-y-4"
              >
                {/* 2:3 preview box matching the printed output. */}
                <div className="relative mx-auto aspect-[2/3] max-h-[46dvh] rounded-2xl overflow-hidden border border-white/20 bg-black/40">
                  <img
                    src={previewUrl}
                    alt="Your photo"
                    className="absolute inset-0 w-full h-full object-contain"
                  />

                  {loading && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full"
                      />
                      <p className="text-white font-medium text-sm">
                        Generating your avatar…
                      </p>
                      <p className="text-gray-400 text-xs">
                        This can take up to a minute
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-200 text-xs sm:text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={retakePhoto}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold flex items-center justify-center gap-2 active:bg-white/20 transition disabled:opacity-40"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Retake
                  </button>

                  <button
                    type="button"
                    onClick={confirmPhoto}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 active:from-green-700 disabled:opacity-60"
                  >
                    <Check className="w-4 h-4" />
                    {loading ? "Working…" : "Generate"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageShell>
  );
}
