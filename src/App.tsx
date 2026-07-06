import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Splashscreen } from "./components/Splashscreen";
import { Timeline } from "./components/Timeline";
import { HamburgDashboard } from "./components/HamburgDashboard";
import { CulturalCounters } from "./components/CulturalCounters";
import { Bakery } from "./components/Bakery";
import { Countdown } from "./components/Countdown";
import { WeatherWidget } from "./components/WeatherWidget";
import { Compass, Anchor, Coffee, Heart, Cookie, Sparkles } from "lucide-react";
import configData from "./config.json";
import type { AppConfig } from "./types";
import confetti from "canvas-confetti";

const config = configData as AppConfig;

type TabType = "story" | "hamburg" | "desk" | "bakery";

const BOOSTER_MESSAGES = [
  "Vergiss nie: Du hast den großen Schritt gewagt und bist von Baku über Salzburg bis nach Hamburg gezogen. Du bist mutig, selbstständig und stehst auf eigenen Beinen! 💪❤️",
  "Lass das Imposter-Syndrom keine Sekunde gewinnen! Du hast diesen Job bekommen, weil du brillant bist. Hamburg kann stolz sein, dich zu haben! ✨",
  "Atme tief durch. Jeder anstrengende Arbeitstag geht vorbei. Mach eine Atempause, koch dir einen Armudu-Tee. Du rockst das! ⚓☕",
  "Deine Backkünste sind meisterhaft – und genau mit dieser Hingabe und Stärke meisterst du diesen Job. Ich glaube fest an dich! 🌟",
  "Du bist stärker als jede stressige Phase. Dein Ehrgeiz hat dich von Baku aus in den Norden gebracht. Nichts kann dich aufhalten! ❤️"
];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("hamburg");
  const [showBooster, setShowBooster] = useState(false);
  const [activeBoosterMsg, setActiveBoosterMsg] = useState("");
  const [timeMode, setTimeMode] = useState<"morning" | "night" | "default">("default");

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 11) {
        setTimeMode("morning");
      } else if (hour >= 21 || hour < 6) {
        setTimeMode("night");
      } else {
        setTimeMode("default");
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerBooster = () => {
    let nextMsg = activeBoosterMsg;
    while (nextMsg === activeBoosterMsg) {
      nextMsg = BOOSTER_MESSAGES[Math.floor(Math.random() * BOOSTER_MESSAGES.length)];
    }
    setActiveBoosterMsg(nextMsg);
    setShowBooster(true);
    
    // Gentle spark confetti
    confetti({
      particleCount: 18,
      spread: 30,
      origin: { y: 0.15 },
      colors: ["#d4af37", "#e5c158"],
      disableForReducedMotion: true
    });
  };

  // Tab definitions (4 elegant items for navigation)
  const tabs = [
    { id: "story", label: "Story", icon: Compass },
    { id: "hamburg", label: "Hamburg", icon: Anchor },
    { id: "desk", label: "Desk & Tee", icon: Coffee },
    { id: "bakery", label: "Bäckerei", icon: Cookie },
  ] as const;

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <Splashscreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`flex flex-col min-h-svh text-offwhite pb-28 transition-colors duration-1000 ${
              timeMode === "morning"
                ? "bg-gradient-to-b from-[#0e1c1b] to-[#0b132b]"
                : timeMode === "night"
                ? "bg-gradient-to-b from-[#05070f] to-[#090b14]"
                : "bg-navy-dark"
            }`}
          >
            {/* Top Status Bar Padding & Subtle Header */}
            <header className="pt-8 pb-4 px-6 border-b border-gold/10 glass-panel sticky top-0 z-30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-display text-lg font-light tracking-[0.25em] uppercase gold-gradient-text gold-text-glow">
                  Xəzri
                </span>
                <span className="text-[9px] tracking-widest text-sage/60 uppercase">
                  {timeMode === "morning" && "Sabahın xeyir, Xanım! ☀️"}
                  {timeMode === "night" && "Gecən xeyrə qalsın, Xanım! 🌙"}
                  {timeMode === "default" && "Hamburg Abenteuer"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Confidence Booster Trigger */}
                <button
                  onClick={handleTriggerBooster}
                  className="p-2 rounded-full border border-gold/15 bg-gold/5 text-gold-light hover:border-gold/30 active:scale-95 transition-all duration-300 cursor-pointer shadow-[0_0_8px_rgba(212,175,55,0.05)]"
                >
                  <Sparkles size={14} className="animate-pulse" />
                </button>
                
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart size={16} className="text-gold/80 fill-gold/10" />
                </motion.div>
              </div>
            </header>

            {/* Weather & Distance Widget */}
            <WeatherWidget />

            {/* Persistent Top Countdown Widget (Hidden in Story Timeline & Bakery to keep screens spacious) */}
            <AnimatePresence>
              {activeTab !== "story" && activeTab !== "bakery" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Countdown targetDateStr={config.nextMeetingDate} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-md mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === "story" && (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Timeline items={config.timeline} />
                  </motion.div>
                )}

                {activeTab === "hamburg" && (
                  <motion.div
                    key="hamburg"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HamburgDashboard checklistItems={config.hamburgChecklist} />
                  </motion.div>
                )}

                {activeTab === "desk" && (
                  <motion.div
                    key="desk"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CulturalCounters
                      firstWorkDay={config.firstWorkDay}
                      whatsappNumber={config.whatsappNumber}
                      whatsappText={config.whatsappText}
                      developerEmail={config.developerEmail}
                      timeMode={timeMode}
                    />
                  </motion.div>
                )}

                {activeTab === "bakery" && (
                  <motion.div
                    key="bakery"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Bakery />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Floating iOS Bottom Navigation Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40">
              <div className="glass-panel gold-border shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-full px-3 py-3 flex items-center justify-around relative">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative flex flex-col items-center justify-center py-1.5 px-2.5 z-10 transition-colors duration-300 min-w-[70px]"
                    >
                      {/* Active Background Bubble Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-gold/10 rounded-full border border-gold/25 -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      <Icon
                        size={18}
                        className={`transition-colors duration-300 ${
                          isActive ? "text-gold-light" : "text-sage/60"
                        }`}
                      />
                      <span
                        className={`font-display text-[9px] tracking-widest uppercase mt-1 transition-colors duration-300 ${
                          isActive ? "text-offwhite font-medium" : "text-sage/50"
                        }`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confidence Booster Fullscreen Overlay */}
            <AnimatePresence>
              {showBooster && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowBooster(false)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/95 backdrop-blur-md px-6 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_60%)] pointer-events-none" />
                  
                  <motion.div
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 10 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="glass-panel border-2 border-gold/40 p-8 rounded-3xl max-w-sm w-full relative overflow-hidden text-center shadow-[0_0_30px_rgba(212,175,55,0.18)] cursor-pointer"
                  >
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-gold/5 rounded-full filter blur-xl" />
                    
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center mb-5">
                        <Sparkles className="text-gold animate-pulse" size={20} />
                      </div>
                      
                      <h3 className="font-display text-sm font-light tracking-[0.2em] text-gold uppercase mb-4">
                        Confidence Booster
                      </h3>
                      
                      <div className="w-8 h-[1px] bg-gold/30 mb-5" />
                      
                      <p className="font-sans text-sm font-light leading-relaxed text-sage/95 italic px-2">
                        "{activeBoosterMsg}"
                      </p>
                      
                      <div className="w-8 h-[1px] bg-gold/30 mt-6 mb-5" />
                      
                      <p className="font-sans text-[9px] tracking-widest text-sage/40 uppercase">
                        Tippen, um zu schließen
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
