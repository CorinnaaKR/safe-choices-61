import { useState, useEffect, useRef } from 'react';

/**
 * Returns true while the user is actively interacting, false after
 * `timeoutMs` of silence. Used to ghost the HUD down so the world
 * fills the screen during idle moments.
 */
export function useHudActivity(timeoutMs = 3000): boolean {
  const [active, setActive] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const wake = () => {
      setActive(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(false), timeoutMs);
    };

    window.addEventListener('mousemove', wake, { passive: true });
    window.addEventListener('mousedown', wake, { passive: true });
    window.addEventListener('keydown', wake, { passive: true });
    wake();

    return () => {
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('mousedown', wake);
      window.removeEventListener('keydown', wake);
      clearTimeout(timer.current);
    };
  }, [timeoutMs]);

  return active;
}
