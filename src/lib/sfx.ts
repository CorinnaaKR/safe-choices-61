/** Tiny synthesised UI sounds (no asset files). Hover ticks and select blips
 *  for the investigate loop. Volumes are deliberately low; a user-facing mute
 *  toggle arrives with the Phase 5 audio pass (this module is its seed). */

let ctx: AudioContext | null = null;
let muted = false;

export function setSfxMuted(value: boolean) {
  muted = value;
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) ctx = new AudioContext();
    // Browsers suspend audio until a user gesture; resume is a no-op otherwise
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx.state === 'running' ? ctx : null;
  } catch {
    return null;
  }
}

function blip(frequency: number, durationMs: number, gainPeak: number, type: OscillatorType = 'square') {
  if (muted) return;
  const ac = getContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  const now = ac.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(gainPeak, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}

/** Faint tick when the crosshair passes over an interactive object. */
export function playHoverTick() {
  blip(1900, 30, 0.015);
}

/** Confirm blip when evidence is examined/collected. */
export function playSelect() {
  blip(700, 60, 0.03, 'triangle');
  setTimeout(() => blip(1050, 80, 0.025, 'triangle'), 55);
}

/** Soft click for UI buttons (choices, continue). */
export function playUiTick() {
  blip(1200, 25, 0.012);
}
