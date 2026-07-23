import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Cookie, RotateCcw, Heart, Sparkles, ChefHat, Star, Trash2 } from "lucide-react";
import { KnittyBaker } from "./KnittyPet";

interface BakeryProps {
  onOpenKnitty?: () => void;
}

interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

const ALL_INGREDIENTS: Ingredient[] = [
  { id: "mehl", name: "Mehl", emoji: "🌾", color: "from-slate-200 to-slate-400" },
  { id: "sauerrahm", name: "Sauerrahm", emoji: "🥛", color: "from-sky-100 to-sky-300" },
  { id: "kardamom", name: "Kardamom", emoji: "🌱", color: "from-green-600 to-emerald-700" },
  { id: "walnuesse", name: "Walnüsse", emoji: "🌰", color: "from-amber-700 to-yellow-800" },
  { id: "safran", name: "Safran", emoji: "🌺", color: "from-red-500 to-orange-600" },
  { id: "honigsirup", name: "Honigsirup", emoji: "🍯", color: "from-yellow-400 to-amber-500" },
];

const RECIPES = {
  shekerbura: {
    name: "Şəkərbura",
    description: "Ein halbmondförmiges Gebäck, kunstvoll mit einem traditionellen Weizenähren-Muster verziert und mit süßen Mandeln & Kardamom gefüllt.",
    required: ["mehl", "sauerrahm", "kardamom"],
    unlockMessage: "Du bist einfach fantastisch! ❤️ Deine Backkünste bringen ein Stück Heimat und pure Wärme in meine Welt. Danke für all das leckere Gebäck, das du je für mich gezaubert hast! Ich bin so unglaublich stolz auf dich und deinen Erfolg in Hamburg. Lass uns bald wieder zusammen backen!",
  },
  pakhlava: {
    name: "Paxlava",
    description: "Ein prachtvolles Schichtgebäck aus feinsten Teigblättern, gefüllt mit gehackten Walnüssen, getränkt in Safran-Honigsirup und verziert mit einer Nuss.",
    required: ["walnuesse", "safran", "honigsirup"],
    unlockMessage: "Deine Geduld und Liebe zum Detail sieht man nicht nur an deiner perfekten Paxlava, sondern an allem, was du tust! 🌟 Du hast mit derselben Sorgfalt und Stärke deinen Weg nach Hamburg gemeistert. Danke, dass es dich gibt, und danke für die süßen Genussmomente mit dir!",
  },
};

type PastryType = "shekerbura" | "pakhlava";
type GameStage = "select" | "ingredients" | "baking" | "success";

