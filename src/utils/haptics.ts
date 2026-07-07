/**
 * Safe utility to trigger haptic vibration feedback.
 * Works natively on Android / Chrome; fails silently on iOS Safari.
 */
export const triggerHaptic = (pattern: number | number[]) => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Haptic feedback is not supported or was blocked:", e);
    }
  }
};
