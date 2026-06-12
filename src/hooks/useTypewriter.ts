import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** Reveals `text` character by character (case-file teletype effect).
 *  Under prefers-reduced-motion the full text appears immediately. */
export function useTypewriter(text: string, charsPerSecond = 55) {
  const reduced = useRef(prefersReducedMotion());
  const [count, setCount] = useState(reduced.current ? text.length : 0);

  useEffect(() => {
    if (reduced.current) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const chars = Math.min(
        text.length,
        Math.floor(((now - start) / 1000) * charsPerSecond)
      );
      setCount(chars);
      if (chars < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, charsPerSecond]);

  return { text: text.slice(0, count), done: count >= text.length };
}
