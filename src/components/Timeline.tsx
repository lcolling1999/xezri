import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import type { Milestone } from "../types";
import confetti from "canvas-confetti";
import { Ticket, Gift, CheckCircle } from "lucide-react";
import { DailyFragments } from "./DailyFragments";
import configData from "../config.json";

interface TimelineProps {
  items: Milestone[];
}

const AZ_WORDS = [
  { word: "Ürək", pron: "[y-ræk]", trans: "Herz", desc: "Dein Herz ist dein stärkster Kompass. Folge ihm weiter, so wie auf deinem Weg von Baku über Salzburg nach Hamburg. ❤️" },
  { word: "Dözüm", pron: "[dœ-zym]", trans: "Ausdauer / Stärke", desc: "Dein unerschütterliches Durchhaltevermögen hat dich all die Hürden meistern lassen. Du bist unglaublich stark! 💪" },
  { word: "Uğur", pron: "[u-gur]", trans: "Erfolg", desc: "Erfolg gehört den Mutigen, die neue Wege wagen. Du rockst deinen Hamburger Job und verdienst jeden Erfolg! 🌟" },
  { word: "Sevgi", pron: "[sev-gi]", trans: "Liebe", desc: "Alles, was du mit Hingabe und Liebe tust (wie dein fabelhaftes Backen), verzaubert die Menschen um dich herum. ✨" },
  { word: "Külək", pron: "[cy-læk]", trans: "Wind", desc: "Nutze den Wind der Veränderung in Hamburg als frischen Antrieb für all deine neuen Träume. ⚓" },
  { word: "Gözəl", pron: "[gœ-zæl]", trans: "Wunderschön", desc: "Deine herzliche Art und dein Lächeln machen jeden Tag in deiner neuen Heimat zu etwas Besonderem. 🌸" }
];

