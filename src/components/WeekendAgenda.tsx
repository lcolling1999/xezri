import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, CheckCircle2, Circle, Camera, Lock, Unlock, Sparkles, MapPin, Utensils, Coffee, FerrisWheel } from "lucide-react";
import confetti from "canvas-confetti";
import { triggerHaptic } from "../utils/haptics";

interface AgendaItem {
  id: string;
  day: "friday" | "saturday" | "sunday";
  dayTitle: string;
  dateStr: string;
  timeStr: string;
  title: string;
  description: string;
  locationQuery: string;
  icon: any;
  isSecret?: boolean;
  secretRevealTime?: string; // ISO string e.g. "2026-07-25T18:00:00"
  secretTitle?: string;
  hasCameraButton?: boolean;
}

const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: "friday_hotel",
    day: "friday",
    dayTitle: "Freitag (24. Juli)",
    dateStr: "24. Juli",
    timeStr: "~20:00 Uhr",
    title: "The Arrival & Welcome Dinner",
    description: "Ankunft am Hotel (Mercure Hotel Hamburg am Volkspark). Entspanntes Wiedersehen, Late-Night-Snack & Ankommen nach der Fahrt! 🧳✨",
    locationQuery: "Mercure Hotel Hamburg am Volkspark",
    icon: Compass,
  },
  {
    id: "saturday_fruehstueck",
    day: "saturday",
    dayTitle: "Samstag (25. Juli)",
    dateStr: "25. Juli",
    timeStr: "Morgens",
    title: "Gemeinsames Frühstück & Franzbrötchen-Test",
    description: "Der perfekte Start in den Tag mit frischem Kaffee und dem offiziellen Hamburger Franzbrötchen-Geschmackstest! ☕🥐",
    locationQuery: "Franzbrötchen Hamburg",
    icon: Coffee,
  },
  {
    id: "saturday_dom",
    day: "saturday",
    dayTitle: "Samstag (25. Juli)",
    dateStr: "25. Juli",
    timeStr: "12:00 – 13:00 Uhr",
    title: "Hamburger DOM (Sommerdom)",
    description: "Fahrgeschäfte, Achterbahnen, Zuckerwatte und der volle Rummel-Vibe! Zeit für Bauchkitzeln & gute Laune! 🎡🎢",
    locationQuery: "Hamburger DOM Heiligengeistfeld",
    icon: FerrisWheel,
    hasCameraButton: true,
  },
  {
    id: "saturday_dinner",
    day: "saturday",
    dayTitle: "Samstag (25. Juli)",
    dateStr: "25. Juli",
    timeStr: "18:00 Uhr",
    title: "Exklusives Geheimnis-Dinner 🔒",
    description: "Ein besonderer Abend an einer fantastischen Location! Lass dich überraschen... 🍷✨",
    locationQuery: "Mezedes Großneumarkt 58, 20459 Hamburg",
    icon: Utensils,
    isSecret: true,
    secretRevealTime: "2026-07-25T18:00:00",
    secretTitle: "Mezedes - Griechische Tapas 🇬🇷🥗",
  },
  {
    id: "sunday_tea",
    day: "sunday",
    dayTitle: "Sonntag (26. Juli)",
    dateStr: "26. Juli",
    timeStr: "Tagsüber",
    title: "Baku Tea Ceremony & Family Vibe",
    description: "Entspannte Tee-Zeremonie im echten Armudu-Glas (gemeinsam mit deiner Familie). Anekdoten austauschen & das Wochenende gemütlich ausklingen lassen. 🫖❤️",
    locationQuery: "Hamburg Alster",
    icon: Coffee,
  },
];

