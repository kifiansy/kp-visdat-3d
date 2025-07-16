import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing 3D Engine...");

  useEffect(() => {
    const texts = [
      "Initializing 3D Engine...",
      "Loading Data Visualization...",
      "Preparing Interactive Elements...",
      "Optimizing Performance...",
      "Siap Menjelajah Angkasa!",
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        const textIndex = Math.floor(newProgress / 20);
        if (textIndex < texts.length) {
          setLoadingText(texts[textIndex]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
        }

        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/30 rounded-full animate-spin">
            <div
              className="absolute inset-2 border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "0.8s",
              }}
            ></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Alasan Anak IF Telat Lulus
          </h1>
          <p className="text-xl text-gray-300">
            UIN Sunan Gunung Djati Bandung
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-90 space-y-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-400 animate-pulse">{loadingText}</p>

          <p className="text-lg font-semibold text-white">{progress}%</p>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
