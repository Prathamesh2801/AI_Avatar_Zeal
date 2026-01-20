import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RefreshCcw,
  Check,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Bg from "../assets/img/background.jpg";

export default function CameraPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const modelId = location.state?.modelId;
  const gender = location.state?.gender;

  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Safety: direct access guard
  if (!modelId) {
    navigate("/");
    return null;
  }

  // Open native camera
  const openCamera = () => {
    fileInputRef.current.click();
  };

  // Handle native camera result
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const retakePhoto = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const confirmPhoto = async () => {
    setLoading(true);

    const requestId = `REQ_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;

    const formData = new FormData();
    formData.append("modelId", modelId);
    formData.append("image", imageFile);
    formData.append("requestId", requestId);

    // 🔥 API call placeholder
    /*
    await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });
    */

    console.log("Ready to send:", {
      modelId,
      imageFile,
      requestId,
    });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);

    navigate("/form", { state: { requestId, modelId } });
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center px-4 sm:px-8 py-8 sm:py-12"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* Enhanced Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-[2px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-12 sm:mb-16">
          {/* Back button - Left aligned */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors group-hover:-translate-x-1 transform duration-300" />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Back to Models
              </span>
            </button>
          </motion.div>

          {/* Centered title block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-6"
          >
            {/* Badge with icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md"
            >
              <Camera className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-white">
                Photo Capture
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>

            {/* Main title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-white leading-tight tracking-tight">
              Capture Your Photo
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Take a clear photo for the best AI avatar generation results
            </p>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </motion.div>
        </div>

        {/* Camera Card - Centered */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-full max-w-lg"
          >
            {/* Main Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />

              <div className="relative z-10">
                {/* Content */}
                <AnimatePresence mode="wait">
                  {!previewUrl ? (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-8"
                    >
                      {/* Camera Icon Container */}
                      <motion.div
                        className="relative w-40 h-40 sm:w-48 sm:h-48"
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {/* Outer ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: 360,
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        {/* Inner circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm">
                            <Camera
                              className="w-14 h-14 sm:w-16 sm:h-16 text-white"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Instructions */}
                      <div className="text-center space-y-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                          Ready to Capture
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                          Click below to use your device camera
                        </p>
                      </div>

                      {/* Open Camera Button */}
                      <motion.button
                        onClick={openCamera}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-3"
                      >
                        <Camera className="w-6 h-6" />
                        Open Camera
                      </motion.button>

                      {/* Tips */}
                      <div className="w-full pt-4 border-t border-white/10">
                        <p className="text-gray-500 text-xs sm:text-sm text-center">
                          💡 Tip: Ensure good lighting for best results
                        </p>
                      </div>

                      {/* Native camera input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-6"
                    >
                      {/* Preview Header */}
                      <div className="text-center space-y-2 mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                          <ImageIcon className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-300">
                            Photo Captured
                          </span>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
                      >
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />

                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </motion.div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <motion.button
                          onClick={retakePhoto}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                        >
                          <RefreshCcw className="w-5 h-5" />
                          Retake
                        </motion.button>

                        <motion.button
                          onClick={confirmPhoto}
                          disabled={loading}
                          whileHover={{ scale: loading ? 1 : 1.02 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-500/30"
                        >
                          {loading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <RefreshCcw className="w-5 h-5" />
                              </motion.div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5" />
                              Confirm & Generate
                            </>
                          )}
                        </motion.button>
                      </div>

                      {/* Info text */}
                      <div className="text-center pt-2">
                        <p className="text-gray-500 text-xs sm:text-sm">
                          {loading
                            ? "Creating your AI avatar..."
                            : "Ready to generate your AI avatar"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
