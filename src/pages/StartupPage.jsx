import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import MaleIcon from "../assets/img/male.json";
import FemaleIcon from "../assets/img/woman.json";
import Bg from "../assets/img/ui/background.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VedantaLogo from "../assets/img/ui/vedanta_logo.png";
import CarinLogo from "../assets/img/ui/carin_logo.png";

export default function StartupPage() {
  const [hoveredOption, setHoveredOption] = useState(null);
  const [activeGender, setActiveGender] = useState(null);
  const navigate = useNavigate();

  const handleSelection = (gender) => {
    if (activeGender) return; // prevent double click

    setActiveGender(gender);

    toast.success(`${gender === "male" ? "Male" : "Female"} profile selected`, {
      duration: 1000,
    });

    setTimeout(() => {
      navigate("/model", {
        state: { gender },
      });
    }, 900);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-600/10 via-transparent to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Logos */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
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

      <motion.div
        className="relative z-10 w-full max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 sm:mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300 font-medium">
              AI-Powered Avatar Selection
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white mb-6 tracking-tight">
            Choose Your Identity
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Select your avatar profile to begin your personalized AI experience
          </p>
        </motion.div>

        {/* Selection Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto"
        >
          {/* Male Option */}
          <motion.button
            onClick={() => handleSelection("male")}
            onHoverStart={() => setHoveredOption("male")}
            onHoverEnd={() => setHoveredOption(null)}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/50 to-cyan-950/30 border border-blue-500/20 transition-all duration-500 p-8 sm:p-10 lg:p-14 backdrop-blur-xl
  ${
    activeGender === "male"
      ? "ring-4 ring-blue-400 shadow-2xl shadow-blue-500/40 scale-105"
      : activeGender
        ? "opacity-40 pointer-events-none"
        : "hover:scale-105 hover:border-blue-400/50"
  }
`}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/20 group-hover:to-cyan-500/10"
              initial={false}
              animate={{
                opacity: hoveredOption === "male" ? 1 : 0,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl"
              initial={false}
              animate={{
                opacity: hoveredOption === "male" ? 0.3 : 0,
              }}
              transition={{ duration: 0.5 }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Container with particles */}
              <motion.div
                className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mb-8"
                animate={{
                  y: hoveredOption === "male" ? [-5, 5, -5] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: hoveredOption === "male" ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                  animate={{
                    scale: hoveredOption === "male" ? [1, 1.1, 1] : 1,
                    rotate: hoveredOption === "male" ? 360 : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: hoveredOption === "male" ? Infinity : 0,
                    ease: "linear",
                  }}
                />

                {/* Middle ring */}
                <motion.div
                  className="absolute inset-4 rounded-full border border-cyan-500/20"
                  animate={{
                    scale: hoveredOption === "male" ? [1, 1.15, 1] : 1,
                    rotate: hoveredOption === "male" ? -360 : 0,
                  }}
                  transition={{
                    duration: 4,
                    repeat: hoveredOption === "male" ? Infinity : 0,
                    ease: "linear",
                  }}
                />

                {/* Icon background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm">
                    <Player
                      autoplay
                      loop
                      src={MaleIcon}
                      className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Label */}
              <div className="text-center space-y-3">
                <h2 className="text-4xl sm:text-5xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                  Male
                </h2>
                <p className="text-gray-400 text-base sm:text-lg group-hover:text-gray-300 transition-colors duration-300">
                  Professional AI Avatar
                </p>
              </div>

              {/* Arrow indicator with animation */}
              <motion.div
                className="mt-8 flex items-center gap-2 text-blue-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: hoveredOption === "male" ? 1 : 0,
                  x: hoveredOption === "male" ? 0 : -10,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-medium">Select Profile</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.button>

          {/* Female Option */}
          <motion.button
            onClick={() => handleSelection("female")}
            onHoverStart={() => setHoveredOption("female")}
            onHoverEnd={() => setHoveredOption(null)}
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-950/50 to-purple-950/30 border border-pink-500/20 transition-all duration-500 p-8 sm:p-10 lg:p-14 backdrop-blur-xl
  ${
    activeGender === "female"
      ? "ring-4 ring-pink-400 shadow-2xl shadow-pink-500/40 scale-105"
      : activeGender
        ? "opacity-40 pointer-events-none"
        : "hover:scale-105 hover:border-pink-400/50"
  }
`}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/20 group-hover:to-purple-500/10"
              initial={false}
              animate={{
                opacity: hoveredOption === "female" ? 1 : 0,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl"
              initial={false}
              animate={{
                opacity: hoveredOption === "female" ? 0.3 : 0,
              }}
              transition={{ duration: 0.5 }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Icon Container with particles */}
              <motion.div
                className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mb-8"
                animate={{
                  y: hoveredOption === "female" ? [-5, 5, -5] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: hoveredOption === "female" ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-pink-500/30"
                  animate={{
                    scale: hoveredOption === "female" ? [1, 1.1, 1] : 1,
                    rotate: hoveredOption === "female" ? 360 : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: hoveredOption === "female" ? Infinity : 0,
                    ease: "linear",
                  }}
                />

                {/* Middle ring */}
                <motion.div
                  className="absolute inset-4 rounded-full border border-purple-500/20"
                  animate={{
                    scale: hoveredOption === "female" ? [1, 1.15, 1] : 1,
                    rotate: hoveredOption === "female" ? -360 : 0,
                  }}
                  transition={{
                    duration: 4,
                    repeat: hoveredOption === "female" ? Infinity : 0,
                    ease: "linear",
                  }}
                />

                {/* Icon background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                    <Player
                      autoplay
                      loop
                      src={FemaleIcon}
                      className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Label */}
              <div className="text-center space-y-3">
                <h2 className="text-4xl sm:text-5xl font-bold text-white group-hover:text-pink-300 transition-colors duration-300">
                  Female
                </h2>
                <p className="text-gray-400 text-base sm:text-lg group-hover:text-gray-300 transition-colors duration-300">
                  Professional AI Avatar
                </p>
              </div>

              {/* Arrow indicator with animation */}
              <motion.div
                className="mt-8 flex items-center gap-2 text-pink-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: hoveredOption === "female" ? 1 : 0,
                  x: hoveredOption === "female" ? 0 : -10,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-medium">Select Profile</span>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16 sm:mt-20"
        >
          <p className="text-gray-500 text-sm sm:text-base">
            Your selection will personalize your AI experience
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