export const Timeline = ({ items }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for the vertical golden line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  const dailyIndex = new Date().getDate() % AZ_WORDS.length;
  const dailyWord = AZ_WORDS[dailyIndex];

  // Voucher states
  interface Voucher {
    id: string;
    title: string;
    description: string;
    emoji: string;
    notes: string;
  }

  const VOUCHERS: Voucher[] = [
    {
      id: "brunch",
      title: "Sonntagsbrunch in Hamburg",
      description: "Der Sonntagsbrunch geht auf mich! Wir schlemmen uns gemütlich durch ein feines Hamburger Café deiner Wahl. 🥞🥐",
      emoji: "🥞",
      notes: "Gültig für reichlich Franzbrötchen, frischen Kaffee und Alster-Ausblicke."
    },
    {
      id: "kochabend",
      title: "Gemeinsamer Kochabend",
      description: "Ich koche dein Lieblingsgericht! Oder wir backen etwas zusammen (ich mache natürlich den Abwasch!). 🍝🍰",
      emoji: "🍝",
      notes: "Freie Wahl des Gerichts. Inklusive leckerem Aperitif."
    },
    {
      id: "kaffee",
      title: "Alster Kaffee-Date",
      description: "Ein ausgiebiger Spaziergang um die Alster mit Kaffee, Tee und stundenlangen tiefgründigen Gesprächen. ☕️🍂",
      emoji: "☕️",
      notes: "Perfekt für einen frischen Hamburger Nachmittag bei einer leichten Elbbrise."
    }
  ];

  const [revealedVouchers, setRevealedVouchers] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("xezri_vouchers_revealed");
    return saved ? JSON.parse(saved) : {};
  });

  const [redeemedVouchers, setRedeemedVouchers] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("xezri_vouchers_redeemed");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("xezri_vouchers_revealed", JSON.stringify(revealedVouchers));
  }, [revealedVouchers]);

  useEffect(() => {
    localStorage.setItem("xezri_vouchers_redeemed", JSON.stringify(redeemedVouchers));
  }, [redeemedVouchers]);

  const handleReveal = (id: string) => {
    if (revealedVouchers[id]) return;
    setRevealedVouchers((prev) => ({ ...prev, [id]: true }));
    
    confetti({
      particleCount: 15,
      spread: 30,
      colors: ["#d4af37", "#e5c158"],
      disableForReducedMotion: true
    });
  };

  const handleRedeem = (id: string) => {
    if (redeemedVouchers[id]) return;
    const today = new Date().toLocaleDateString("de-DE");
    setRedeemedVouchers((prev) => ({ ...prev, [id]: today }));

    confetti({
      particleCount: 40,
      spread: 50,
      colors: ["#d4af37", "#e5c158", "#ffffff"],
      disableForReducedMotion: true
    });
  };

  return (
    <section ref={containerRef} className="relative py-16 px-4 md:px-8 w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="font-display text-2xl font-light tracking-[0.2em] uppercase gold-gradient-text gold-text-glow">
          Deine Story
        </h2>
        <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-3" />
        <p className="font-sans text-xs tracking-wider text-sage mt-2">
          Dein Weg und Durchhaltevermögen bis nach Hamburg
        </p>
      </div>

      {/* Azerbaijani Word of the Day Card */}
      <div className="glass-panel gold-border p-5 rounded-3xl mb-12 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />
        <span className="font-display text-[9px] tracking-widest text-gold uppercase block mb-1">
          Aserbaidschanische Weisheit • Word of the Day
        </span>
        
        <h4 className="font-display text-2xl font-light text-offwhite gold-text-glow mt-2">
          {dailyWord.word}
        </h4>
        <span className="font-sans text-[10px] text-sage/60 tracking-wider block mt-0.5">
          {dailyWord.pron} • Übersetzung: "{dailyWord.trans}"
        </span>
        
        <div className="w-8 h-[1px] bg-gold/30 mx-auto my-3.5" />
        
        <p className="font-sans text-xs text-sage/95 leading-relaxed px-2 font-light italic">
          "{dailyWord.desc}"
        </p>
      </div>

      {/* Daily Fragments Calendar */}
      <div className="mb-12">
        <DailyFragments firstWorkDay={configData.firstWorkDay} />
      </div>

      {/* Timeline Path Container */}
      <div className="relative">
        {/* Static Background Line */}
        <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-slate-800" />
        
        {/* Animated Golden Line */}
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold-light via-gold to-yellow-600 shadow-[0_0_8px_rgba(212,175,55,0.6)]"
        />

        {/* Milestones */}
        <div className="space-y-12">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-2 z-10 -translate-x-1/2 flex items-center justify-center">
                {/* Outer ring */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 150 }}
                  className="w-5 h-5 rounded-full bg-navy-dark border border-gold flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                >
                  {/* Inner dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-light" />
                </motion.div>
              </div>

              {/* Milestone Card */}
              <div className="glass-panel gold-pulse-border p-6 rounded-2xl relative overflow-hidden">
                {/* Soft gradient background highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />

                {/* Date Header */}
                <span className="font-display text-xs font-semibold tracking-widest text-gold uppercase block mb-1">
                  {item.date}
                </span>

                {/* Title */}
                <h3 className="font-display text-base font-normal tracking-wide text-offwhite mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-sm font-light leading-relaxed text-sage/95 mb-4">
                  {item.description}
                </p>

                {/* Styled Image/Emoji Placeholder */}
                <div className="relative h-28 w-full rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-center overflow-hidden group">
                  {/* Inner decorative golden border */}
                  <div className="absolute inset-2 border border-dashed border-gold/10 rounded-lg group-hover:border-gold/30 transition-colors duration-500" />
                  
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />

                  {/* Icon/Emoji */}
                  <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.35)] transform group-hover:scale-110 transition-transform duration-500">
                    {item.imageEmoji}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Friendship Vouchers Section */}
      <div className="w-full border-t border-gold/15 pt-12 mt-16 space-y-8">
        <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-2">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-gold animate-pulse" />
            <h3 className="font-display text-sm font-light tracking-[0.15em] text-offwhite uppercase">
              Friendship Vouchers
            </h3>
          </div>
          <span className="font-sans text-[10px] tracking-widest text-sage/75 uppercase font-medium">
            Digitale Rubbellose
          </span>
        </div>

        <p className="font-sans text-xs text-sage leading-relaxed font-light">
          Schenke dir selbst ein Lächeln für deine harte Arbeit! Rubble die Wertmarken frei, um sie bei unseren zukünftigen Treffen einzulösen.
        </p>

        <div className="space-y-6">
          {VOUCHERS.map((voucher) => {
            const isRevealed = !!revealedVouchers[voucher.id];
            const isRedeemed = !!redeemedVouchers[voucher.id];

            return (
              <div
                key={voucher.id}
                className="relative min-h-[170px] rounded-3xl border border-slate-900/80 shadow-[0_4px_15px_rgba(0,0,0,0.15)] flex flex-col justify-between p-5 glass-panel overflow-hidden"
              >
                {/* Scratch Cover (Sealed Card) */}
                <AnimatePresence>
                  {!isRevealed && (
                    <motion.div
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, rotateY: 90 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      onClick={() => handleReveal(voucher.id)}
                      className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-gold-light to-gold flex flex-col items-center justify-center cursor-pointer z-20 p-4 rounded-[22px] shadow-[inset_0_0_15px_rgba(255,255,255,0.4)]"
                    >
                      <div className="absolute inset-1.5 border border-dashed border-navy-dark/15 rounded-[16px]" />
                      <Ticket size={24} className="text-navy-dark animate-pulse mb-2" />
                      <span className="font-display text-xs font-semibold tracking-widest text-navy-dark uppercase">
                        Freundschafts-Wertmarke
                      </span>
                      <span className="font-sans text-[9px] tracking-wider text-navy-dark/70 uppercase mt-1">
                        Tippen zum Rubbeln ✨
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Voucher Content (Unveiled) */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-display text-base font-normal tracking-wide text-offwhite">
                        {voucher.title}
                      </h4>
                      <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                        {voucher.emoji}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-sage leading-relaxed font-light">
                      {voucher.description}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="border-t border-dashed border-slate-900/60 pt-3 flex flex-col gap-3">
                      <span className="font-sans text-[9px] text-sage/55 font-light">
                        * {voucher.notes}
                      </span>

                      {isRedeemed ? (
                        <div className="flex items-center gap-2 bg-gold/5 border border-gold/30 rounded-xl px-4 py-2.5">
                          <CheckCircle size={14} className="text-gold-light" />
                          <span className="font-display text-[10px] tracking-widest text-gold uppercase font-medium gold-text-glow">
                            Eingelöst am {redeemedVouchers[voucher.id]}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRedeem(voucher.id)}
                          className="w-full py-2.5 rounded-xl bg-slate-950/30 border border-gold/30 hover:border-gold text-gold-light font-display text-[10px] tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer"
                        >
                          Gutschein einlösen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
