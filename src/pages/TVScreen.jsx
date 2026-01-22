import { QRCode } from "react-qr-code";
import { useEffect, useRef, useState } from "react";
import { createTVEventConnection } from "../api/fetchVideoConnect";
import Bg from "../assets/img/ui/background.png";
import CarinLogo from "../assets/img/ui/carin_logo.png";
import VedantaLogo from "../assets/img/ui/vedanta_logo.png";
import { BASE_URL } from "../../config";

const TVScreen = ({ welcomeText = "Welcome to Vedanta" }) => {
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [mediaUnlocked, setMediaUnlocked] = useState(false);

  const [mode, setMode] = useState("start"); // start | video | image
  const [videoUrl, setVideoUrl] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);

  const videoRef = useRef(null);
  const connectedRef = useRef(false);

  /* ===== USER GESTURE (AUDIO UNLOCK) ===== */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") {
        setMediaUnlocked(true);
        window.removeEventListener("keydown", handler);
      }
    };
    if (!mediaUnlocked) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mediaUnlocked]);

  /* ===== VIDEO END ===== */
  const handleVideoEnded = () => {
    setMode("image");
  };

  /* ===== SSE CONNECTION ===== */
  useEffect(() => {
    if (connectedRef.current) return;
    connectedRef.current = true;

    const sse = createTVEventConnection({
      url: `${BASE_URL}/tv.php`,
      debug: true,
      onStatus: setConnectionStatus,

      onPlay: (data) => {
        setVideoUrl(data?.Play);
        setCertificateImage(data?.Cerificate_Image);
        setMode("video");
      },
    });

    sse.connect();
    return () => {};
  }, []);

  const handleDone = () => {
    setVideoUrl(null);
    setCertificateImage(null);
    setMode("start");
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* ===== MEDIA UNLOCK SCREEN ===== */}
      {!mediaUnlocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-white text-3xl mb-4">Press Enter to Start</p>
            <p className="text-gray-400">Audio will be enabled</p>
          </div>
        </div>
      )}

      {/* ===== START SCREEN ===== */}
      {mode === "start" && (
        <div
          className="absolute inset-0 bg-cover bg-center flex flex-col"
          style={{ backgroundImage: `url(${Bg})` }}
        >
          {/* Logos */}
          <div className="flex justify-between p-6">
            <img src={VedantaLogo} alt="Vedanta Logo" className="h-16" />
            <img src={CarinLogo} alt="Carin Logo" className="h-16" />
          </div>

          {/* Center Text */}
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-white text-6xl font-bold text-center">
              {welcomeText}
            </h1>
          </div>
        </div>
      )}

      {/* ===== VIDEO PLAY ===== */}
      {mode === "video" && mediaUnlocked && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* ===== CERTIFICATE + QR ===== */}
      {mode === "image" && certificateImage && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-8 px-6">
          {/* Certificate Preview */}
          <img
            src={certificateImage}
            alt="Certificate"
            className="max-h-[50vh] object-contain rounded-xl shadow-2xl"
          />

          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl">
            <QRCode value={certificateImage} size={220} />
          </div>

          <p className="text-gray-300 text-xl text-center">
            Scan the QR code to download your certificate
          </p>

          {/* Done Button */}
          <button
            onClick={handleDone}
            className="mt-4 px-10 py-4 text-xl font-semibold rounded-xl
                 bg-white text-black hover:bg-gray-200 transition"
          >
            Done
          </button>
        </div>
      )}

      {/* DEBUG */}
      <div className="absolute bottom-2 right-4 text-xs text-gray-400">
        {connectionStatus} | {mode}
      </div>
    </div>
  );
};

export default TVScreen;
