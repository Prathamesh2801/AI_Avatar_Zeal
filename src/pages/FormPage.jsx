import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import Bg from "../assets/img/ui/background.png";
import { useLocation, useNavigate } from "react-router-dom";
import { generateCertificate } from "../api/form";
import VedantaLogo from "../assets/img/ui/vedanta_logo.png";
import CarinLogo from "../assets/img/ui/carin_logo.png";

export default function FormPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const requestId = location.state?.requestId; // → unique_id
  const modelId = location.state?.modelId; // → template

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      email: "",
    });
  };

  const handleSubmit = async (e) => {
    console.log("Form Clicked");
    e.preventDefault();

    setIsSubmitting(true);

    const payload = {
      name: formData.fullName,
      email: formData.email,
      template: modelId, // 📌 mapping
      unique_id: requestId, // 📌 mapping
    };

    try {
      const res = await generateCertificate(payload);

      if (res.status === 200) {
        console.log("Certificate generated:", res.data);

        // Navigate to success screen with certificate data
        navigate("/success", {
          state: {
            certificateData: res.data,
          },
        });
      } else {
        console.error("Certificate generation failed:", res);
        setIsSubmitting(false);
        // Optionally show error message to user
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      setIsSubmitting(false);
      // Optionally show error message to user
    }
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center px-4 sm:px-8 py-8 sm:py-12 overflow-y-auto"
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

      <div className="relative z-10 flex items-center justify-center min-h-[80vh] mt-20 sm:mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 my-8 sm:my-0"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Tell Us About You
            </h1>
            <p className="text-gray-400">Enter your details to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Your Full Name"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="abc@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
