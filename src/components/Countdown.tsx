import { useEffect, useState } from "react";
import { Video, Sparkles } from "lucide-react";

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
          <div className="text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.2)] animate-pulse">
              <Sparkles size={13} className="text-gold" />
              <span className="font-display text-[10px] tracking-widest text-gold uppercase font-semibold">
                Nächstes Wiedersehen • FEST GEPLANT! 🔥
              </span>
            </div>

            <div className="flex justify-center gap-4 py-2">
              {/* Days */}
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="font-display text-4xl font-bold text-gold-light tracking-wide gold-text-glow">
                  {timeLeft.days}
                </span>
                <span className="font-sans text-[10px] tracking-wider text-sage/90 uppercase mt-1 font-medium">
                  {timeLeft.days === 1 ? "Tag" : "Tage"}
                </span>
              </div>

              {/* Colon divider */}
              <span className="font-display text-3xl font-light text-gold self-center -translate-y-2 animate-pulse">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="font-display text-4xl font-bold text-gold-light tracking-wide gold-text-glow">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] tracking-wider text-sage/90 uppercase mt-1 font-medium">
                  Stunden
                </span>
              </div>

              {/* Colon divider */}
              <span className="font-display text-3xl font-light text-gold self-center -translate-y-2 animate-pulse">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center min-w-[70px]">
                <span className="font-display text-4xl font-bold text-gold-light tracking-wide gold-text-glow">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] tracking-wider text-sage/90 uppercase mt-1 font-medium">
                  Minuten
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-sage/95 tracking-wide font-light">
              Die Stunden vergehen im Flug... Freue mich riesig auf dich! ❤️✨
            </p>
            <p className="font-sans text-[10px] text-gold uppercase tracking-widest font-semibold -mt-1.5 gold-text-glow">
              * FEST GEPLANT AM 24.07.2026 UM 20:00 UHR *
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
