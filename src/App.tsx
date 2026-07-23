import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Splashscreen } from "./components/Splashscreen";
import { Timeline } from "./components/Timeline";
import { HamburgDashboard } from "./components/HamburgDashboard";
import { CulturalCounters } from "./components/CulturalCounters";
import { Bakery } from "./components/Bakery";
import { Countdown } from "./components/Countdown";
import { WeatherWidget } from "./components/WeatherWidget";
import { ChangelogModal } from "./components/ChangelogModal";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { KnittyPet, KnittyAccent } from "./components/KnittyPet";
import { Compass, Anchor, Coffee, Heart, Cookie, Sparkles } from "lucide-react";
import { triggerHaptic } from "./utils/haptics";
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
  const [showKnittyModal, setShowKnittyModal] = useState(false);

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

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS Safari (not standalone)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    
    const isDismissed = sessionStorage.getItem("xezri_install_dismissed");

    if (isIOS && !isStandalone && !isDismissed) {
      setShowInstallPrompt(true);
    }
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

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    triggerHaptic(12); // Short gentle vibe tap
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
                  {timeMode === "default" && "Willkommen, Xanım! ✨"}
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
                    <Timeline items={config.timeline} onOpenKnitty={() => setShowKnittyModal(true)} />
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
                    <HamburgDashboard checklistItems={config.hamburgChecklist} onOpenKnitty={() => setShowKnittyModal(true)} />
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
                      onOpenKnitty={() => setShowKnittyModal(true)}
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
                    <Bakery onOpenKnitty={() => setShowKnittyModal(true)} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* App Footer Version Tag */}
              <div className="mt-12 text-center select-none">
                <span className="font-display text-[10px] tracking-widest text-sage/40 uppercase">
                  Xəzri PWA • v{config.appVersion}
                </span>
              </div>
            </main>

            {/* Floating iOS Bottom Navigation Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40">
              <div className="bg-navy-dark/95 backdrop-blur-lg border border-gold/30 shadow-[0_12px_35px_rgba(0,0,0,0.6)] rounded-full px-3 py-3 flex items-center justify-around relative">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
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
                          isActive ? "text-gold-light" : "text-sage/80"
                        }`}
                      />
                      <span
                        className={`font-display text-[9px] tracking-widest uppercase mt-1 transition-colors duration-300 ${
                          isActive ? "text-offwhite font-semibold" : "text-sage/65"
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

      {/* iOS PWA Installation Guide Overlay */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 p-5 rounded-2xl bg-navy-dark/95 border border-gold/45 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md text-center space-y-4"
          >
            <div className="flex justify-between items-start">
              <span className="font-display text-[9px] tracking-widest text-gold uppercase block text-left">
                PWA App installieren 📲
              </span>
              <button 
                onClick={() => {
                  sessionStorage.setItem("xezri_install_dismissed", "true");
                  setShowInstallPrompt(false);
                }} 
                className="text-sage/60 hover:text-gold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="font-sans text-xs text-sage/95 text-left leading-relaxed">
              Installiere <strong>Xəzri</strong> als App auf deinem iPhone, um alle Widgets offline zu nutzen und sie direkt auf deinem Homescreen zu starten!
            </p>

            <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-900/60 text-[11px] text-sage/90 text-left space-y-2 font-light">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px]">1</span>
                <span>Tippe unten in Safari auf den <strong>Teilen-Button</strong> (Share-Icon 📤).</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px]">2</span>
                <span>Wähle im Menü <strong>„Zum Home-Bildschirm“</strong> (Add to Home Screen ➕).</span>
              </div>
            </div>

            <button
              onClick={() => {
                sessionStorage.setItem("xezri_install_dismissed", "true");
                setShowInstallPrompt(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gold text-navy-dark font-display text-[10px] tracking-widest uppercase font-semibold transition-colors hover:bg-gold-light active:scale-95 cursor-pointer"
            >
              Verstanden
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Service Worker Update Banner & Changelog Modal */}
      <UpdatePrompt version={config.appVersion} />
      <ChangelogModal version={config.appVersion} changelog={config.changelog} />

      {/* Floating Knitty Quick-Access Pet Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          triggerHaptic(15);
          setShowKnittyModal(true);
        }}
        className="fixed bottom-24 right-5 z-40 w-12 h-12 rounded-full bg-navy-dark/95 border-2 border-gold/60 shadow-[0_4px_20px_rgba(212,175,55,0.35)] backdrop-blur-md flex items-center justify-center cursor-pointer group"
        aria-label="Knitty Pet öffnen"
      >
        <KnittyAccent size={28} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border border-navy-dark flex items-center justify-center text-[9px] font-bold text-navy-dark animate-pulse">
          🧶
        </div>
      </motion.button>

      {/* Knitty Pet Fullscreen/Modal Overlay */}
      <AnimatePresence>
        {showKnittyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/95 backdrop-blur-md px-6 cursor-pointer"
            onClick={() => setShowKnittyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full cursor-default"
            >
              <KnittyPet onClose={() => setShowKnittyModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
