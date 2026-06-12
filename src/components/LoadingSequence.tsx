import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/** Full-screen percentage loader: `LOADING 047%`. Used as the Suspense
 *  fallback for the 3D-heavy pages. The count is time-based (eased toward 99,
 *  it never claims 100) — when the real chunk arrives the fallback unmounts. */
export function LoadingCounter() {
  const reducedMotion = useReducedMotion();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1400;
      // Fast at first, asymptotic toward 99
      const eased = Math.min(99, Math.floor(99 * (1 - Math.exp(-2.2 * t))));
      setPct(eased);
      if (eased < 99) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-6">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-foreground">
        Loading{!reducedMotion && ` ${String(pct).padStart(3, '0')}%`}
      </p>
      <div className="w-48 h-px bg-border relative overflow-hidden">
        {!reducedMotion && (
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}

interface SceneTitleStampProps {
  /** 1-based scene number within the scenario */
  index: number;
  title: string;
}

/** Scene title stamp on entry: `SCENE 01 — MONDAY MORNING`.
 *  Fades itself out; purely presentational, pointer-events none. */
export function SceneTitleStamp({ index, title }: SceneTitleStampProps) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), reducedMotion ? 2600 : 2200);
    return () => clearTimeout(timer);
  }, [index, title, reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`${index}-${title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
          className="absolute inset-x-0 top-[20%] z-20 flex justify-center pointer-events-none"
        >
          <div className="text-center">
            <p className="hud-label mb-2">
              Scene {String(index).padStart(2, '0')}
            </p>
            <div className="rule-h w-12 mx-auto mb-2 bg-primary" />
            <h2 className="font-mono text-xl md:text-2xl uppercase tracking-[0.2em] text-foreground">
              {title}
            </h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
