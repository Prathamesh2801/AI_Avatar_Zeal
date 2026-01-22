import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Bg from "../assets/img/ui/background.png";
import VedantaLogo from "../assets/img/ui/vedanta_logo.png";
import CarinLogo from "../assets/img/ui/carin_logo.png";

export default function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const certificateData = location.state?.certificateData;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 0.8, bounce: 0 },
        opacity: { duration: 0.2 },
        delay: 0.3,
      },
    },
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

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

      {/* Success Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                className="absolute inset-0 bg-green-500/30 rounded-full blur-xl"
              />

              {/* Main circle with checkmark */}
              <motion.div
                variants={circleVariants}
                initial="hidden"
                animate="visible"
                className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-8 shadow-2xl"
              >
                {/* Animated SVG checkmark */}
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M20 42L32 54L60 26"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={pathVariants}
                    initial="hidden"
                    animate="visible"
                  />
                </svg>
              </motion.div>

              {/* Particle effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 8) * 60,
                    y: Math.sin((i * Math.PI * 2) / 8) * 60,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Success Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Success!
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Certificate Generated Successfully
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to home in a moment...
            </p>
          </motion.div>

          {/* Optional: Display certificate info */}
          {certificateData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-8 inline-block bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl px-6 py-4"
            >
              <p className="text-sm text-gray-400 mb-1">Certificate saved</p>
              <p className="text-xs text-gray-500 break-all max-w-md">
                {certificateData.image_path}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