export function WeekendAgenda() {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("xezri_weekend_agenda_checked");
    return saved ? JSON.parse(saved) : {};
  });

  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    const nextState = !checkedMap[id];
    const updated = { ...checkedMap, [id]: nextState };
    setCheckedMap(updated);
    localStorage.setItem("xezri_weekend_agenda_checked", JSON.stringify(updated));

    triggerHaptic(15);
    if (nextState) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#d4af37", "#e5c158", "#ffffff"],
        disableForReducedMotion: true,
      });
    }
  };

  const isSecretRevealed = (item: AgendaItem) => {
    if (!item.isSecret) return true;
    if (revealedSecrets[item.id]) return true;
    if (item.secretRevealTime) {
      const revealDate = new Date(item.secretRevealTime).getTime();
      const now = new Date().getTime();
      return now >= revealDate;
    }
    return false;
  };

  const handleManualSecretUnlock = (item: AgendaItem) => {
    setRevealedSecrets((prev) => ({ ...prev, [item.id]: true }));
    triggerHaptic([80, 50, 80]);
    confetti({
      particleCount: 35,
      spread: 50,
      colors: ["#d4af37", "#e5c158", "#38bdf8"],
      disableForReducedMotion: true,
    });
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHaptic(20);
      confetti({
        particleCount: 30,
        spread: 50,
        colors: ["#d4af37", "#e5c158"],
        disableForReducedMotion: true,
      });
      alert("Achterbahn-Foto festgehalten! 📸 Wunderschöne Erinnerung an den Sommerdom!");
    }
  };

  const completedCount = Object.values(checkedMap).filter(Boolean).length;
  const totalCount = AGENDA_ITEMS.length;

  return (
    <div className="glass-panel gold-border p-6 rounded-3xl relative overflow-hidden space-y-6 shadow-[0_0_30px_rgba(212,175,55,0.12)]">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-gold/15 pb-4 z-10">
        <div className="flex items-center justify-between">
          <span className="font-display text-xs tracking-widest text-gold uppercase flex items-center gap-1.5 font-medium animate-pulse">
            <Sparkles size={14} />
            Wochenend-Agenda (24. – 26. Juli)
          </span>
          <span className="font-sans text-[10px] tracking-wider text-sage/80 uppercase font-medium bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full tabular-nums">
            {completedCount} / {totalCount} Erlebnisse
          </span>
        </div>
        <h3 className="font-display text-base font-normal tracking-wide text-offwhite mt-1">
          Hamburg Weekend Roadmap ⚓✨
        </h3>
      </div>

      {/* "Wochenend-Momentaufnahme" Progress Bar */}
      <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-display text-[10px] tracking-widest text-sage uppercase">
            Wochenend-Momentaufnahme:
          </span>
          <span className="font-sans text-xs text-gold font-medium">
            {completedCount === totalCount
              ? "Alle Erlebnisse unvergesslich abgehakt! 🎉❤️"
              : `${completedCount} von ${totalCount} abgehakt`}
          </span>
        </div>
        <div className="w-full h-2 bg-navy-dark rounded-full overflow-hidden border border-gold/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-gold/70 via-gold to-gold-light rounded-full"
          />
        </div>
      </div>

      {/* Agenda Items List */}
      <div className="space-y-4">
        {AGENDA_ITEMS.map((item) => {
          const isChecked = !!checkedMap[item.id];
          const revealed = isSecretRevealed(item);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isChecked
                  ? "bg-gold/5 border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-slate-950/30 border-slate-900/80 hover:border-gold/30"
              }`}
            >
              {/* Day Header Badge */}
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-display text-[9px] tracking-widest text-gold uppercase px-2.5 py-0.5 rounded-full bg-navy-dark border border-gold/20 font-semibold">
                  {item.dayTitle} • {item.timeStr}
                </span>

                {/* Google Maps Shortcut Button (Hidden if secret is still locked!) */}
                {(!item.isSecret || revealed) && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerHaptic(10)}
                    className="flex items-center gap-1 text-[10px] font-display uppercase tracking-wider text-sage/75 hover:text-gold transition-colors p-1"
                    title="Google Maps öffnen"
                  >
                    <MapPin size={12} className="text-gold" />
                    Maps
                  </a>
                )}
              </div>

              {/* Title & Checkbox */}
              <div className="flex items-start gap-3">
                {/* Golden Checkbox Button */}
                <button
                  onClick={() => toggleCheck(item.id)}
                  className="mt-0.5 text-gold hover:text-gold-light transition-transform active:scale-90 cursor-pointer flex-shrink-0"
                  aria-label="Erlebnis abhaken"
                >
                  {isChecked ? (
                    <CheckCircle2 size={20} className="text-gold fill-gold/20" />
                  ) : (
                    <Circle size={20} className="text-sage/40" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => toggleCheck(item.id)}
                    className={`font-display text-sm font-medium tracking-wide cursor-pointer transition-colors ${
                      isChecked ? "text-gold line-through" : "text-offwhite"
                    }`}
                  >
                    {revealed && item.secretTitle ? item.secretTitle : item.title}
                  </h4>

                  {/* Description / Secret Locked State */}
                  {item.isSecret && !revealed ? (
                    <div className="mt-2.5 p-3 rounded-xl bg-navy-dark/90 border border-gold/30 space-y-2">
                      <div className="flex items-center gap-2 text-gold font-display text-xs tracking-wider">
                        <Lock size={14} className="animate-pulse" />
                        Location 🔒 (Wird Samstag um 18:00 Uhr enthüllt)
                      </div>
                      <p className="font-sans text-xs text-sage/75 font-light">
                        Ein exklusives Dinner-Erlebnis wartet auf euch!
                      </p>
                      <button
                        onClick={() => handleManualSecretUnlock(item)}
                        className="text-[9px] font-display uppercase tracking-widest text-gold-light hover:underline cursor-pointer pt-1 flex items-center gap-1"
                      >
                        <Unlock size={10} /> Jetzt vorab enthüllen
                      </button>
                    </div>
                  ) : (
                    <p className="font-sans text-xs text-sage/85 font-light leading-relaxed mt-1.5">
                      {item.description}
                    </p>
                  )}

                  {/* Mini-Feature: Sommerdom Achterbahn-Foto Button */}
                  {item.hasCameraButton && (
                    <div className="mt-3">
                      <input
                        type="file"
                        id={`coaster-photo-${item.id}`}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleCameraCapture}
                      />
                      <label
                        htmlFor={`coaster-photo-${item.id}`}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gold/10 border border-gold/30 hover:border-gold text-gold-light font-display text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                      >
                        <Camera size={13} className="animate-pulse text-gold" />
                        Achterbahn-Foto machen! 📸
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
