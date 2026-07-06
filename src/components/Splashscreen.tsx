import { useEffect } from "react";
import { motion } from "framer-motion";

interface SplashscreenProps {
  onComplete: () => void;
}

export const Splashscreen = ({ onComplete }: SplashscreenProps) => {

  useEffect(() => {
    // Check if the splash was already shown in this session
    const hasBeenShown = sessionStorage.getItem("xezri_splash_shown");
    if (hasBeenShown) {
      onComplete();
      return;
    }

    // Set timeout to complete the splash screen
    const timer = setTimeout(() => {
      sessionStorage.setItem("xezri_splash_shown", "true");
      onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Handle immediate tap to skip
  const handleSkip = () => {
    sessionStorage.setItem("xezri_splash_shown", "true");
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      onClick={handleSkip}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-navy-dark px-6 py-12 select-none"
    >
      {/* Decorative top grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />

      {/* Top spacing */}
      <div />

      {/* Centerpiece: Animated Buta */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Glow behind Buta */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.45, scale: 1.1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute w-48 h-64 rounded-full bg-gold/10 blur-3xl"
        />

        <svg
          width="180"
          height="240"
          viewBox="0 0 200 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-[0_0_12px_rgba(229,193,88,0.3)]"
        >
          {/* Main Outer Buta Path */}
          <motion.path
            d="M 100 260 C 50 260, 20 215, 20 160 C 20 105, 65 75, 100 45 C 118 30, 125 18, 125 8 C 125 3, 122 3, 118 8 C 105 28, 85 55, 85 85 C 85 115, 115 140, 142 168 C 168 196, 168 230, 150 250 C 140 260, 120 260, 100 260 Z"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.2, ease: [0.25, 1, 0.5, 1] }}
          />

          {/* Inner Nested Buta Path */}
          <motion.path
            d="M 100 240 C 65 240, 40 205, 40 160 C 40 115, 75 92, 100 70 C 108 62, 110 52, 110 47 C 110 44, 108 44, 106 47 C 98 58, 88 78, 88 95 C 88 120, 110 140, 130 162 C 150 184, 150 215, 135 230 C 127 240, 115 240, 100 240 Z"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ delay: 0.8, duration: 2.5, ease: "easeInOut" }}
          />

          {/* Decorative Inner Details (Tiny star-like paths) */}
          <motion.path
            d="M 100 130 L 100 140 M 95 135 L 105 135 M 96 131 L 104 139 M 96 139 L 104 131"
            stroke="#e5c158"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: 2, duration: 0.8 }}
          />
          
          <motion.path
            d="M 85 170 L 85 176 M 82 173 L 88 173"
            stroke="#e5c158"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          />

          <motion.path
            d="M 115 185 L 115 191 M 112 188 L 118 188"
            stroke="#e5c158"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ delay: 2.3, duration: 0.8 }}
          />

          <defs>
            <linearGradient id="goldGradient" x1="20" y1="8" x2="168" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e5c158" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
          </defs>
        </svg>

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.2, ease: "easeOut" }}
          className="mt-8 text-center"
        >
          <h1 className="font-display text-4xl font-light tracking-[0.3em] uppercase gold-gradient-text gold-text-glow">
            Xəzri
          </h1>
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-sage/75 mt-3">
            Baku • Hamburg
          </p>
        </motion.div>
      </div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="text-[10px] tracking-[0.2em] uppercase text-sage/40 text-center select-none"
      >
        Tippen zum Überspringen
      </motion.div>
    </motion.div>
  );
};
