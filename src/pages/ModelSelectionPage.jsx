import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { models } from "../assets/data/models";
import Bg from "../assets/img/ui/background.png";
import { ArrowLeft, Sparkles, CheckCircle2, User, UserCircle } from "lucide-react";
import { useState } from "react";
import VedantaLogo from "../assets/img/ui/vedanta_logo.png";
import CarinLogo from "../assets/img/ui/carin_logo.png";

export default function ModelSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState(null);

  const gender = location.state?.gender;

  const filteredModels = models.filter((model) => model.category === gender);

  const handleModelSelect = (model) => {
    setSelectedModel(model.id);
    
    // Navigate after a short delay for visual feedback
    setTimeout(() => {
      navigate("/camera", { state: { modelId: model.id, gender } });
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center px-4 sm:px-8 py-8 sm:py-12"
      style={{ backgroundImage: `url(${Bg})` }}
    >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Logos */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6">
        <motion.img
          src={VedantaLogo}
          alt="Vedanta Logo"
          className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
        <motion.img
          src={CarinLogo}
          alt="Carin Logo"
          className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mt-20 sm:mt-24 lg:mt-28">
        {/* Enhanced Header */}
        <div className="mb-12 sm:mb-16 space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Back button - Left aligned */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors group-hover:-translate-x-1 transform duration-300" />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Back to Selection
              </span>
            </button>
          </motion.div>

          {/* Centered title block with icon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-6"
          >
            {/* Gender badge with icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-md"
            >
              {gender === "male" ? (
                <UserCircle className="w-5 h-5 text-blue-400" />
              ) : (
                <User className="w-5 h-5 text-pink-400" />
              )}
              <span className="text-sm font-semibold text-white capitalize">
                {gender} Models
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>

            {/* Main title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-white leading-tight tracking-tight">
              Choose Your Model
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Select your preferred AI avatar to begin your personalized experience
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

        {/* Models Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          {filteredModels.map((model) => (
            <motion.div
              key={model.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModelSelect(model)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                selectedModel === model.id
                  ? "ring-4 ring-offset-2 ring-offset-black/50 ring-white/60 shadow-2xl shadow-white/20"
                  : "hover:shadow-2xl hover:shadow-white/10"
              }`}
            >
              {/* Image container */}
              <div className="relative  overflow-hidden bg-black/40">
                <img
                  src={model.image}
                  alt={model.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    selectedModel === model.id
                      ? "scale-110 brightness-110"
                      : "group-hover:scale-110 group-hover:brightness-110"
                  }`}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

                {/* Selection indicator */}
                <AnimatePresence>
                  {selectedModel === model.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute top-4 right-4 bg-white rounded-full p-1.5 shadow-xl"
                    >
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hover glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    gender === "male"
                      ? "from-blue-500/20 to-transparent"
                      : "from-pink-500/20 to-transparent"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Active selection glow */}
                {selectedModel === model.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute inset-0 bg-gradient-to-t ${
                      gender === "male"
                        ? "from-blue-400/30 to-transparent"
                        : "from-pink-400/30 to-transparent"
                    }`}
                  />
                )}
              </div>

              {/* Card content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <motion.div
                  className="space-y-2"
                  animate={{
                    y: selectedModel === model.id ? -4 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* <h3 className="text-white font-bold text-xl sm:text-2xl tracking-tight">
                    {model.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {gender === "male" ? (
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-pink-400" />
                    )}
                    <p className="text-gray-300 text-sm capitalize font-medium">
                      {model.category} Model
                    </p>
                  </div> */}
                </motion.div>

                {/* Select indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm ${
                    selectedModel === model.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  } transition-opacity duration-300`}
                >
                  <span className="text-white text-sm font-medium">
                    {selectedModel === model.id ? "Selected" : "Select Model"}
                  </span>
                  {selectedModel !== model.id && (
                    <ArrowLeft className="w-4 h-4 text-white rotate-180" />
                  )}
                </motion.div>
              </div>

              {/* Border glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl border-2 ${
                  selectedModel === model.id
                    ? gender === "male"
                      ? "border-blue-400/50"
                      : "border-pink-400/50"
                    : "border-transparent group-hover:border-white/20"
                } transition-colors duration-500 pointer-events-none`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom hint */}
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Navigating to camera...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}