export function Bakery({ onOpenKnitty }: BakeryProps = {}) {
  const [stage, setStage] = useState<GameStage>("select");
  const [selectedPastry, setSelectedPastry] = useState<PastryType | null>(null);
  const [mixedIngredients, setMixedIngredients] = useState<string[]>([]);
  const [wobblingIngredient, setWobblingIngredient] = useState<string | null>(null);
  const [bakingStep, setBakingStep] = useState<string>("");
  
  // Franzbrötchen-Journal State
  interface JournalEntry {
    id: string;
    bakeryName: string;
    rating: number;
    notes: string;
    date: string;
  }

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("xezri_franz_journal");
    return saved ? JSON.parse(saved) : [];
  });

  const [newBakeryName, setNewBakeryName] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    localStorage.setItem("xezri_franz_journal", JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleAddJournalEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!newBakeryName.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      bakeryName: newBakeryName.trim(),
      rating: newRating,
      notes: newNotes.trim(),
      date: new Date().toLocaleDateString("de-DE"),
    };

    setJournalEntries((prev) => [entry, ...prev]);
    setNewBakeryName("");
    setNewRating(5);
    setNewNotes("");

    // confettis for saving rating
    confetti({
      particleCount: 20,
      spread: 30,
      colors: ["#d4af37", "#e5c158"],
      disableForReducedMotion: true
    });
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((entry) => entry.id !== id));
  };
  const [bakingProgress, setBakingProgress] = useState(0);

  // Trigger error shake animation
  const triggerErrorWobble = (id: string) => {
    setWobblingIngredient(id);
    setTimeout(() => setWobblingIngredient(null), 600);
  };

  const handleSelectPastry = (type: PastryType) => {
    setSelectedPastry(type);
    setMixedIngredients([]);
    setStage("ingredients");
  };

  const handleAddIngredient = (id: string) => {
    if (!selectedPastry) return;
    const recipe = RECIPES[selectedPastry];

    // Check if ingredient is needed for this pastry
    if (recipe.required.includes(id)) {
      if (mixedIngredients.includes(id)) return; // already added
      
      const updated = [...mixedIngredients, id];
      setMixedIngredients(updated);

      // Trigger mini spark confetti
      confetti({
        particleCount: 15,
        spread: 30,
        origin: { y: 0.6 },
        colors: ["#e5c158", "#d4af37"],
        disableForReducedMotion: true,
      });

      // If all required ingredients are added, trigger baking phase automatically or let them click
    } else {
      // Wrong ingredient!
      triggerErrorWobble(id);
    }
  };

  // Check if all correct ingredients are added
  const isBowlComplete = selectedPastry 
    ? RECIPES[selectedPastry].required.every(ing => mixedIngredients.includes(ing))
    : false;

  const startBakingAnimation = () => {
    setStage("baking");
    setBakingProgress(0);

    const steps = [
      { text: "Kneten des feinen Teigs...", duration: 1500 },
      { text: selectedPastry === "shekerbura" ? "Muster mit Maggash-Pinzette sticken..." : "Schichten falten & mit Safran bepinseln...", duration: 1500 },
      { text: "Im Ofen goldgelb backen...", duration: 1500 }
    ];

    let currentStepIndex = 0;
    setBakingStep(steps[currentStepIndex].text);

    // Progress interval
    const intervalTime = 45; // total time is ~4500ms
    const timer = setInterval(() => {
      setBakingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Transition step text based on progress percentages
        const nextProgress = prev + 1;
        if (nextProgress > 33 && currentStepIndex === 0) {
          currentStepIndex = 1;
          setBakingStep(steps[1].text);
        } else if (nextProgress > 66 && currentStepIndex === 1) {
          currentStepIndex = 2;
          setBakingStep(steps[2].text);
        }

        return nextProgress;
      });
    }, intervalTime);

    // End baking
    setTimeout(() => {
      setStage("success");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#e5c158", "#b8860b", "#f8fafc"],
        gravity: 0.8,
        disableForReducedMotion: true,
      });
    }, 4700);
  };

  const handleReset = () => {
    setSelectedPastry(null);
    setMixedIngredients([]);
    setStage("select");
    setBakingProgress(0);
  };

  return (
    <section className="py-12 px-4 md:px-8 w-full max-w-lg mx-auto space-y-8">
      {/* Header */}
      <div className="text-center flex flex-col items-center">
        <h2 className="font-display text-2xl font-light tracking-[0.2em] uppercase gold-gradient-text gold-text-glow flex items-center justify-center gap-2">
          <ChefHat className="text-gold animate-bounce" size={24} />
          Die digitale Bäckerei
        </h2>
        <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-3 mb-4" />
        <KnittyBaker onClick={onOpenKnitty} />
        <p className="font-sans text-xs tracking-wider text-sage mt-3">
          Ein Bereich für deine Back-Erfolge & eine süße Überraschung
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STAGE 1: CHOOSE PASTRY */}
        {stage === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <p className="font-sans text-sm text-sage text-center leading-relaxed">
              Wähle eine aserbaidschanische Spezialität aus, um die Back-Mission zu starten:
            </p>

            <div className="grid grid-cols-2 gap-4">
              
              {/* Shekerbura Card */}
              <div
                onClick={() => handleSelectPastry("shekerbura")}
                className="glass-panel gold-border hover:border-gold/60 p-5 rounded-3xl cursor-pointer flex flex-col items-center text-center transition-all duration-300 hover:scale-102 group"
              >
                <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🌙</span>
                </div>
                <h3 className="font-display text-base font-normal tracking-wide text-offwhite">
                  Şəkərbura
                </h3>
                <p className="font-sans text-[11px] text-sage/75 mt-2 leading-relaxed">
                  Halbmond mit Mandelfüllung und Ährenmuster.
                </p>
              </div>

              {/* Pakhlava Card */}
              <div
                onClick={() => handleSelectPastry("pakhlava")}
                className="glass-panel gold-border hover:border-gold/60 p-5 rounded-3xl cursor-pointer flex flex-col items-center text-center transition-all duration-300 hover:scale-102 group"
              >
                <div className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🔶</span>
                </div>
                <h3 className="font-display text-base font-normal tracking-wide text-offwhite">
                  Paxlava
                </h3>
                <p className="font-sans text-[11px] text-sage/75 mt-2 leading-relaxed">
                  Schichtgebäck mit Walnüssen & Safranguss.
                </p>
              </div>

            </div>
          </motion.div>
        )}

        {/* STAGE 2: INGREDIENTS GATHERING */}
        {stage === "ingredients" && selectedPastry && (
          <motion.div
            key="ingredients"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Selected recipe reminder */}
            <div className="glass-panel gold-border p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display text-xs tracking-widest text-gold uppercase">
                  Rezept: {RECIPES[selectedPastry].name}
                </span>
                <button onClick={handleReset} className="text-sage/60 hover:text-gold text-[10px] uppercase tracking-widest flex items-center gap-1">
                  <RotateCcw size={10} /> Zurück
                </button>
              </div>
              <p className="font-sans text-xs text-sage/90 leading-relaxed mt-1">
                {RECIPES[selectedPastry].description}
              </p>
            </div>

            {/* Mixing Bowl Visualizer */}
            <div className="relative h-44 w-full bg-slate-950/20 border border-slate-900 rounded-3xl flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.02),transparent_60%)]" />
              
              {/* Bowl Outer Shell */}
              <div className="w-36 h-20 border-b-4 border-x-2 border-gold/45 rounded-b-[4.5rem] bg-navy-light/45 relative flex items-center justify-center gap-1.5 px-4 shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold/30" />
                
                {/* Floating ingredients inside the bowl */}
                <AnimatePresence>
                  {mixedIngredients.map((ingId) => {
                    const ing = ALL_INGREDIENTS.find(i => i.id === ingId);
                    if (!ing) return null;
                    return (
                      <motion.div
                        key={ing.id}
                        initial={{ y: -60, opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      >
                        {ing.emoji}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {mixedIngredients.length === 0 && (
                  <span className="font-sans text-[10px] tracking-wider text-sage/40 uppercase absolute top-6">
                    Mischschüssel leer
                  </span>
                )}
              </div>

              {/* Progress Tracker dots */}
              <div className="flex gap-2 mt-4 z-10">
                {RECIPES[selectedPastry].required.map((reqId) => {
                  const isAdded = mixedIngredients.includes(reqId);
                  return (
                    <div
                      key={reqId}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isAdded ? "bg-gold scale-110 shadow-[0_0_8px_#d4af37]" : "bg-slate-800"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Ingredient Shelf (Grid) */}
            <div className="space-y-3">
              <span className="font-display text-[10px] tracking-widest text-sage/75 uppercase block text-center">
                Zutaten-Regal (Wähle die richtigen für {RECIPES[selectedPastry].name})
              </span>
              
              <div className="grid grid-cols-3 gap-3">
                {ALL_INGREDIENTS.map((ing) => {
                  const isAdded = mixedIngredients.includes(ing.id);
                  const isWobbling = wobblingIngredient === ing.id;

                  return (
                    <motion.button
                      key={ing.id}
                      onClick={() => handleAddIngredient(ing.id)}
                      disabled={isAdded}
                      animate={isWobbling ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isAdded
                          ? "bg-gold/5 border-gold/25 opacity-30 cursor-default"
                          : isWobbling
                          ? "border-red-500/80 bg-red-950/15"
                          : "bg-slate-950/20 border-slate-900/80 hover:border-gold/30 active:scale-95"
                      }`}
                    >
                      <span className="text-2xl">{ing.emoji}</span>
                      <span className="font-sans text-xs text-offwhite font-light">
                        {ing.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bake Button Trigger */}
            <AnimatePresence>
              {isBowlComplete && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={startBakingAnimation}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-light text-navy-dark font-display font-medium text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-102 transition-transform duration-300 active:scale-98"
                >
                  <Cookie size={14} />
                  Kneten & Backen!
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STAGE 3: BAKING STEP PROGRESS BAR */}
        {stage === "baking" && (
          <motion.div
            key="baking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8 flex flex-col items-center justify-center space-y-6"
          >
            {/* Shimmering oven visual */}
            <div className="w-24 h-24 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center relative overflow-hidden animate-pulse">
              <span className="text-4xl animate-bounce">🔥</span>
              {/* Spinning gold glow */}
              <div className="absolute inset-0 border border-t-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-display text-sm font-semibold tracking-wider text-gold-light">
                {bakingStep}
              </h3>
              <p className="font-sans text-[10px] tracking-widest text-sage/60 uppercase">
                Fortschritt: {bakingProgress}%
              </p>
            </div>

            {/* Progress bar container */}
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                style={{ width: `${bakingProgress}%` }}
                className="h-full bg-gradient-to-r from-gold to-gold-light shadow-[0_0_8px_rgba(212,175,55,0.6)]"
              />
            </div>
          </motion.div>
        )}

        {/* STAGE 4: SUCCESS AND MESSAGE UNLOCKED */}
        {stage === "success" && selectedPastry && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Display Baked Product */}
            <div className="flex flex-col items-center justify-center p-5 bg-slate-950/20 rounded-3xl border border-slate-900/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_60%)]" />

              <span className="font-display text-[10px] tracking-widest text-gold uppercase mb-3">
                Mission Erfolgreich!
              </span>

              {/* Vector representation of Shekerbura or Pakhlava */}
              <div className="relative w-36 h-36 flex items-center justify-center mb-2 filter drop-shadow-[0_0_12px_rgba(229,193,88,0.3)]">
                {selectedPastry === "shekerbura" ? (
                  // Shekerbura SVG Crescent
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                    <path
                      d="M 15 50 C 15 25, 45 15, 80 20 C 65 35, 60 65, 80 80 C 45 85, 15 75, 15 50 Z"
                      fill="url(#pastryGoldGrad)"
                      stroke="#d4af37"
                      strokeWidth="2.5"
                    />
                    {/* Diagonal patterns representing Maggash embroidery */}
                    <path d="M 25 45 Q 35 35 48 30 M 23 55 Q 38 48 55 42 M 28 65 Q 45 58 60 52 M 40 73 Q 53 65 65 60" stroke="#b8860b" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Powder sparkles */}
                    <circle cx="35" cy="40" r="1" fill="#fff" opacity="0.8" />
                    <circle cx="50" cy="50" r="1.2" fill="#fff" opacity="0.8" />
                    <circle cx="30" cy="58" r="0.8" fill="#fff" opacity="0.6" />
                    
                    <defs>
                      <linearGradient id="pastryGoldGrad" x1="15" y1="20" x2="80" y2="80">
                        <stop offset="0%" stopColor="#f4e0ad" />
                        <stop offset="70%" stopColor="#e5c158" />
                        <stop offset="100%" stopColor="#b8860b" />
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  // Pakhlava SVG Diamond
                  <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                    {/* Diamond base */}
                    <polygon
                      points="50,10 85,50 50,90 15,50"
                      fill="url(#paxGoldGrad)"
                      stroke="#d4af37"
                      strokeWidth="2.5"
                    />
                    {/* Walnut half in center */}
                    <circle cx="50" cy="50" r="10" fill="#8b4513" stroke="#5c2e0b" strokeWidth="1.5" />
                    <path d="M 47 48 Q 50 45 53 48 M 46 52 Q 50 55 54 52 M 50 40 L 50 60" stroke="#3d1f07" strokeWidth="1" />
                    {/* Shiny glaze reflection */}
                    <path d="M 30 35 L 45 20 M 70 65 L 55 80" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2.5" strokeLinecap="round" />
                    
                    <defs>
                      <linearGradient id="paxGoldGrad" x1="50" y1="10" x2="50" y2="90">
                        <stop offset="0%" stopColor="#e5c158" />
                        <stop offset="50%" stopColor="#d4af37" />
                        <stop offset="100%" stopColor="#8b4513" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>

              <span className="font-display text-lg font-light text-offwhite tracking-wide">
                Deine frische {RECIPES[selectedPastry].name}
              </span>
            </div>

            {/* Secret message letter from the developer */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="glass-panel border-2 border-gold/40 p-6 rounded-3xl relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-gradient-to-b from-navy-light to-navy-dark"
            >
              {/* Decorative top stamp/seal */}
              <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-gold/25 bg-gold/5">
                <Heart size={14} className="text-gold fill-gold/10" />
              </div>

              <div className="flex items-center gap-2 mb-4 border-b border-gold/10 pb-3">
                <Sparkles size={14} className="text-gold-light" />
                <span className="font-display text-xs tracking-widest text-gold uppercase font-medium">
                  Persönlicher Brief freigeschaltet
                </span>
              </div>

              <p className="font-sans text-sm font-light leading-relaxed text-sage/95 italic">
                "{RECIPES[selectedPastry].unlockMessage}"
              </p>

              <div className="mt-5 text-right font-display text-xs tracking-widest text-gold uppercase">
                — Von Herzen ❤️
              </div>
            </motion.div>

            {/* Restart button */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gold/30 hover:border-gold/60 text-gold-light font-display text-xs tracking-widest uppercase hover:scale-[1.02] transition-transform duration-300"
            >
              <RotateCcw size={14} />
              Nochmal backen
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Franzbrötchen-Journal section */}
      <div className="w-full border-t border-gold/15 pt-8 mt-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-gold/10 pb-3 mb-2">
          <Cookie size={16} className="text-gold" />
          <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase">
            Franzbrötchen-Journal
          </h3>
        </div>

        <p className="font-sans text-xs text-sage leading-relaxed font-light">
          Da du gerne backst, wirst du an Hamburgs Kultgebäck nicht vorbeikommen. Dokumentiere hier deine Entdeckungen und Bäckereien!
        </p>

        {/* Rating Form */}
        <form onSubmit={handleAddJournalEntry} className="glass-panel gold-border p-5 rounded-2xl space-y-4">
          <span className="font-display text-[9px] tracking-widest text-gold uppercase block">
            Neuen Testbericht hinzufügen
          </span>
          
          <div>
            <label className="block text-[10px] tracking-wider text-sage uppercase mb-1 font-light">
              Bäckerei Name
            </label>
            <input
              type="text"
              required
              placeholder="z.B. Bäckerei Luise oder Mutterland"
              value={newBakeryName}
              onChange={(e) => setNewBakeryName(e.target.value)}
              className="w-full bg-slate-950/45 border border-slate-900/60 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-gold/40"
            />
          </div>

          {/* Star Rating Select */}
          <div>
            <label className="block text-[10px] tracking-wider text-sage uppercase mb-1 font-light">
              Bewertung
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="transition-transform active:scale-90 cursor-pointer"
                >
                  <Star
                    size={18}
                    className={
                      star <= newRating 
                        ? "text-gold fill-gold/80" 
                        : "text-slate-700 hover:text-gold/45"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-wider text-sage uppercase mb-1 font-light">
              Deine Notizen
            </label>
            <textarea
              placeholder="z.B. Super zimtig, fluffiger Teig, etwas zu fettig..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-950/45 border border-slate-900/60 rounded-xl px-3 py-2 text-xs text-offwhite focus:outline-none focus:border-gold/40 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-950/30 border border-gold/30 hover:border-gold text-gold-light font-display text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-98 cursor-pointer"
          >
            Bericht speichern
          </button>
        </form>

        {/* Rating List */}
        <div className="space-y-4">
          <span className="font-display text-[10px] tracking-widest text-sage/75 uppercase block">
            Deine Verkostungen ({journalEntries.length})
          </span>

          {journalEntries.length === 0 ? (
            <div className="bg-slate-950/15 border border-slate-900/40 p-6 rounded-2xl text-center">
              <p className="font-sans text-xs text-sage/40 uppercase tracking-wider">
                Noch keine Einträge vorhanden
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="glass-panel border border-slate-900/80 p-4 rounded-xl relative flex justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display text-xs font-semibold text-offwhite truncate">
                        {entry.bakeryName}
                      </h4>
                      <span className="text-[9px] text-sage/55 font-light">
                        {entry.date}
                      </span>
                    </div>

                    {/* Render stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={
                            i < entry.rating 
                              ? "text-gold fill-gold" 
                              : "text-slate-800"
                          }
                        />
                      ))}
                    </div>

                    {entry.notes && (
                      <p className="font-sans text-xs text-sage leading-relaxed break-words font-light">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteJournalEntry(entry.id)}
                    className="text-sage/40 hover:text-red-500/80 self-start p-1 transition-colors duration-200 cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
