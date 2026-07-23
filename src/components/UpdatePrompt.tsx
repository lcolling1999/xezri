import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, DownloadCloud } from "lucide-react";
import { registerSW } from "virtual:pwa-register";
import { triggerHaptic } from "../utils/haptics";

interface UpdatePromptProps {
  version: string;
}

export function UpdatePrompt({ version }: UpdatePromptProps) {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSWFn, setUpdateSWFn] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    // Only check for SW updates in production build (not npm run dev)
    if (!import.meta.env.PROD) return;

    // Register Service Worker update check
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
        triggerHaptic([100, 50, 100]);
      },
      onOfflineReady() {
        console.log("Xəzri PWA is ready for offline usage.");
      },
    });

    setUpdateSWFn(() => updateSW);
  }, []);

  const handleUpdate = () => {
    triggerHaptic(20);
    if (updateSWFn) {
      updateSWFn(true);
    } else {
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 p-4 rounded-2xl bg-navy-dark/95 border border-gold/60 shadow-[0_15px_40px_rgba(212,175,55,0.25)] backdrop-blur-md text-left flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <DownloadCloud size={18} className="text-gold animate-bounce" />
            </div>
            <div>
              <span className="font-display text-[10px] tracking-widest text-gold uppercase font-semibold block">
                Update verfügbar (v{version}) ✨
              </span>
              <p className="font-sans text-xs text-sage/90 font-light">
                Eine neue App-Version steht bereit!
              </p>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="px-3 py-2 rounded-xl bg-gold text-navy-dark font-display text-[10px] tracking-widest uppercase font-semibold hover:bg-gold-light transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
          >
            <RefreshCw size={12} className="animate-spin" />
            Neu laden
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
