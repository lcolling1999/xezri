import { useEffect, useState } from "react";
import { Calendar, Video } from "lucide-react";

interface CountdownProps {
  targetDateStr: string | null;
}

export const Countdown = ({ targetDateStr }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, isExpired: true });

  const [isValidDate, setIsValidDate] = useState(false);

  useEffect(() => {
    if (!targetDateStr) {
      setIsValidDate(false);
      return;
    }

    const targetTime = new Date(targetDateStr).getTime();
    if (isNaN(targetTime)) {
      setIsValidDate(false);
      return;
    }

    setIsValidDate(true);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes, isExpired: false });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute is enough

    return () => clearInterval(timer);
  }, [targetDateStr]);

  const showCountdown = isValidDate && !timeLeft.isExpired;

  return (
    <section className="py-8 px-4 md:px-8 w-full max-w-lg mx-auto">
      <div className="glass-panel gold-pulse-border p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent pointer-events-none" />

        {showCountdown ? (
          /* Active Countdown View */
          <div className="text-center space-y-6">
            <h3 className="font-display text-sm font-light tracking-[0.2em] text-gold uppercase flex items-center justify-center gap-2">
              <Calendar size={16} />
              Nächstes Wiedersehen
            </h3>

            <div className="flex justify-center gap-4 py-2">
              {/* Days */}
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="font-display text-3xl font-light text-offwhite tracking-wide gold-text-glow">
                  {timeLeft.days}
                </span>
                <span className="font-sans text-[10px] tracking-wider text-sage/75 uppercase mt-1">
                  {timeLeft.days === 1 ? "Tag" : "Tage"}
                </span>
              </div>

              {/* Colon divider */}
              <span className="font-display text-2xl font-light text-gold/60 self-center -translate-y-2">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="font-display text-3xl font-light text-offwhite tracking-wide gold-text-glow">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] tracking-wider text-sage/75 uppercase mt-1">
                  Stunden
                </span>
              </div>

              {/* Colon divider */}
              <span className="font-display text-2xl font-light text-gold/60 self-center -translate-y-2">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="font-display text-3xl font-light text-offwhite tracking-wide gold-text-glow">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] tracking-wider text-sage/75 uppercase mt-1">
                  Minuten
                </span>
              </div>
            </div>

            <p className="font-sans text-[11px] text-sage/80 tracking-wide font-light">
              Die Zeit rennt... Freue mich auf dich! ❤️
            </p>
            <p className="font-sans text-[9px] text-gold/75 uppercase tracking-widest font-light -mt-1.5">
              * Voraussichtliches Wiedersehen am 24.07.2026 *
            </p>
          </div>
        ) : (
          /* Fallback View (In Planning) */
          <div className="text-center py-4 space-y-5">
            <h3 className="font-display text-sm font-light tracking-[0.2em] text-sage uppercase">
              Nächstes Treffen
            </h3>
            
            <p className="font-display text-lg font-light text-gold-light gold-text-glow leading-relaxed">
              In Planung...
            </p>

            <div className="w-10 h-[1px] bg-gold/30 mx-auto" />

            <p className="font-sans text-sm text-sage/90 font-light leading-relaxed">
              Es steht noch kein Termin fest. Wie wäre es in der Zwischenzeit mit einem Video-Call? ☕✨
            </p>

            <a
              href="https://meet.google.com" // Placeholder or whatsapp link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/40 bg-gold/5 text-gold-light font-display text-[10px] tracking-widest uppercase hover:bg-gold/15 transition-all duration-300"
            >
              <Video size={12} />
              Video-Call starten
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
