import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: (tone: string, followUp: 'wait' | 'message' | 'visit') => void;
}

const INTRO_LINES = [
  "You decide to try Lazlo one more time, just in case Lilly's misunderstanding the situation.",
  "He's usually quick to reply.",
];

type Beat = 'beat1' | 'beat1-typing' | 'beat1-sent' | 'day-card' | 'beat2' | 'beat3-typing' | 'beat3-sent' | 'beat3-day' | 'done';

const TONE_OPTIONS = [
  { id: 'lt-tone-a', text: '??', label: 'Simple' },
  { id: 'lt-tone-b', text: "Hey Laz, haven't heard from you in a bit. You about?", label: 'Casual' },
  { id: 'lt-tone-c', text: "Not like you to not respond — everything okay? Getting a bit worried now.", label: 'Direct' },
];

const SEEN_TIME_LAST_WEEK = 'Tue 2:47 PM';
const SEEN_TIME_TODAY = '9:43 AM';
const SEEN_TIME_B3 = '10:02 AM';

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 'min(360px, 82vw)',
      height: 'min(780px, 92vh)',
      background: '#1c1c1e',
      borderRadius: 44,
      border: '10px solid #1a1a1a',
      boxShadow: '0 0 0 1.5px #3a3a3c inset, 0 24px 80px rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Dynamic island */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20, zIndex: 10 }} />

      {/* Status bar */}
      <div style={{ paddingTop: 18, paddingLeft: 20, paddingRight: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, height: 52 }}>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: '-apple-system, sans-serif' }}>09:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="3" width="3" height="9" rx="1" fill="white" opacity="0.4"/><rect x="4.5" y="2" width="3" height="10" rx="1" fill="white" opacity="0.6"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="white" opacity="0.8"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="white"/></svg>
          <svg width="16" height="12" viewBox="0 0 24 18" fill="white"><path d="M12 4C15.87 4 19.33 5.64 21.8 8.27L24 6.07C20.93 2.31 16.23 0 12 0C7.77 0 3.07 2.31 0 6.07L2.2 8.27C4.67 5.64 8.13 4 12 4Z" opacity="0.4"/><path d="M12 8C14.76 8 17.24 9.12 19.01 10.94L21.21 8.74C18.84 6.39 15.58 5 12 5C8.42 5 5.16 6.39 2.79 8.74L4.99 10.94C6.76 9.12 9.24 8 12 8Z" opacity="0.6"/><path d="M12 12C13.66 12 15.15 12.68 16.24 13.76L18.44 11.56C16.74 9.96 14.48 9 12 9C9.52 9 7.26 9.96 5.56 11.56L7.76 13.76C8.85 12.68 10.34 12 12 12Z" opacity="0.8"/><circle cx="12" cy="17" r="2"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="white"/><path d="M23 4.5V7.5C23.8 7.16 24.5 6.33 24.5 6C24.5 5.67 23.8 4.84 23 4.5Z" fill="white" fillOpacity="0.4"/></svg>
        </div>
      </div>

      {/* iMessage header */}
      <div style={{ background: '#1c1c1e', borderBottom: '0.5px solid #3a3a3c', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button style={{ color: '#0a84ff', fontSize: 17, fontFamily: '-apple-system, sans-serif', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: 0 }}>
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none"><path d="M9 1L1 8.5L9 16" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#48484a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 15, fontFamily: '-apple-system, sans-serif' }}>L</div>
          <span style={{ color: '#fff', fontSize: 12, fontFamily: '-apple-system, sans-serif', marginTop: 2 }}>Lazlo</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="#0a84ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <svg width="20" height="20" viewBox="0 0 24 18" fill="none"><rect x="1" y="1" width="15" height="16" rx="2" stroke="#0a84ff" strokeWidth="1.8"/><path d="M16 6l7-4v14l-7-4V6z" stroke="#0a84ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
        </div>
      </div>

      {/* Screen content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#000' }}>
        {children}
      </div>
    </div>
  );
}

function Bubble({ text, isYou, seen, seenTime }: { text: string; isYou: boolean; seen?: boolean; seenTime?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isYou ? 'flex-end' : 'flex-start' }}>
      <div style={{ position: 'relative', maxWidth: '75%' }}>
        <div style={{
          padding: '8px 14px',
          fontSize: 15,
          lineHeight: 1.4,
          fontFamily: '-apple-system, sans-serif',
          background: isYou ? '#0a84ff' : '#3a3a3c',
          color: '#fff',
          borderRadius: isYou ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
        }}>
          {text}
        </div>
        <div style={{
          position: 'absolute', bottom: 0,
          ...(isYou ? { right: -6 } : { left: -6 }),
          width: 0, height: 0,
          borderTop: '10px solid transparent',
          ...(isYou ? { borderLeft: '10px solid #0a84ff' } : { borderRight: '10px solid #3a3a3c' }),
        }} />
      </div>
      {seen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 11, color: '#8e8e93', fontFamily: '-apple-system, sans-serif', marginTop: 3, paddingRight: isYou ? 4 : 0, paddingLeft: isYou ? 0 : 4 }}
        >
          Seen {seenTime}
        </motion.div>
      )}
    </div>
  );
}

export function LazloThread({ onComplete }: Props) {
  const [introIdx, setIntroIdx] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [beat, setBeat] = useState<Beat>('beat1');
  const [selectedTone, setSelectedTone] = useState<typeof TONE_OPTIONS[0] | null>(null);
  const [typingText, setTypingText] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [sendReady, setSendReady] = useState(false);
  const [followUp, setFollowUp] = useState<'wait' | 'message' | 'visit' | null>(null);
  const [beat3Seen, setBeat3Seen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [typingText, beat]);

  const startTyping = (option: typeof TONE_OPTIONS[0]) => {
    setSelectedTone(option);
    setBeat('beat1-typing');
    setTypingText('');

    typingRef.current.cancelled = false;
    const chars = option.text.split('');
    let i = 0;

    const typeNext = () => {
      if (typingRef.current.cancelled) return;
      if (i >= chars.length) {
        setActiveKey(null);
        setSendReady(true);
        setTimeout(() => {
          setSendReady(false);
          setTypingText('');
          setBeat('beat1-sent');
          // After 2s silence, show day transition card
          setTimeout(() => setBeat('day-card'), 2000);
        }, 500);
        return;
      }
      const ch = chars[i];
      setActiveKey(ch.toUpperCase().match(/[A-Z]/) ? ch.toUpperCase() : null);
      setTypingText(option.text.slice(0, i + 1));
      i++;
      const isPause = ch === ' ' || ch === ',' || ch === '.' || ch === '!' || ch === '?';
      const delay = isPause ? 120 + Math.random() * 80 : 55 + Math.random() * 45;
      setTimeout(typeNext, delay);
    };
    setTimeout(typeNext, 80);
  };

  const startBeat3Typing = () => {
    const msg = "Still there mate?";
    setBeat('beat3-typing');
    setTypingText('');

    typingRef.current.cancelled = false;
    const chars = msg.split('');
    let i = 0;

    const typeNext = () => {
      if (typingRef.current.cancelled) return;
      if (i >= chars.length) {
        setActiveKey(null);
        setSendReady(true);
        setTimeout(() => {
          setSendReady(false);
          setTypingText('');
          setBeat('beat3-sent');
          setBeat3Seen(false);
          // Show "seen" before the day transition, so the receipt matches
          // what the following narration claims happened.
          setTimeout(() => setBeat3Seen(true), 1200);
          setTimeout(() => setBeat('beat3-day'), 2200);
        }, 500);
        return;
      }
      const ch = chars[i];
      setActiveKey(ch.toUpperCase().match(/[A-Z]/) ? ch.toUpperCase() : null);
      setTypingText(msg.slice(0, i + 1));
      i++;
      const isPause = ch === ' ' || ch === ',' || ch === '.' || ch === '!' || ch === '?';
      const delay = isPause ? 120 + Math.random() * 80 : 55 + Math.random() * 45;
      setTimeout(typeNext, delay);
    };
    setTimeout(typeNext, 80);
  };

  const handleFollowUp = (choice: 'wait' | 'message' | 'visit') => {
    setFollowUp(choice);
    if (choice === 'message') {
      startBeat3Typing();
    } else {
      // wait or visit — proceed to Scene 1
      onComplete(selectedTone!.id, choice);
    }
  };

  const showTypingIndicator = beat === 'beat1-typing' || beat === 'beat3-typing';
  const isTypingBeat = beat === 'beat1-typing' || beat === 'beat3-typing';

  if (!introDone) {
    const advanceIntro = () => {
      if (introIdx + 1 < INTRO_LINES.length) {
        setIntroIdx((i) => i + 1);
      } else {
        setIntroDone(true);
      }
    };

    return (
      <div
        className="fixed inset-0 bg-background flex items-center justify-center z-50 px-6 cursor-pointer"
        onClick={advanceIntro}
      >
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={introIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="narrative-panel px-6 py-5"
            >
              <p className="narrative-text">{INTRO_LINES[introIdx]}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="hud-label opacity-50">
                  {String(introIdx + 1).padStart(2, '0')} / {String(INTRO_LINES.length).padStart(2, '0')}
                </span>
                <motion.span
                  className="flex items-center gap-2 bg-primary/90 text-primary-foreground font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2"
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {introIdx + 1 >= INTRO_LINES.length ? 'Continue' : 'Next'}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 px-4">

      {/* Day transition card */}
      <AnimatePresence>
        {beat === 'day-card' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[70] gap-6"
            onAnimationComplete={() => {
              if (beat === 'day-card') {
                setTimeout(() => setBeat('beat2'), 1800);
              }
            }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">The next day</p>
            <p className="text-foreground text-lg font-light" style={{ fontFamily: '-apple-system, sans-serif' }}>
              You check your messages with Lazlo.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Beat 3 day transition */}
      <AnimatePresence>
        {beat === 'beat3-day' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[70] gap-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">The next morning</p>
            <p className="text-foreground text-lg font-light" style={{ fontFamily: '-apple-system, sans-serif' }}>
              Still nothing. Both messages read. No reply.
            </p>
            <p className="text-muted-foreground text-sm mb-2">You decide to go round.</p>
            <motion.button
              onClick={() => onComplete(selectedTone!.id, 'message')}
              className="flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2 transition-colors"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              Continue
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone — hidden during transition cards */}
      {beat !== 'day-card' && beat !== 'beat3-day' && (
        <PhoneShell>
          {/* Message thread */}
          <div className="flex-1 overflow-y-auto px-3 py-4 min-h-0" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

            {/* Prior context — greyed timestamp */}
            <div style={{ textAlign: 'center', color: '#8e8e93', fontSize: 12, fontFamily: '-apple-system, sans-serif', marginBottom: 8 }}>
              Last week
            </div>

            {/* Evan's earlier message (already sent, unanswered) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Bubble
                text="Hey man, just got back from my semester abroad. We've got so much to catch up about! When you next free?"
                isYou
                seen
                seenTime={SEEN_TIME_LAST_WEEK}
              />
            </motion.div>

            {/* Current exchange divider */}
            {(beat === 'beat1-sent' || beat === 'beat2' || beat === 'beat3-typing' || beat === 'beat3-sent') && (
              <div style={{ textAlign: 'center', color: '#8e8e93', fontSize: 12, fontFamily: '-apple-system, sans-serif', margin: '8px 0' }}>
                Today
              </div>
            )}

            {/* Beat 1 sent message */}
            {selectedTone && beat !== 'beat1' && beat !== 'beat1-typing' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Bubble
                  text={selectedTone.text}
                  isYou
                  seen={beat === 'beat2' || beat === 'beat3-typing' || beat === 'beat3-sent'}
                  seenTime={SEEN_TIME_TODAY}
                />
              </motion.div>
            )}

            {/* Beat 3 second follow-up message */}
            {beat === 'beat3-sent' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Bubble
                  text="Still there mate?"
                  isYou
                  seen={beat3Seen}
                  seenTime={SEEN_TIME_B3}
                />
              </motion.div>
            )}

            {/* Compose bar showing typing */}
            {isTypingBeat && (
              <div style={{ marginTop: 'auto' }} />
            )}

            <div ref={bottomRef} />
          </div>

          {/* Compose bar — shown while typing */}
          {isTypingBeat && (
            <div style={{ background: '#1c1c1e', borderTop: '0.5px solid #3a3a3c', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ flex: 1, background: '#2c2c2e', borderRadius: 20, padding: '7px 14px', fontSize: 15, fontFamily: '-apple-system, sans-serif', color: typingText ? '#fff' : '#8e8e93', minHeight: 34, display: 'flex', alignItems: 'center' }}>
                {typingText || 'iMessage'}
              </div>
              <motion.div
                animate={sendReady ? { backgroundColor: '#0a84ff', scale: 1.12 } : { backgroundColor: '#3a3a3c', scale: 1 }}
                transition={{ duration: 0.15 }}
                style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2 21L23 12 2 3v7l15 2-15 2z"/></svg>
              </motion.div>
            </div>
          )}
        </PhoneShell>
      )}

      {/* Bottom sheet — tone choices (beat 1) and follow-up choices (beat 2) */}
      <AnimatePresence>
        {(beat === 'beat1' || beat === 'beat2') && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'hsl(var(--background))',
              borderTop: '1px solid hsl(var(--border))',
              borderRadius: '20px 20px 0 0',
              padding: '16px 20px 32px',
              zIndex: 60,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* Drag handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'hsl(var(--border))', margin: '0 auto 12px' }} />

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-1">
              {beat === 'beat1' ? 'Message Lazlo' : "He's seen it. No reply. What do you do?"}
            </p>

            {beat === 'beat1' && TONE_OPTIONS.map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startTyping(opt)}
                style={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 12,
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: 14,
                  color: 'hsl(var(--foreground))',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'hsl(var(--muted-foreground))', marginBottom: 6 }}>
                  {opt.label}
                </span>
                {opt.text}
              </motion.button>
            ))}

            {beat === 'beat2' && ([
              { id: 'visit', label: 'Go and see him' },
              { id: 'message', label: 'Send another message' },
              { id: 'wait', label: 'Wait a bit longer' },
            ] as const).map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFollowUp(opt.id)}
                style={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 12,
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: 14,
                  color: 'hsl(var(--foreground))',
                  lineHeight: 1.4,
                }}
              >
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label */}
      {beat !== 'day-card' && beat !== 'beat3-day' && beat !== 'beat1' && beat !== 'beat2' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
          style={{ position: 'absolute', bottom: 24 }}
        >
          Before you arrive
        </motion.p>
      )}
    </div>
  );
}
