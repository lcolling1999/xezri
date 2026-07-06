import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, Calendar } from "lucide-react";

interface DailyFragmentsProps {
  firstWorkDay: string;
}

const FRAGMENTS = [
  "Sabahın xeyir, Xanım! Nimm dir heute vor, einfach dein Bestes zu geben und an dich zu glauben. Du bist genau zur richtigen Zeit am richtigen Ort. ✨",
  "Jeder große Erfolg beginnt mit dem Mut, anzufangen. Du hast Baku, Salzburg und jetzt Hamburg erobert. Dieser Job ist nur das nächste Abenteuer! ⚓",
  "Zeit für einen heißen Armudu-Tee. Nimm dir heute eine 5-Minuten-Atempause, wenn es stressig wird. Du machst das wunderbar! 🧘‍♀️",
  "Deine Ausstrahlung und Professionalität bereichern dein neues Team. Lass dir von keinem Imposter-Syndrom einreden, es sei anders! 💪",
  "Hamburg mag eine kühle Brise haben, aber deine Entschlossenheit wärmt jeden Raum. Rock den Tag heute! ☀️",
  "'Dözüm' bedeutet Durchhaltevermögen. Erinnere dich heute an deine Stärke. Du hast so viel geschafft, sei stolz auf dich! 🌸",
  "Denk daran: Rom wurde nicht an einem Tag erbaut, und dein neues Hamburger Leben wächst auch Schritt für Schritt. Geduld zahlt sich aus. 🌱",
  "Mach dir heute eine kleine Freude im Büro – vielleicht ein leckeres Franzbrötchen in der Mittagspause? 🥐",
  "Du bist klug, fähig und hast jeden deiner Erfolge absolut verdient. Geh mit erhobenem Haupt in deine Termine! 🌟",
  "'Uğur' (Erfolg) ist kein Zufall. Er ist das Ergebnis deines Fleißes und Mutes. Ich bin unendlich stolz auf dich! ❤️",
  "Falls heute ein anstrengender Tag ansteht: Du hast die Stärke, alles zu meistern. Atme ein, atme aus. 🌬️",
  "Denk daran, wie weit du gekommen bist. Salzburg war schön, aber Hamburg hat dich gerufen. Vertrau deinem Weg! 🌊",
  "Gönn dir heute Abend etwas Schönes – du arbeitest hart und hast jede Belohnung verdient. 🎁",
  "Baku, Salzburg, Hamburg – deine geografische Reise spiegelt deine innere Größe wider. Du bist unaufhaltsam! 🗺️",
  "Zwei Wochen geschafft! Du wächst mit jeder Aufgabe. Mach heute weiter mit diesem wundervollen Elan! 🚀"
];

export const DailyFragments = ({ firstWorkDay }: DailyFragmentsProps) => {
  const start = new Date(firstWorkDay).getTime();
  const now = new Date().getTime();
  const msInDay = 24 * 60 * 60 * 1000;
  
  // Calculate index (1-indexed day count)
  const diffDays = Math.max(1, Math.floor((now - start) / msInDay) + 1);

  const [selectedDay, setSelectedDay] = useState<number>(() => {
    return Math.min(diffDays, FRAGMENTS.length);
  });

  const getUnlockDate = (dayNum: number) => {
    const unlockTime = start + (dayNum - 1) * msInDay;
    return new Date(unlockTime).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-gold/15 bg-gradient-to-b from-navy-light to-navy-dark shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 border-b border-gold/10 pb-3 mb-4">
        <Calendar size={15} className="text-gold" />
        <h3 className="font-display text-xs font-light tracking-[0.15em] text-offwhite uppercase">
          Tägliche Fragmente
        </h3>
        <span className="ml-auto text-[9px] tracking-widest text-gold uppercase bg-gold/5 border border-gold/10 px-2 py-0.5 rounded-full">
          Tag {Math.min(diffDays, FRAGMENTS.length)} / {FRAGMENTS.length}
        </span>
      </div>

      <p className="font-sans text-[11px] text-sage leading-relaxed font-light mb-4">
        Exklusive tägliche Anekdoten, Zitate und Kraftspender für deinen neuen Arbeitsalltag in Hamburg.
      </p>

      {/* Horizontal Day Selector List */}
      <div className="flex gap-3 overflow-x-auto py-3 px-1.5 -mx-1.5 mb-3 no-scrollbar">
        {FRAGMENTS.map((_, index) => {
          const dayNum = index + 1;
          const isUnlocked = dayNum <= diffDays;
          const isSelected = dayNum === selectedDay;

          return (
            <button
              key={index}
              onClick={() => setSelectedDay(dayNum)}
              className={`flex-shrink-0 w-11 h-11 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative cursor-pointer ${
                isSelected
                  ? "border-gold bg-gold/10 text-offwhite shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-105"
                  : isUnlocked
                  ? "border-slate-800 bg-slate-900/40 text-sage/75 hover:border-gold/30 hover:text-offwhite"
                  : "border-slate-950 bg-slate-950/20 text-slate-700 cursor-not-allowed"
              }`}
            >
              <span className="font-display text-[9px] tracking-widest uppercase text-sage/40 block mb-0.5">
                Tag
              </span>
              <span className="font-display text-xs font-semibold block">
                {dayNum}
              </span>
              {!isUnlocked && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <Lock size={7} className="text-slate-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Daily Message Display Card */}
      <div className="relative min-h-[140px] rounded-2xl bg-slate-950/25 border border-slate-900/60 p-5 flex flex-col justify-between overflow-hidden">
        <div className="absolute -left-6 -top-6 w-16 h-16 bg-gold/5 rounded-full filter blur-xl pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {selectedDay <= diffDays ? (
            <motion.div
              key={`unlocked-${selectedDay}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Sparkles size={11} className="text-gold animate-pulse" />
                  <span className="font-display text-[9px] tracking-widest text-gold uppercase">
                    Morgen-Impuls
                  </span>
                </div>
                <p className="font-sans text-xs font-light leading-relaxed text-sage/95 italic">
                  "{FRAGMENTS[selectedDay - 1]}"
                </p>
              </div>

              <div className="text-right text-[10px] tracking-widest text-gold font-display uppercase border-t border-gold/5 pt-2">
                — Von Herzen ❤️
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`locked-${selectedDay}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-4"
            >
              <div className="w-9 h-9 rounded-full bg-slate-950/40 border border-slate-800 flex items-center justify-center">
                <Lock size={14} className="text-slate-600 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-[10px] tracking-widest text-gold uppercase">
                  Fragment noch versiegelt
                </h4>
                <p className="font-sans text-[10.5px] text-sage/60 font-light leading-normal">
                  Dieses Fragment öffnet sich am {getUnlockDate(selectedDay)}.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
