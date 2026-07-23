import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, X } from "lucide-react";
import { triggerHaptic } from "../utils/haptics";

interface ChangelogModalProps {
  version: string;
  changelog: string[];
}

export function ChangelogModal({ version, changelog }: ChangelogModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem("xezri_last_seen_version");
    if (lastSeenVersion !== version) {
      setIsOpen(true);
    }
  }, [version]);

  const handleClose = () => {
    localStorage.setItem("xezri_last_seen_version", version);
    triggerHaptic(15);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/95 backdrop-blur-md px-6 cursor-pointer"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_70%)] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 15 }}
            transition={{ type: "spring", damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel gold-border p-6 rounded-3xl max-w-sm w-full relative overflow-hidden shadow-[0_0_35px_rgba(212,175,55,0.2)] text-left cursor-default"
          >
            {/* Top Badge & Close button */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-display text-[10px] tracking-widest text-gold uppercase flex items-center gap-1.5 font-semibold">
                <Sparkles size={13} className="animate-pulse" />
                Neuerungen in v{version}
              </span>
              <button
                onClick={handleClose}
                className="text-sage/60 hover:text-gold transition-colors p-1 cursor-pointer"
                aria-label="Schließen"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="font-display text-base font-medium tracking-wide text-offwhite mb-3">
              Was gibt's Neues in Xəzri? ✨
            </h3>

            <p className="font-sans text-xs text-sage/80 font-light mb-4 leading-relaxed">
              Deine App hat ein Frische-Update erhalten! Hier sind die neuen Funktionen und Optimierungen für deinen Alltag:
            </p>

            {/* Feature List */}
            <div className="space-y-2.5 mb-6 bg-slate-950/40 p-4 rounded-2xl border border-slate-900/60">
              {changelog.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-gold flex-shrink-0 mt-0.5" />
                  <span className="font-sans text-xs text-sage/95 leading-relaxed font-light">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-gold text-navy-dark font-display text-xs tracking-widest uppercase font-semibold hover:bg-gold-light transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer active:scale-98"
            >
              Super, los geht's! 🎉
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
