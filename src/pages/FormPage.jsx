import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import Bg from "../assets/img/background.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { generateCertificate } from "../api/form";

export default function FormPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const requestId = location.state?.requestId; // → unique_id
  const modelId = location.state?.modelId; // → template

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

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
    console.log("Form Clicked")
    e.preventDefault();

    const payload = {
      name: formData.fullName,
      email: formData.email,
      template: modelId, // 🔁 mapping
      unique_id: requestId, // 🔁 mapping
    };

    const res = await generateCertificate(payload);

    if (res.status === 200) {
      console.log("Certificate generated:", res.data);

      // optional next step
      // navigate("/success", { state: { requestId } });
    } else {
      console.error("Certificate generation failed:", res);
    }
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8"
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
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-3 rounded-xl bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
