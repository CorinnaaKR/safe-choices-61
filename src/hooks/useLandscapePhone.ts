import { useState, useEffect } from 'react';

/** Returns true when the device is a phone-sized screen in landscape orientation.
 *  We define "phone" as height < 500px (excludes iPads in landscape which are 768px+).
 *  Used to show a rotate-device nudge in the 3D simulation. */
export function useLandscapePhone(): boolean {
  const [isLandscapePhone, setIsLandscapePhone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight && window.innerHeight < 500;
  });

  useEffect(() => {
    const check = () => {
      setIsLandscapePhone(window.innerWidth > window.innerHeight && window.innerHeight < 500);
    };
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  return isLandscapePhone;
}
