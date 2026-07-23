import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Coffee, X } from "lucide-react";
import { triggerHaptic } from "../utils/haptics";
import confetti from "canvas-confetti";

export type KnittyMood = "happy" | "grumpy" | "surprised";

interface KnittyPetProps {
  teaCount?: number;
  onClose?: () => void;
}

const KNITTY_MESSAGES_DAY = [
  "Du machst das hervorragend, Madina! ✨",
  "Zeit für eine kleine 5-Minuten-Pause! 🍵",
  "Danke, dass du mich für Leo gestrickt hast! 🧶❤️",
  "Hamburg passt perfekt zu dir! ⚓",
  "Denk daran, heute genug zu trinken! 💧",
  "Du rockst den Tag im Büro! 💪",
  "Ein Lächeln für dich zwischendurch! 😊"
];

const KNITTY_MESSAGES_NIGHT = [
  "Zzz... Gute Nacht, Madina! 🌙",
  "Schlaf schön und träum was Süßes! 💤",
  "Knitty ist schon im Bett... Zzz 😴",
  "Morgen wird ein wundervoller Tag! ✨"
];

export function KnittyPet({ teaCount = 0, onClose }: KnittyPetProps) {
  const [petCount, setPetCount] = useState<number>(() => {
    return parseInt(localStorage.getItem("xezri_knitty_pet_count") || "0", 10);
  });
  
  const [mood, setMood] = useState<KnittyMood>(() => {
    return (localStorage.getItem("xezri_knitty_mood") as KnittyMood) || "happy";
  });

  const [isBouncing, setIsBouncing] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isNight, setIsNight] = useState(false);
  const [isSleepyWaking, setIsSleepyWaking] = useState(false);

  // Detect Night mode (after 21:00 or before 06:00)
  useEffect(() => {
    const checkNight = () => {
      const hour = new Date().getHours();
      setIsNight(hour >= 21 || hour < 6);
    };
    checkNight();
    const interval = setInterval(checkNight, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMood = (e: React.MouseEvent) => {
    e.stopPropagation();
    const moods: KnittyMood[] = ["happy", "grumpy", "surprised"];
    const nextMood = moods[(moods.indexOf(mood) + 1) % moods.length];
    setMood(nextMood);
    localStorage.setItem("xezri_knitty_mood", nextMood);
    triggerHaptic(15);
  };

  const handlePetKnitty = () => {
    const newCount = petCount + 1;
    setPetCount(newCount);
    localStorage.setItem("xezri_knitty_pet_count", newCount.toString());

    // Physics bounce & haptics
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
    triggerHaptic([50, 30, 50]);

    // Little heart/yarn particle burst
    confetti({
      particleCount: 12,
      spread: 45,
      origin: { y: 0.65 },
      colors: ["#a4c4a8", "#d4af37", "#f43f5e", "#ffffff"],
      disableForReducedMotion: true,
    });

    // Handle speech bubbles & night mode waking
    if (isNight) {
      setIsSleepyWaking(true);
      setTimeout(() => setIsSleepyWaking(false), 3000);
      const randomMsg = KNITTY_MESSAGES_NIGHT[Math.floor(Math.random() * KNITTY_MESSAGES_NIGHT.length)];
      setSpeechBubble(randomMsg);
    } else {
      const randomMsg = KNITTY_MESSAGES_DAY[Math.floor(Math.random() * KNITTY_MESSAGES_DAY.length)];
      setSpeechBubble(randomMsg);
    }

    // Auto hide speech bubble after 4 seconds
    setTimeout(() => setSpeechBubble(null), 4000);
  };

  return (
    <div className="glass-panel gold-border p-6 rounded-3xl relative overflow-hidden flex flex-col items-center text-center shadow-[0_0_25px_rgba(212,175,55,0.08)]">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(164,196,168,0.06),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4 border-b border-gold/10 pb-2.5 z-10">
        <span className="font-display text-xs tracking-widest text-gold uppercase flex items-center gap-1.5 font-medium">
          <Sparkles size={14} className="animate-pulse" />
          Knitty 🧶
        </span>
        <div className="flex items-center gap-2">
          {/* Mood Switcher Toggle Button */}
          <button
            onClick={handleToggleMood}
            className="font-sans text-[10px] tracking-wider text-sage/90 bg-slate-950/40 border border-gold/25 hover:border-gold/60 px-2.5 py-0.5 rounded-full cursor-pointer transition-all flex items-center gap-1 active:scale-95"
            title="Knittys Mund / Stimmung ändern"
          >
            Mund: {mood === "happy" ? "😊" : mood === "grumpy" ? "😐" : "😮"}
          </button>

          <span className="font-sans text-[10px] tracking-wider text-sage/75 uppercase font-medium tabular-nums bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full">
            {petCount}x gestreichelt
          </span>

          {onClose && (
            <button
              onClick={onClose}
              className="text-sage/60 hover:text-gold transition-colors p-1 cursor-pointer"
              aria-label="Schließen"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="h-12 flex items-center justify-center mb-2 z-20">
        <AnimatePresence mode="wait">
          {speechBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="bg-navy-dark/95 border border-gold/45 px-3.5 py-1.5 rounded-2xl shadow-lg relative text-[11px] text-sage/95 font-sans font-light tracking-wide max-w-[240px]"
            >
              {speechBubble}
              {/* Speech bubble arrow pointer */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-navy-dark border-r border-b border-gold/45 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Knitty Ball Container */}
      <div className="relative my-2 cursor-pointer group" onClick={handlePetKnitty}>
        
        {/* Soft Shadow underneath */}
        <motion.div
          animate={{
            scale: isBouncing ? [1, 0.6, 1] : [1, 1.08, 1],
            opacity: isBouncing ? 0.2 : 0.4,
          }}
          transition={{ duration: isBouncing ? 0.5 : 3, repeat: isBouncing ? 0 : Infinity, ease: "easeInOut" }}
          className="w-24 h-4 bg-black/40 rounded-full mx-auto filter blur-sm translate-y-36"
        />

        {/* Animated Knitty Character */}
        <motion.div
          animate={{
            y: isBouncing ? [-25, 0] : [0, -4, 0],
            scale: isBouncing ? [1.15, 0.95, 1] : [1, 1.04, 1],
            rotate: isBouncing ? [-8, 8, 0] : [-1, 1, -1],
          }}
          transition={{
            duration: isBouncing ? 0.45 : 3.5,
            repeat: isBouncing ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="relative w-36 h-36 mx-auto select-none"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
            <defs>
              {/* Mint Green Knitted Texture Gradient */}
              <radialGradient id="knittyGradient" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#c3dfc7" />
                <stop offset="50%" stopColor="#9cbfa1" />
                <stop offset="100%" stopColor="#6f9474" />
              </radialGradient>
              
              {/* Soft Rosy Blush Gradient */}
              <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(244, 63, 94, 0.6)" />
                <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
              </radialGradient>

              {/* Eye Gloss Gradient */}
              <radialGradient id="eyeGloss" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#4a4a4a" />
                <stop offset="40%" stopColor="#111111" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
            </defs>

            {/* Main Crocheted Spherical Body */}
            <circle cx="50" cy="50" r="42" fill="url(#knittyGradient)" stroke="#597d5e" strokeWidth="1.5" />

            {/* Crocheted Stitch Texture Lines */}
            <g stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.25">
              <path d="M 22 35 C 30 30, 45 32, 50 35 C 55 38, 70 32, 78 35" fill="none" />
              <path d="M 18 50 C 28 45, 45 47, 50 50 C 55 53, 72 45, 82 50" fill="none" />
              <path d="M 22 65 C 30 60, 45 62, 50 65 C 55 68, 70 60, 78 65" fill="none" />
              <path d="M 35 22 C 40 30, 38 45, 35 50 C 32 55, 40 70, 35 78" fill="none" />
              <path d="M 65 22 C 60 30, 62 45, 65 50 C 68 55, 60 70, 65 78" fill="none" />
            </g>

            {/* Rosy Cheeks (shown when teaCount > 0 or petted) */}
            {(teaCount > 0 || speechBubble) && (
              <>
                <ellipse cx="28" cy="58" rx="7" ry="4.5" fill="url(#blushGradient)" />
                <ellipse cx="72" cy="58" rx="7" ry="4.5" fill="url(#blushGradient)" />
              </>
            )}

            {/* Eyes (Sleeping vs Awake) */}
            {isNight && !isSleepyWaking ? (
              /* Sleeping Eyes: >_< or arcs */
              <g stroke="#1a251b" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M 30 48 Q 36 54 42 48" />
                <path d="M 58 48 Q 64 54 70 48" />
              </g>
            ) : (
              /* Glossy Safety Eyes (Matching the photo!) */
              <g>
                {/* Left Eye */}
                <circle cx="36" cy="46" r="7" fill="url(#eyeGloss)" stroke="#0d140e" strokeWidth="1" />
                <circle cx="33.5" cy="43.5" r="2.2" fill="#ffffff" opacity="0.9" />
                <circle cx="38" cy="48" r="0.9" fill="#ffffff" opacity="0.6" />

                {/* Right Eye */}
                <circle cx="64" cy="46" r="7" fill="url(#eyeGloss)" stroke="#0d140e" strokeWidth="1" />
                <circle cx="61.5" cy="43.5" r="2.2" fill="#ffffff" opacity="0.9" />
                <circle cx="66" cy="48" r="0.9" fill="#ffffff" opacity="0.6" />
              </g>
            )}

            {/* DYNAMIC MOOD MOUTH RENDERING */}
            {mood === "happy" && (
              /* Happy U-Smile (Photo 1) */
              <path
                d="M 33 63 Q 50 72 67 63"
                fill="none"
                stroke="#d49b90"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.95"
              />
            )}

            {mood === "grumpy" && (
              /* Grumpy / Neutral Frown (Photo 2!) */
              <path
                d="M 33 68 Q 50 57 67 68"
                fill="none"
                stroke="#d49b90"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.95"
              />
            )}

            {mood === "surprised" && (
              /* Surprised O-Mouth */
              <ellipse
                cx="50"
                cy="65"
                rx="5"
                ry="6"
                fill="none"
                stroke="#d49b90"
                strokeWidth="3"
                opacity="0.95"
              />
            )}

            {/* Nightcap / Sleeping Hat (Shown at night) */}
            {isNight && (
              <g transform="translate(48, 8) rotate(-15)">
                {/* Nightcap cone */}
                <path d="M -5 18 Q 15 -10 35 15 Z" fill="#3b82f6" opacity="0.9" />
                <path d="M -7 16 Q 15 22 37 14" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                {/* Pom-pom */}
                <circle cx="35" cy="15" r="4.5" fill="#ffffff" />
              </g>
            )}
          </svg>

          {/* Mini Armudu Tea Cup alongside Knitty when teaCount > 0 */}
          {teaCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 bottom-1 bg-navy-dark/90 border border-gold/40 rounded-full p-1.5 shadow-md flex items-center justify-center gap-1"
            >
              <Coffee size={12} className="text-gold animate-pulse" />
              <span className="text-[9px] font-sans font-medium text-gold">Tee-Zeit</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Interaction Hint / Status */}
      <div className="mt-2 space-y-1">
        <p className="font-sans text-xs text-sage/90 font-light">
          {isNight
            ? "Knitty schläft friedlich... Tippe ihn leise an! 💤"
            : teaCount > 0
            ? "Knitty ist aufgewärmt & glücklich mit deinem Tee! ☕✨"
            : "Tippe auf Knitty, um ihn zu streicheln! 🧶"}
        </p>
      </div>
    </div>
  );
}

/**
 * Small non-interactive Knitty accent icon for decorative easter eggs on cards.
 */
export function KnittyAccent({ size = 28 }: { size?: number }) {
  return (
    <div className="inline-block relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <circle cx="50" cy="50" r="42" fill="#9cbfa1" stroke="#597d5e" strokeWidth="2" />
        <circle cx="36" cy="46" r="6" fill="#111111" />
        <circle cx="34" cy="44" r="2" fill="#ffffff" />
        <circle cx="64" cy="46" r="6" fill="#111111" />
        <circle cx="62" cy="44" r="2" fill="#ffffff" />
        <path d="M 33 63 Q 50 72 67 63" fill="none" stroke="#d49b90" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * 👨‍🍳 BÄCKEREI EASTER EGG: Knitty eating a Franzbrötchen / Cookie!
 */
export function KnittyBaker({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        triggerHaptic(15);
        onClick?.();
      }}
      className="inline-flex items-center gap-2 bg-slate-950/40 border border-gold/30 hover:border-gold/60 p-2 px-3 rounded-2xl cursor-pointer group transition-all"
    >
      <div className="relative w-8 h-8">
        <KnittyAccent size={32} />
        <span className="absolute -bottom-1 -right-1 text-xs select-none">🥐</span>
      </div>
      <span className="font-display text-[10px] tracking-wider text-sage/80 group-hover:text-gold uppercase">
        Knitty schmaust 🥐
      </span>
    </motion.div>
  );
}

/**
 * 🚗 STORY TIMELINE EASTER EGG: Knitty on a Roadtrip in a tiny car!
 */
export function KnittyTraveler({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        triggerHaptic(15);
        onClick?.();
      }}
      className="inline-flex items-center gap-2 bg-slate-950/40 border border-gold/30 hover:border-gold/60 p-2 px-3 rounded-2xl cursor-pointer group transition-all"
    >
      <div className="relative w-8 h-8">
        <KnittyAccent size={32} />
        <span className="absolute -bottom-1 -right-1 text-xs select-none">🚗</span>
      </div>
      <span className="font-display text-[10px] tracking-wider text-sage/80 group-hover:text-gold uppercase">
        Knitty macht 'ne Rundreise 🚗
      </span>
    </motion.div>
  );
}

/**
 * ⚓ HAMBURG EASTER EGG: Knitty as a Hamburg Sailor / Captain!
 */
export function KnittySailor({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        triggerHaptic(15);
        onClick?.();
      }}
      className="inline-flex items-center gap-2 bg-slate-950/40 border border-gold/30 hover:border-gold/60 p-2 px-3 rounded-2xl cursor-pointer group transition-all"
    >
      <div className="relative w-8 h-8">
        <KnittyAccent size={32} />
        <span className="absolute -bottom-1 -right-1 text-xs select-none">⚓</span>
      </div>
      <span className="font-display text-[10px] tracking-wider text-sage/80 group-hover:text-gold uppercase">
        Kapitän Knitty ⚓
      </span>
    </motion.div>
  );
}

/**
 * ☕ DESK & TEE EASTER EGG: Knitty sipping Armudu Tea!
 */
export function KnittyTea({ onClick }: { onClick?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        triggerHaptic(15);
        onClick?.();
      }}
      className="inline-flex items-center gap-2 bg-slate-950/40 border border-gold/30 hover:border-gold/60 p-2 px-3 rounded-2xl cursor-pointer group transition-all"
    >
      <div className="relative w-8 h-8">
        <KnittyAccent size={32} />
        <span className="absolute -bottom-1 -right-1 text-xs select-none">☕</span>
      </div>
      <span className="font-display text-[10px] tracking-wider text-sage/80 group-hover:text-gold uppercase">
        Knitty trinkt Tee ☕
      </span>
    </motion.div>
  );
}
