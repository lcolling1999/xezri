import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { ChecklistItem } from "../types";
import { Anchor, CheckCircle, Car, Sliders, TrendingUp, Sparkles } from "lucide-react";

interface HamburgDashboardProps {
  checklistItems: ChecklistItem[];
}

export const HamburgDashboard = ({ checklistItems }: HamburgDashboardProps) => {
  // Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("xezri_checklist");
    return saved ? JSON.parse(saved) : {};
  });

  // Travel Progress State (0 to 100)
  const [travelProgress, setTravelProgress] = useState<number>(() => {
    const saved = localStorage.getItem("xezri_travel_progress");
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("xezri_checklist", JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem("xezri_travel_progress", travelProgress.toString());
  }, [travelProgress]);

  const totalItems = checklistItems.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Friday Review States
  interface WeeklyReview {
    week: string;
    date: string;
    stress: number;
    success: number;
    vibe: number;
  }

  const getWeekString = (date: Date = new Date()) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
  };

  const [reviews, setReviews] = useState<WeeklyReview[]>(() => {
    const saved = localStorage.getItem("xezri_weekly_reviews");
    return saved ? JSON.parse(saved) : [];
  });

  const [lastReviewedWeek, setLastReviewedWeek] = useState<string>(() => {
    return localStorage.getItem("xezri_last_reviewed_week") || "";
  });

  const [stressScore, setStressScore] = useState(5);
  const [successScore, setSuccessScore] = useState(5);
  const [vibeScore, setVibeScore] = useState(5);
  const [showMemeUnlocked, setShowMemeUnlocked] = useState(false);

  const today = new Date();
  const isFriday = today.getDay() === 5;
  const isAfter16 = today.getHours() >= 16;
  const currentWeek = getWeekString();
  const alreadyReviewed = lastReviewedWeek === currentWeek;
  const isFridayRitualActive = isFriday && isAfter16;

  const handleSaveReview = (e: FormEvent) => {
    e.preventDefault();
    const newReview: WeeklyReview = {
      week: currentWeek,
      date: new Date().toLocaleDateString("de-DE"),
      stress: stressScore,
      success: successScore,
      vibe: vibeScore
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("xezri_weekly_reviews", JSON.stringify(updated));
    
    setLastReviewedWeek(currentWeek);
    localStorage.setItem("xezri_last_reviewed_week", currentWeek);
    
    setShowMemeUnlocked(true);

    confetti({
      particleCount: 30,
      spread: 40,
      colors: ["#d4af37", "#10b981", "#3b82f6"],
      disableForReducedMotion: true
    });
  };

  // SVG Chart Dimensions
  const width = 300;
  const height = 120;
  const chartData = [...reviews].reverse();

  const getX = (index: number) => {
    if (chartData.length <= 1) return width / 2;
    return (index / (chartData.length - 1)) * (width - 40) + 20;
  };

  const getY = (val: number) => {
    return height - 15 - ((val - 1) / 9) * (height - 30);
  };

  const getPathD = (key: "stress" | "success" | "vibe") => {
    if (chartData.length === 0) return "";
    return chartData.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d[key])}`).join(" ");
  };

  // Circular Progress parameters
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleToggle = (id: string) => {
    const isNowChecked = !checkedItems[id];
    
    setCheckedItems((prev) => ({
      ...prev,
      [id]: isNowChecked,
    }));

    if (isNowChecked) {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#d4af37", "#e5c158", "#b8860b", "#f8fafc"],
        gravity: 1.2,
        disableForReducedMotion: true,
      });
    }
  };

  // Bezier coordinates for landscape map route:
  // Hof (Start): (200, 130)
  // Erfurt (Mitte): (115, 85)
  // Hamburg (Ziel): (40, 30)
  // Formula: B(t) = (1-t)^3 * P0 + 3*(1-t)^2*t * P1 + 3*(1-t)*t^2 * P2 + t^3 * P3
  const getTrainCoords = (progress: number) => {
    const t = progress / 100;
    const mt = 1 - t;

    // Control points: P0=(200, 130), P1=(170, 140), P2=(115, 80), P3=(65, 30)
    // We adjust them to fit a nice curved route line (giving Hamburg 25px more room)
    const x = mt*mt*mt * 200 + 3*mt*mt*t * 165 + 3*mt*t*t * 115 + t*t*t * 65;
    const y = mt*mt*mt * 130 + 3*mt*mt*t * 135 + 3*mt*t*t * 70 + t*t*t * 30;

    return { x, y };
  };

  const trainPos = getTrainCoords(travelProgress);

  // Dynamic travel message based on slider progress (Developer visiting her in his electric CUPRA Born)
  const getTravelMessage = () => {
    if (travelProgress === 0) {
      return {
        title: "Startpunkt: Hof",
        desc: "Startklar in meinem CUPRA Born! Der Akku ist voll geladen und mein Auto ist startbereit. Auf geht's Richtung Hamburg! ⚡🚗",
        km: 0
      };
    } else if (travelProgress > 0 && travelProgress <= 25) {
      return {
        title: "Auf der Strecke: Thüringer Wald",
        desc: "Mein Auto gleitet leise über die A71. Ein letzter Blick zurück auf Hof. Die Vorfreude auf das Treffen in Hamburg steigt! 🌲",
        km: Math.round((travelProgress / 100) * 525)
      };
    } else if (travelProgress > 25 && travelProgress <= 65) {
      return {
        title: "Zwischenstopp: Erfurt / Kassel",
        desc: "Zwischenstopp zum Laden! Kurze Kaffeepause, während mein Auto Strom zieht (~262 km geschafft). Weiter geht's nach Norden! ⚡☕",
        km: Math.round((travelProgress / 100) * 525)
      };
    } else if (travelProgress > 65 && travelProgress < 95) {
      return {
        title: "Auf der A7: Heidekreis",
        desc: "Die Lüneburger Heide zieht vorbei, mein Auto rollt zügig nach Norden. Gleich riecht es nach Elbe, Hafen und Hamburg. Ankunft naht! ⚓",
        km: Math.round((travelProgress / 100) * 525)
      };
    } else {
      return {
        title: "Endstation: Hamburg",
        desc: "Angekommen! (~525 km) Mein Auto parkt vor Ort. Schön, endlich wieder in Hamburg zu sein und dich zu sehen! ⚓✨",
        km: 525
      };
    }
  };

  const activeLog = getTravelMessage();

  // Helper to animate CUPRA directly to a specific station progress
  const animateCarTo = (target: number) => {
    let current = travelProgress;
    const step = current < target ? 2 : -2;
    
    const interval = setInterval(() => {
      current += step;
      if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
        setTravelProgress(target);
        clearInterval(interval);
      } else {
        setTravelProgress(current);
      }
    }, 20);
  };

  return (
    <section className="py-12 px-4 md:px-8 w-full max-w-lg mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-light tracking-[0.2em] uppercase gold-gradient-text gold-text-glow">
          Hamburg Dashboard
        </h2>
        <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-3" />
        <p className="font-sans text-xs tracking-wider text-sage mt-2">
          Dein Weg nach Norden & Hamburg Entdecker-Liste
        </p>
      </div>

      {/* 1. UPGRADED INTERACTIVE ROUTE MAP CARD */}
      <div className="glass-panel gold-border p-5 rounded-3xl flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-light/10 to-navy-dark/40 pointer-events-none" />
        
        <div className="flex flex-col gap-1 mb-4 border-b border-gold/10 pb-3.5 z-10">
          <div className="flex items-center gap-1.5 text-gold font-display text-xs tracking-widest uppercase animate-pulse">
            <Car size={12} className="flex-shrink-0" />
            Die Strecke (Hof ➔ Hamburg)
          </div>
          <div className="font-sans text-[10px] tracking-widest text-sage/75 uppercase font-medium tabular-nums">
            Entfernung: {activeLog.km} / 525 km
          </div>
        </div>

        {/* SVG Map (Landscape - Full Width) */}
        <div className="relative w-full h-44 bg-slate-950/25 rounded-2xl border border-slate-900/50 flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 240 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_8px_rgba(212,175,55,0.1)]"
          >
            {/* Dashed background track */}
            <path
              d="M 200 130 C 165 135, 115 70, 65 30"
              stroke="rgba(212, 175, 55, 0.08)"
              strokeWidth="3"
              strokeDasharray="4 4"
            />

            {/* Glowing Golden Route path */}
            <path
              d="M 200 130 C 165 135, 115 70, 65 30"
              stroke="url(#routeGoldGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Clickable Hof Node */}
            <g transform="translate(200, 130)" className="cursor-pointer" onClick={() => animateCarTo(0)}>
              <circle r="6" fill={travelProgress === 0 ? "#e5c158" : "#94a3b8"} opacity="0.3" className={travelProgress === 0 ? "animate-ping" : ""} />
              <circle r="4.5" fill={travelProgress === 0 ? "#e5c158" : "#94a3b8"} stroke="#0b132b" strokeWidth="1" />
              <text x="12" y="4" fill="#94a3b8" className="font-display text-[9px] tracking-wider" textAnchor="start">
                Hof
              </text>
            </g>

            {/* Clickable Erfurt/Kassel Node (Middle) */}
            <g transform="translate(115, 77)" className="cursor-pointer" onClick={() => animateCarTo(50)}>
              <circle r="6" fill={travelProgress > 40 && travelProgress < 60 ? "#e5c158" : "#94a3b8"} opacity="0.3" className={travelProgress > 40 && travelProgress < 60 ? "animate-ping" : ""} />
              <circle r="4.5" fill={travelProgress > 40 && travelProgress < 60 ? "#e5c158" : "#94a3b8"} stroke="#0b132b" strokeWidth="1" />
              <text x="10" y="-8" fill="#94a3b8" className="font-display text-[9px] tracking-wider" textAnchor="start">
                Erfurt
              </text>
            </g>

            {/* Clickable Hamburg Node */}
            <g transform="translate(65, 30)" className="cursor-pointer" onClick={() => animateCarTo(100)}>
              <circle r="10" fill="#d4af37" opacity="0.25" className={travelProgress === 100 ? "animate-ping" : "animate-pulse"} />
              <circle r="6" fill="#0b132b" stroke="#d4af37" strokeWidth="1.5" />
              <circle r="3.5" fill={travelProgress === 100 ? "#e5c158" : "#d4af37"} />
              <text x="-12" y="4" fill="#e5c158" className="font-display text-[10px] tracking-widest font-semibold gold-text-glow" textAnchor="end">
                Hamburg
              </text>
            </g>

            {/* Car (CUPRA) marker representation */}
            <g transform={`translate(${trainPos.x}, ${trainPos.y})`}>
              {/* Car glow */}
              <circle r="8" fill="#e5c158" opacity="0.5" className="animate-pulse" />
              {/* Outer icon structure */}
              <circle r="6.5" fill="#0b132b" stroke="#e5c158" strokeWidth="1.5" />
              {/* Car emoji */}
              <text x="-0.5" y="3.5" fontSize="7.5px" fill="#e5c158" textAnchor="middle" fontWeight="bold">
                🚗
              </text>
            </g>

            <defs>
              <linearGradient id="routeGoldGrad" x1="200" y1="130" x2="40" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#e5c158" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Travel Slider */}
        <div className="mt-4 px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={travelProgress}
            onChange={(e) => setTravelProgress(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-900 border border-slate-800 rounded-lg appearance-none cursor-pointer accent-gold outline-none"
          />
          <div className="flex justify-between text-[9px] tracking-widest text-sage/60 uppercase mt-2">
            <span>Abfahrt (Hof)</span>
            <span>Ziel (Hamburg)</span>
          </div>
        </div>

        {/* Travel Info Log (Unlocks messages as train moves) */}
        <div className="mt-4 bg-slate-950/45 border border-slate-900 rounded-2xl p-4 min-h-[90px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLog.title}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-display text-xs font-semibold tracking-wider text-gold-light">
                {activeLog.title}
              </h4>
              <p className="font-sans text-xs text-sage/95 mt-1 leading-relaxed">
                {activeLog.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 2. CHECKLIST WITH COMPACT PROGRESS */}
      <div className="glass-panel gold-pulse-border p-6 rounded-3xl">
        <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-5">
          <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase flex items-center gap-2">
            <Anchor size={16} className="text-gold" />
            Hamburg-Checkliste
          </h3>

          {/* Inline circular progress saves vertical screen height */}
          <div className="relative flex items-center justify-center w-14 h-14">
            <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="transparent"
                stroke="rgba(212, 175, 55, 0.08)"
                strokeWidth="3.5"
              />
              <motion.circle
                cx="28"
                cy="28"
                r={radius}
                fill="transparent"
                stroke="url(#progressGoldCompact)"
                strokeWidth="4"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGoldCompact" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e5c158" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-display text-offwhite font-light">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Checklist items */}
        <div className="space-y-4">
          {checklistItems.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isChecked
                    ? "bg-gold/5 border-gold/40 shadow-[0_0_8px_rgba(212,175,55,0.06)]"
                    : "bg-slate-950/20 border-slate-800/80 hover:border-gold/20"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <CheckCircle className="w-5 h-5 text-gold-light fill-gold/10" />
                    </motion.div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-sage/40 flex-shrink-0 hover:border-gold/50 transition-colors" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-sans text-sm transition-all duration-300 ${
                      isChecked ? "text-sage/75 line-through font-light" : "text-offwhite font-normal"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="font-sans text-xs text-sage/60 mt-0.5 font-light truncate">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full border-t border-gold/15 pt-12 mt-16 space-y-8">
        <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-2">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-gold" />
            <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase">
              Feierabend-Ritual
            </h3>
          </div>
        </div>

        <p className="font-sans text-xs text-sage leading-relaxed font-light">
          Jeden Freitag ab 16:00 Uhr kannst du hier deine Arbeitswoche Revue passieren lassen und deine Trends dokumentieren.
        </p>

        {isFridayRitualActive ? (
          alreadyReviewed ? (
            <div className="glass-panel border border-slate-900/80 p-5 rounded-2xl text-center space-y-3">
              <span className="font-display text-[10px] tracking-widest text-gold uppercase block">
                Review abgeschlossen!
              </span>
              <p className="font-sans text-xs text-sage/75 font-light leading-relaxed">
                Du hast dein Ritual für diese Woche bereits ausgefüllt. Komm nächsten Freitag wieder! ❤️
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveReview} className="glass-panel gold-border p-5 rounded-2xl space-y-5">
              <span className="font-display text-[9px] tracking-widest text-gold uppercase block">
                Wochen-Check-In
              </span>

              {/* Stresslevel */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10.5px] tracking-wider text-sage font-light uppercase">
                  <span>Stresslevel</span>
                  <span className="text-gold font-medium">{stressScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressScore}
                  onChange={(e) => setStressScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-gold"
                />
              </div>

              {/* Erfolgsmomente */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10.5px] tracking-wider text-sage font-light uppercase">
                  <span>Erfolgsmomente</span>
                  <span className="text-gold font-medium">{successScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={successScore}
                  onChange={(e) => setSuccessScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-gold"
                />
              </div>

              {/* Team-Vibe */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10.5px] tracking-wider text-sage font-light uppercase">
                  <span>Team-Vibe</span>
                  <span className="text-gold font-medium">{vibeScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={vibeScore}
                  onChange={(e) => setVibeScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-950/30 border border-gold/30 hover:border-gold text-gold-light font-display text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-98 cursor-pointer"
              >
                Review speichern & freischalten
              </button>
            </form>
          )
        ) : (
          <div className="bg-slate-950/15 border border-slate-900/40 p-5 rounded-2xl text-center">
            <p className="font-sans text-xs text-sage/40 uppercase tracking-widest font-light">
              Ritual schaltet sich freitags ab 16:00 Uhr frei
            </p>
          </div>
        )}

        {/* Meme/Gratitude Unlock Modal */}
        <AnimatePresence>
          {showMemeUnlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel border-2 border-gold/40 p-6 rounded-2xl space-y-4 shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-gradient-to-b from-navy-light to-navy-dark relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setShowMemeUnlocked(false)}
                  className="text-sage hover:text-gold text-xs font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-gold animate-pulse" />
                <span className="font-display text-[9px] tracking-widest text-gold uppercase">
                  Wochenend-Meme unlocked
                </span>
              </div>
              
              <p className="font-sans text-xs text-sage/95 leading-relaxed italic">
                "Woche erfolgreich abgeschlossen, Xanım! 🎉 Stresslevel und Erfolgsmomente sind protokolliert. Du wächst mit jeder Herausforderung. Genieße dein verdientes Wochenende und tu dir etwas Gutes! 🥂☕️"
              </p>
              
              <div className="w-full h-32 rounded-xl bg-slate-950/50 border border-slate-900 flex flex-col items-center justify-center text-center p-4">
                <span className="text-3xl mb-2">🏝️🍹🛌</span>
                <span className="font-display text-[9px] tracking-widest text-gold uppercase">
                  OFFLINE MISSION: RELAX
                </span>
                <span className="font-sans text-[10px] text-sage/50 mt-1 font-light">
                  Keine Mails, kein Slack. Einfach ausschlafen!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weekly review stats graph */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
            <TrendingUp size={14} className="text-sage/60" />
            <span className="font-display text-[10px] tracking-widest text-sage/75 uppercase block">
              Dein Verlauf-Chart ({reviews.length} {reviews.length === 1 ? "Woche" : "Wochen"})
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-slate-950/10 border border-slate-900/30 p-8 rounded-2xl text-center">
              <p className="font-sans text-xs text-sage/35 uppercase tracking-wider font-light">
                Noch keine Verlaufswerte vorhanden
              </p>
            </div>
          ) : (
            <div className="glass-panel border border-slate-900/60 p-4 rounded-2xl space-y-4">
              {/* Custom SVG Line Chart */}
              <div className="w-full overflow-hidden flex justify-center bg-slate-950/15 rounded-xl border border-slate-950 py-2">
                <svg width={width} height={height} className="overflow-visible">
                  {/* Grid Lines */}
                  {[1, 5, 10].map((v) => (
                    <line
                      key={v}
                      x1="10"
                      y1={getY(v)}
                      x2={width - 10}
                      y2={getY(v)}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                  
                  {/* Chart Paths */}
                  {reviews.length > 1 && (
                    <>
                      {/* Stress Path (Red) */}
                      <path
                        d={getPathD("stress")}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Success Path (Gold) */}
                      <path
                        d={getPathD("success")}
                        fill="none"
                        stroke="#e5c158"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Vibe Path (Green) */}
                      <path
                        d={getPathD("vibe")}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}

                  {/* Chart Dots */}
                  {chartData.map((d, i) => (
                    <g key={i}>
                      <circle cx={getX(i)} cy={getY(d.stress)} r="3.5" fill="#ef4444" />
                      <circle cx={getX(i)} cy={getY(d.success)} r="3.5" fill="#e5c158" />
                      <circle cx={getX(i)} cy={getY(d.vibe)} r="3.5" fill="#10b981" />
                      <text
                        x={getX(i)}
                        y={height - 2}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="6"
                        fontFamily="sans-serif"
                      >
                        {d.date.substring(0, 5)}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 flex-wrap text-[9px] tracking-wider uppercase text-sage/75 font-light">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-[#ef4444] rounded-full" />
                  <span>Stress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-[#e5c158] rounded-full" />
                  <span>Erfolge</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-[#10b981] rounded-full" />
                  <span>Team-Vibe</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
