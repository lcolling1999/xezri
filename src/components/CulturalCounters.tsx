import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RotateCcw, Share2, Flame, Wind, Compass, Key, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { triggerHaptic } from "../utils/haptics";

interface CulturalCountersProps {
  firstWorkDay: string;
  whatsappNumber: string;
  whatsappText: string;
  developerEmail: string;
  timeMode?: "morning" | "night" | "default";
}

export const CulturalCounters = ({
  firstWorkDay,
  whatsappNumber,
  timeMode,
}: CulturalCountersProps) => {
  // Tea Counter State
  const [teaCount, setTeaCount] = useState<number>(() => {
    const saved = localStorage.getItem("xezri_tea_count");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Active Theme & Recipe Modal States
  const [activeTheme, setActiveTheme] = useState<"gold" | "rosegold">(() => {
    return (localStorage.getItem("xezri_theme") as "gold" | "rosegold") || "gold";
  });

  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const [isNightMode, setIsNightMode] = useState(() => {
    if (timeMode) return timeMode === "night";
    const hour = new Date().getHours();
    return hour >= 21 || hour < 6;
  });

  useEffect(() => {
    if (timeMode) {
      setIsNightMode(timeMode === "night");
      return;
    }

    const checkNight = () => {
      const hour = new Date().getHours();
      setIsNightMode(hour >= 21 || hour < 6);
    };
    checkNight();
    const interval = setInterval(checkNight, 60000);
    return () => clearInterval(interval);
  }, [timeMode]);

  useEffect(() => {
    localStorage.setItem("xezri_theme", activeTheme);
    if (activeTheme === "rosegold" && teaCount >= 20) {
      document.documentElement.classList.add("theme-rosegold");
    } else {
      document.documentElement.classList.remove("theme-rosegold");
    }
  }, [activeTheme, teaCount]);

  // Anniversary Ticker State
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  // Atempause State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathState, setBreathState] = useState<"in" | "out">("in");

  // Photo capturing states for Workdesk share
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!isBreathing) return;
    
    setBreathState("in");
    const interval = setInterval(() => {
      setBreathState((prev) => (prev === "in" ? "out" : "in"));
    }, 4000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  // Photo capturing handlers for Workdesk share
  const handleCaptureDesk = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setCopySuccess(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Try auto-copying to clipboard
      try {
        navigator.clipboard.write([
          new ClipboardItem({ [file.type]: file })
        ]).then(() => {
          setCopySuccess(true);
        }).catch(err => {
          console.warn("Auto copy to clipboard failed", err);
        });
      } catch (err) {
        console.warn("Clipboard API not fully supported or blocked", err);
      }
    }
  };

  const handleTriggerCamera = () => {
    document.getElementById("desk-camera-input")?.click();
  };

  // Insider Tresor State
  const [vaultInput, setVaultInput] = useState("");
  const [showSecretEgg, setShowSecretEgg] = useState(false);
  const [secretEggData, setSecretEggData] = useState({ title: "", desc: "", isPurple: false });

  const handleUnlockVault = () => {
    const cleaned = vaultInput.trim().toLowerCase();
    
    if (cleaned === "bubbles") {
      setSecretEggData({
        title: "🍫 Milka Bubbly",
        desc: "Mmmh... Milka Bubbly Luftschokolade! 💜 Luftig, süß und unschlagbar lecker - genau wie du! Aber deine selbstgebackenen Sachen übertreffen natürlich jede Schokolade. Danke für all die süßen Überraschungen!",
        isPurple: true
      });
      setShowSecretEgg(true);
      setVaultInput("");

      confetti({
        particleCount: 50,
        spread: 60,
        colors: ["#8b5cf6", "#e5c158", "#d4af37", "#f8fafc"],
        disableForReducedMotion: true
      });

      triggerHaptic([80, 50, 80]); // Success double-vibe
      setTimeout(() => setShowSecretEgg(false), 30000);
    } else if (cleaned === "finance" || cleaned === "10 year experience in finance" || cleaned === "ten year experience in finance") {
      setSecretEggData({
        title: "📈 Ms. Shams' Finance Expertise",
        desc: "...weil man mit 10 Jahren Erfahrung in Finance einfach alles besser weiß! 😉 Ein kleiner Insider-Gruß an Ms. Shams und ihre legendär-wirren Beiträge im Unterricht. Du hast das Studium in Hof mit echter Substanz gerockt!",
        isPurple: false
      });
      setShowSecretEgg(true);
      setVaultInput("");

      confetti({
        particleCount: 60,
        spread: 65,
        colors: ["#e5c158", "#d4af37", "#ffffff"],
        disableForReducedMotion: true
      });

      triggerHaptic([80, 50, 80]); // Success double-vibe
      setTimeout(() => setShowSecretEgg(false), 30000);
    } else if (
      cleaned === "frauenhände" || 
      cleaned === "frauenhaende" || 
      cleaned === "umzugskartons" ||
      cleaned === "wunderschöne frauenhände" ||
      cleaned === "wunderschöne frauenhaende" ||
      cleaned === "wunderschoene frauenhaende" ||
      cleaned === "wunderschoene frauenhände"
    ) {
      setSecretEggData({
        title: "📦 Die Legende der Umzugskartons",
        desc: "Weil das Zusammenbauen von Umzugskartons ja bekanntlich absolut keine Aufgabe für zarte 'Frauenhände' ist... 😉 Und natürlich passen Kartons NUR aufgebaut in mein Auto!",
        isPurple: false
      });
      setShowSecretEgg(true);
      setVaultInput("");

      confetti({
        particleCount: 55,
        spread: 60,
        colors: ["#e5c158", "#d4af37", "#b8860b", "#f8fafc"],
        disableForReducedMotion: true
      });

      triggerHaptic([80, 50, 80]); // Success double-vibe
      setTimeout(() => setShowSecretEgg(false), 30000);
    } else if (cleaned === "isch mochte sagen") {
      setSecretEggData({
        title: "🎙️ Isch mochte sagen...",
        desc: "...dass du einfach die Tollste bist! 🌟 Von Baku über Salzburg bis nach Hamburg: Deine Reise ist absolut legendär und ich bewundere deinen Mut jeden Tag. ❤️",
        isPurple: false
      });
      setShowSecretEgg(true);
      setVaultInput("");

      confetti({
        particleCount: 60,
        spread: 60,
        colors: ["#e5c158", "#d4af37", "#ffffff"],
        disableForReducedMotion: true
      });

      triggerHaptic([80, 50, 80]); // Success double-vibe
      setTimeout(() => setShowSecretEgg(false), 30000);
    } else if (
      cleaned.includes("10 jahre") || 
      cleaned.includes("zehn jahre") || 
      cleaned.includes("10 years") || 
      cleaned.includes("ten years")
    ) {
      alert("Fast! Der Insider dreht sich um Ms. Shams. Probiere stattdessen das Schlüsselwort 'Finance'! 📈");
      setVaultInput("Finance");
    } else {
      // Fail feedback
      confetti({
        particleCount: 8,
        spread: 15,
        colors: ["#ef4444"],
        disableForReducedMotion: true
      });
      triggerHaptic(120); // Failure single vibe buzz
      setVaultInput("");
    }
  };

  useEffect(() => {
    localStorage.setItem("xezri_tea_count", teaCount.toString());
  }, [teaCount]);

  // Update Anniversary clock
  useEffect(() => {
    const startDate = new Date(firstWorkDay).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = now - startDate;

      const absDiff = Math.abs(difference);

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
      const milliseconds = Math.floor((absDiff % 1000) / 100); // Show single digit of 100ms for neat layout

      setTimeElapsed({ days, hours, minutes, seconds, milliseconds });
    }, 100);

    return () => clearInterval(interval);
  }, [firstWorkDay]);

  const handleAddTea = () => {
    setTeaCount((prev) => prev + 1);
  };

  const handleResetTea = () => {
    setTeaCount(0);
  };



  // Determine SVG fill height based on teaCount (Max 6 visual steps)
  const maxVisualCups = 6;
  const visualFillPercent = Math.min((teaCount / maxVisualCups) * 100, 100);
  // In the SVG, the tea path goes from Y=180 (empty) down to Y=30 (full)
  // We can animate the height and y position of a clip path rectangle
  const fillHeight = (visualFillPercent / 100) * 150;
  const fillY = 180 - fillHeight;

  return (
    <section className="py-12 px-4 md:px-8 w-full max-w-lg mx-auto space-y-10">
      
      {/* 1. Armudu Tee-Tracker */}
      <div className="glass-panel gold-border p-6 rounded-3xl relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />

        <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase mb-6 text-center">
          Armudu-Tee-Tracker
        </h3>

        {/* Armudu SVG */}
        <div className="relative w-36 h-48 flex items-center justify-center bg-slate-950/20 rounded-2xl p-4 border border-slate-900/60 mb-6">
          <svg
            width="100"
            height="160"
            viewBox="0 0 200 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_8px_rgba(212,175,55,0.15)]"
          >
            {/* Clapped Area of Tea (Inside Glass) */}
            <g clipPath="url(#glassClip)">
              {/* Tea Liquid */}
              <motion.rect
                x="20"
                y={fillY}
                width="160"
                height={fillHeight}
                fill="url(#teaGradient)"
                initial={{ y: 180, height: 0 }}
                animate={{ y: fillY, height: fillHeight }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
              />
              
              {/* Tea foam/bubbles top line */}
              {teaCount > 0 && (
                <motion.ellipse
                  cx="100"
                  cy={fillY}
                  rx={40 - Math.abs(100 - fillY) * 0.1} // adjust radius based on neck height
                  ry="5"
                  fill="#e5c158"
                  opacity="0.75"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8, y: fillY }}
                  className="filter blur-[0.5px]"
                />
              )}
            </g>

            {/* Armudu Glass Contour Outline */}
            <path
              d="M 65 30 L 135 30 C 130 65, 115 85, 115 105 C 115 125, 138 150, 138 165 C 138 178, 125 182, 100 182 C 75 182, 62 178, 62 165 C 62 150, 85 125, 85 105 C 85 85, 70 65, 65 30 Z"
              stroke="url(#glassBorderGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Reflection line (giving glass a premium gloss look) */}
            <path
              d="M 73 45 C 77 75, 91 90, 91 105 C 91 115, 70 145, 70 160"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <defs>
              {/* Clip path inside the glass boundary */}
              <clipPath id="glassClip">
                <path d="M 66 32 L 134 32 C 129 65, 114 85, 114 105 C 114 125, 136 150, 136 164 C 136 176, 124 180, 100 180 C 76 180, 64 176, 64 164 C 64 150, 86 125, 86 105 C 86 85, 71 65, 66 32 Z" />
              </clipPath>

              {/* Tea Liquid Gradient */}
              <linearGradient id="teaGradient" x1="0" y1="30" x2="0" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e5c158" />
                <stop offset="30%" stopColor="#d4af37" />
                <stop offset="70%" stopColor="#8b4513" />
                <stop offset="100%" stopColor="#4a1500" />
              </linearGradient>

              {/* Glass Frame Gradient */}
              <linearGradient id="glassBorderGradient" x1="65" y1="30" x2="138" y2="182" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Steaming vapors (only when teaCount > 0) */}
          <AnimatePresence>
            {teaCount > 0 && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15, scaleX: 0.8 }}
                    animate={{ opacity: [0, 0.4, 0], y: -20, scaleX: [0.8, 1.2, 0.8] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeInOut",
                    }}
                    className="w-[1.5px] h-8 bg-gradient-to-t from-gold-light/40 to-transparent rounded-full filter blur-[0.5px]"
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Counter UI */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center">
            <span className="font-display text-2xl font-light text-offwhite gold-text-glow">
              {teaCount} {teaCount === 1 ? "Tasse" : "Tassen"}
            </span>
            <span className="font-sans text-[10px] tracking-widest text-sage/75 uppercase mt-1">
              Armudu-Tee am Hamburger Schreibtisch
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            {/* Reset Button */}
            <button
              onClick={handleResetTea}
              disabled={teaCount === 0}
              className="flex items-center justify-center p-3 rounded-full border border-slate-800 bg-slate-950/20 text-sage hover:text-offwhite hover:border-gold/30 disabled:opacity-40 disabled:pointer-events-none transition-all duration-300"
            >
              <RotateCcw size={16} />
            </button>
            {/* Add Button */}
            <button
              onClick={handleAddTea}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-dark font-display font-medium text-sm tracking-widest uppercase shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} />
              +1 Tee
            </button>
          </div>

          {/* Achievements & Level-Ups */}
          {teaCount >= 20 && (
            <div className="w-full border-t border-gold/10 pt-4 mt-2 space-y-3">
              <div className="flex items-center gap-1.5 justify-center">
                <Sparkles size={11} className="text-gold animate-pulse" />
                <span className="font-display text-[9px] tracking-widest text-gold uppercase font-semibold">
                  Titel: Teeblatt-Lehrling 🍃
                </span>
              </div>
              
              {/* Theme Switcher Toggle */}
              <div className="flex items-center justify-between bg-slate-950/30 border border-slate-900/60 rounded-xl p-2.5 px-3">
                <span className="font-display text-[9px] tracking-wider text-sage uppercase">
                  Farbschema:
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveTheme("gold")}
                    className={`px-3 py-1 rounded-lg text-[9px] font-display uppercase tracking-widest transition-all cursor-pointer ${
                      activeTheme === "gold"
                        ? "bg-gold text-navy-dark font-medium shadow-[0_0_8px_rgba(212,175,55,0.25)]"
                        : "border border-slate-800 text-sage/70 hover:text-offwhite"
                    }`}
                  >
                    Gold
                  </button>
                  <button
                    onClick={() => setActiveTheme("rosegold")}
                    className={`px-3 py-1 rounded-lg text-[9px] font-display uppercase tracking-widest transition-all cursor-pointer ${
                      activeTheme === "rosegold"
                        ? "bg-gold text-navy-dark font-medium shadow-[0_0_8px_rgba(212,175,55,0.25)]"
                        : "border border-slate-800 text-sage/70 hover:text-offwhite"
                    }`}
                  >
                    Rosé
                  </button>
                </div>
              </div>
            </div>
          )}

          {teaCount >= 50 && (
            <div className="w-full border-t border-gold/10 pt-3 space-y-2">
              <div className="flex items-center gap-1.5 justify-center">
                <Sparkles size={11} className="text-gold animate-pulse" />
                <span className="font-display text-[9px] tracking-widest text-gold uppercase font-semibold">
                  Erfolg: Backmeisterin 🏆
                </span>
              </div>
              
              <button
                onClick={() => setShowRecipeModal(true)}
                className="w-full py-2 rounded-xl bg-slate-950/40 border border-gold/30 hover:border-gold text-gold-light font-display text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Geheimrezept ansehen 🍰
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 2. Arbeitstag-Jubiläum */}
      <div className="glass-panel gold-border p-6 rounded-3xl relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />

        <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase mb-5 text-center flex items-center gap-2">
          <Flame size={16} className="text-gold animate-pulse" />
          Hamburg-Jubiläum
        </h3>

        <div className="text-center space-y-4 w-full">
          <p className="font-sans text-xs text-sage leading-relaxed px-4">
            {new Date().getTime() >= new Date(firstWorkDay).getTime()
              ? "Du eroberst den Hamburger Arbeitsmarkt und rockst deinen neuen Job bereits seit:"
              : "Der Countdown läuft! Dein Abenteuer und neuer Job in Hamburg beginnt in:"}
          </p>

          {/* Time digits grid */}
          <div className="grid grid-cols-4 gap-2 text-center py-2">
            
            {/* Days */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5">
              <span className="font-display text-xl font-light text-gold-light block">
                {timeElapsed.days}
              </span>
              <span className="font-sans text-[9px] tracking-wider text-sage/75 uppercase block mt-1">
                Tage
              </span>
            </div>

            {/* Hours */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5">
              <span className="font-display text-xl font-light text-gold-light block">
                {timeElapsed.hours.toString().padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] tracking-wider text-sage/75 uppercase block mt-1">
                Std
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5">
              <span className="font-display text-xl font-light text-gold-light block">
                {timeElapsed.minutes.toString().padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] tracking-wider text-sage/75 uppercase block mt-1">
                Min
              </span>
            </div>

            {/* Seconds & Milliseconds */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5 relative overflow-hidden">
              <span className="font-display text-xl font-light text-gold-light block">
                {timeElapsed.seconds}
                <span className="text-xs text-sage/60 font-light">.{timeElapsed.milliseconds}</span>
              </span>
              <span className="font-sans text-[9px] tracking-wider text-sage/75 uppercase block mt-1">
                Sek
              </span>
            </div>

          </div>

          <p className="font-sans text-[10px] tracking-wide text-gold/80 italic mt-2">
            Hamburg steht dir hervorragend! ⚓✨
          </p>
        </div>
      </div>

      {/* 3. Atempause Widget */}
      <div className={`glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col items-center transition-all duration-1000 ${
        isNightMode 
          ? "border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] bg-gradient-to-b from-navy-light to-navy-dark" 
          : "border border-gold/15"
      }`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase mb-4 text-center flex items-center gap-2">
          <Wind size={16} className="text-gold" />
          5-Minuten-Atempause
        </h3>
        <p className="font-sans text-xs text-sage text-center leading-relaxed mb-4 px-4 font-light">
          Nimm dir einen kurzen Moment Auszeit vom Bürostress, um durchzuatmen und dich zu fokussieren.
        </p>
        <button
          onClick={() => setIsBreathing(true)}
          className="px-6 py-2.5 rounded-full bg-slate-950/30 border border-gold/30 hover:border-gold text-gold-light font-display text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.05)]"
        >
          Atemübung starten
        </button>
      </div>

      {/* 4. Insider-Tresor Widget */}
      <div className="glass-panel gold-border p-6 rounded-3xl relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase mb-3 text-center flex items-center gap-2">
          <Key size={16} className="text-gold" />
          Der Insider-Tresor
        </h3>
        
        <div className="flex gap-1.5 justify-center flex-wrap mb-4">
          <span className="text-[9px] tracking-wider bg-gold/5 border border-gold/15 text-gold-light/85 px-2.5 py-0.5 rounded-full">
            Hinweis: "Isch mochte sagen"
          </span>
          <span className="text-[9px] tracking-wider bg-gold/5 border border-gold/15 text-gold-light/85 px-2.5 py-0.5 rounded-full">
            Hinweis: "Milka..."
          </span>
          <span className="text-[9px] tracking-wider bg-gold/5 border border-gold/15 text-gold-light/85 px-2.5 py-0.5 rounded-full">
            Hinweis: "Umzugskartons"
          </span>
        </div>

        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="Insider-Wort eingeben..."
            value={vaultInput}
            onChange={(e) => setVaultInput(e.target.value)}
            className="flex-1 bg-slate-950/45 border border-slate-900/60 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-gold/40 min-w-0"
          />
          <button
            onClick={handleUnlockVault}
            className="px-4 py-2 rounded-xl bg-gold text-navy-dark font-display text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer flex-shrink-0"
          >
            Öffnen
          </button>
        </div>
      </div>

      {/* 5. Action Buttons (Desk Share + Hof Signal) */}
      <div className="space-y-4 w-full">
        
        {/* Hof Signal WhatsApp Button */}
        <a
          href={`https://api.whatsapp.com/send?phone=${whatsappNumber.replace(/\+/g, "")}&text=${encodeURIComponent("Hamburg sendet ein Signal nach Hof! Zeit für ein Update? ☕️✨")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl glass-panel border border-gold/30 hover:border-gold/60 text-gold-light font-display text-xs tracking-widest uppercase hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.08)] relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <Compass size={16} className="text-gold transform rotate-180 animate-pulse" />
          Signal nach Hof senden
        </a>

        {/* Share your Desk Button */}
        <div className="flex flex-col items-center w-full">
          <input
            type="file"
            id="desk-camera-input"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCaptureDesk}
          />
          <button
            onClick={handleTriggerCamera}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl glass-panel border border-gold/30 hover:border-gold/60 text-gold-light font-display text-xs tracking-widest uppercase hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.08)] cursor-pointer"
          >
            <Share2 size={16} />
            Share your Workdesk
          </button>
          <p className="font-sans text-[10px] text-sage/55 text-center mt-2 px-6">
            Nimm ein Foto von deinem Schreibtisch auf und sende es direkt per E-Mail!
          </p>
        </div>

      </div>

      {/* Breathing Fullscreen Overlay */}
      <AnimatePresence>
        {isBreathing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-navy-dark/97 backdrop-blur-lg px-6 py-16 select-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
            
            {/* Top Info */}
            <div className="text-center">
              <h3 className="font-display text-sm font-light tracking-[0.2em] text-gold uppercase flex items-center justify-center gap-1.5">
                <Wind size={14} className="animate-pulse" />
                Atempause
              </h3>
              <p className="font-sans text-[10px] tracking-wider text-sage/60 uppercase mt-2">
                Fokus & Ruhe für deinen Tag
              </p>
            </div>

            {/* Breathing Ring Animation */}
            <div className="relative flex items-center justify-center w-64 h-64">
              {/* Ambient Glow */}
              <motion.div
                animate={{
                  scale: breathState === "in" ? 2.5 : 1,
                  opacity: breathState === "in" ? 0.35 : 0.05,
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute w-28 h-28 rounded-full bg-gold/25 blur-3xl"
              />
              
              {/* Main Animated Circle */}
              <motion.div
                animate={{
                  scale: breathState === "in" ? 2.2 : 1,
                  opacity: breathState === "in" ? 0.95 : 0.4,
                  borderColor: breathState === "in" ? "rgba(229,193,88,0.7)" : "rgba(212,175,55,0.25)"
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full border-2 border-gold bg-gold/5 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.05)]"
              />
              
              {/* Core gold dot */}
              <div className="absolute w-3 h-3 rounded-full bg-gold-light" />
            </div>

            {/* Status Text */}
            <div className="text-center space-y-8">
              <div className="h-10">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={breathState}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.8 }}
                    className="font-display text-xl font-light text-gold-light tracking-widest uppercase block gold-text-glow"
                  >
                    {breathState === "in" ? "Einatmen..." : "Ausatmen..."}
                  </motion.span>
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsBreathing(false)}
                className="px-6 py-2.5 rounded-full border border-gold/30 hover:border-gold/60 text-gold-light font-display text-[10px] tracking-widest uppercase hover:bg-gold/10 transition-all duration-300"
              >
                Beenden
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insider-Tresor Easter Egg Takeover Overlay */}
      <AnimatePresence>
        {showSecretEgg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecretEgg(false)}
            className={`fixed inset-0 z-50 flex items-center justify-center px-6 select-none cursor-pointer ${
              secretEggData.isPurple 
                ? "bg-purple-950/97 backdrop-blur-xl" 
                : "bg-navy-dark/97 backdrop-blur-xl"
            }`}
          >
            {/* Background glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_65%)] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 15 }}
              transition={{ type: "spring", damping: 14 }}
              className={`border-2 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.25)] ${
                secretEggData.isPurple 
                  ? "bg-purple-900/60 border-purple-400/40" 
                  : "bg-slate-900/60 border-gold/45"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Spinning gold graphic */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border border-dashed border-gold/25 mx-auto mb-6 flex items-center justify-center"
              >
                <Sparkles className="text-gold-light" size={24} />
              </motion.div>

              <h3 className={`font-display text-base tracking-[0.1em] font-medium uppercase mb-4 ${
                secretEggData.isPurple ? "text-purple-200" : "text-gold-light gold-text-glow"
              }`}>
                {secretEggData.title}
              </h3>

              <div className="w-12 h-[1px] bg-gold/30 mx-auto mb-5" />

              <p className="font-sans text-sm font-light leading-relaxed text-slate-100 italic px-2">
                "{secretEggData.desc}"
              </p>

              <div className="w-12 h-[1px] bg-gold/30 mx-auto mt-6 mb-5" />

              <p className="font-sans text-[9px] tracking-widest text-slate-400 uppercase">
                Tippe irgendwo zum Schließen
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing Fullscreen Overlay */}
      <AnimatePresence>
        {isBreathing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-navy-dark/97 backdrop-blur-lg px-6 py-16 select-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
            
            {/* Top Info */}
            <div className="text-center">
              <h3 className="font-display text-sm font-light tracking-[0.2em] text-gold uppercase flex items-center justify-center gap-1.5">
                <Wind size={14} className="animate-pulse" />
                Atempause
              </h3>
              <p className="font-sans text-[10px] tracking-wider text-sage/60 uppercase mt-2">
                Fokus & Ruhe für deinen Tag
              </p>
            </div>

            {/* Breathing Ring Animation */}
            <div className="relative flex items-center justify-center w-64 h-64">
              {/* Ambient Glow */}
              <motion.div
                animate={{
                  scale: breathState === "in" ? 2.5 : 1,
                  opacity: breathState === "in" ? 0.35 : 0.05,
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute w-28 h-28 rounded-full bg-gold/25 blur-3xl"
              />
              
              {/* Main Animated Circle */}
              <motion.div
                animate={{
                  scale: breathState === "in" ? 2.2 : 1,
                  opacity: breathState === "in" ? 0.95 : 0.4,
                  borderColor: breathState === "in" ? "rgba(229,193,88,0.7)" : "rgba(212,175,55,0.25)"
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full border-2 border-gold bg-gold/5 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.05)]"
              />
              
              {/* Core gold dot */}
              <div className="absolute w-3 h-3 rounded-full bg-gold-light" />
            </div>

            {/* Status Text */}
            <div className="text-center space-y-8">
              <div className="h-10">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={breathState}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.8 }}
                    className="font-display text-xl font-light text-gold-light tracking-widest uppercase block gold-text-glow"
                  >
                    {breathState === "in" ? "Einatmen..." : "Ausatmen..."}
                  </motion.span>
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsBreathing(false)}
                className="px-6 py-2.5 rounded-full border border-gold/30 hover:border-gold/60 text-gold-light font-display text-[10px] tracking-widest uppercase hover:bg-gold/10 transition-all duration-300"
              >
                Beenden
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Baku Cardamom Tea Cake Recipe Modal */}
      <AnimatePresence>
        {showRecipeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRecipeModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/95 backdrop-blur-md px-6 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="glass-panel border-2 border-gold/45 p-6 rounded-3xl max-w-sm w-full relative overflow-hidden bg-gradient-to-b from-navy-light to-navy-dark cursor-default space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-gold/10 pb-3">
                <span className="font-display text-[10px] tracking-widest text-gold uppercase block">
                  Meisterbäcker-Rezept
                </span>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="text-sage hover:text-gold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-base font-normal tracking-wide text-offwhite gold-text-glow">
                  10 Eier Nusskuchen
                </h4>
                <p className="font-sans text-[10px] text-sage/60 uppercase tracking-wider font-light">
                  Persönliches Lieblingsrezept — einfach & lecker!
                </p>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <span className="font-display text-[9px] tracking-widest text-gold uppercase block">
                  Zutaten:
                </span>
                <ul className="font-sans text-xs text-sage/95 font-light space-y-1 pl-4 list-disc">
                  <li>10 frische Eier</li>
                  <li>400g gemahlene Haselnüsse</li>
                  <li>200g Zucker</li>
                  <li>Puderzucker (zum Verzieren)</li>
                  <li>Etwas Butter (zum Einfetten der Kastenform)</li>
                </ul>
              </div>

              {/* Instructions */}
              <div className="space-y-2 border-t border-slate-900/60 pt-3">
                <span className="font-display text-[9px] tracking-widest text-gold uppercase block">
                  Zubereitung:
                </span>
                <p className="font-sans text-[11.5px] text-sage/90 font-light leading-relaxed">
                  Die 10 Eier schön lange schaumig und luftig rühren (am besten mit dem Handrührgerät). Dann nach und nach die gemahlenen Nüsse und den Zucker dazugeben. Eine Kastenform mit Butter einfetten und den Teig einfüllen. Im vorgeheizten Backofen bei 200 Grad Umluft ca. 50 Minuten backen! Nach dem Abkühlen mit Puderzucker bestäuben. Guten Appetit! ☕🍰
                </p>
                <p className="font-sans text-[10px] text-gold/60 italic text-center pt-1 font-light">
                  "Don't trust my baking skills ;)"
                </p>
              </div>

              <button
                onClick={() => setShowRecipeModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-950/40 border border-gold/30 hover:border-gold text-gold-light font-display text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Captured Photo Mail Modal Overlay */}
      <AnimatePresence>
        {capturedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/95 backdrop-blur-md px-6 cursor-pointer"
            onClick={() => setCapturedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="glass-panel border-2 border-gold/40 p-6 rounded-3xl max-w-sm w-full relative overflow-hidden text-center shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-gradient-to-b from-navy-light to-navy-dark cursor-default space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-sm font-light tracking-[0.15em] text-gold uppercase mb-2">
                Foto bereitstellen 📸
              </h3>

              {/* Photo preview container */}
              <div className="w-full h-44 rounded-xl border border-gold/20 overflow-hidden bg-slate-950/40 flex items-center justify-center">
                <img src={capturedPhoto} alt="Captured Workdesk" className="w-full h-full object-cover" />
              </div>

              <p className="font-sans text-[11px] text-sage/95 leading-relaxed">
                {copySuccess 
                  ? "Dein Foto wurde automatisch in die Zwischenablage kopiert! 🎉"
                  : "Foto erfolgreich aufgenommen!"}
                {" "}Tippe unten auf den Button, um deine E-Mail-App zu öffnen, und füge das Bild einfach dort ein.
              </p>

              {/* Manual Copy Button if auto-copy failed */}
              {!copySuccess && photoFile && (
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.write([
                        new ClipboardItem({ [photoFile.type]: photoFile })
                      ]);
                      setCopySuccess(true);
                    } catch (err) {
                      alert("Kopieren nicht unterstützt. Du kannst das Foto stattdessen in deiner Mail-App als Anhang hinzufügen!");
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-slate-950/40 border border-gold/30 hover:border-gold text-gold-light font-display text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  Foto in Zwischenablage kopieren 📋
                </button>
              )}

              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={`mailto:lcolling@gealan.de?subject=Mein%20Hamburger%20Schreibtisch%20%E2%98%95%EF%B8%8F&body=Hallo!%20Anbei%20ein%20Foto%20von%20meinem%20Arbeitsplatz%20in%20Hamburg...%20(Bitte%20das%20kopierte%2520Bild%2520hier%20einf%C3%BCgen!%20%E2%99%A5)`}
                  className="w-full py-3 rounded-xl bg-gold text-navy-dark font-display text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 hover:scale-105 active:scale-95 block text-center shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                  onClick={() => setCapturedPhoto(null)}
                >
                  E-Mail senden ✉️
                </a>

                <button
                  onClick={() => setCapturedPhoto(null)}
                  className="font-sans text-[10px] tracking-wider text-sage/40 uppercase hover:text-sage cursor-pointer"
                >
                  Abbrechen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
