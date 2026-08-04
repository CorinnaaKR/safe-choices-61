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

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

const SEEN_TIME_LAST_WEEK = 'Tue 2:47 PM';
const SEEN_TIME_TODAY = '9:43 AM';
const SEEN_TIME_B3 = '10:02 AM';

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

  const isTypingBeat = beat === 'beat1-typing' || beat === 'beat3-typing';
  const showChoices = beat === 'beat1' || beat === 'beat2';

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
      onComplete(selectedTone!.id, choice);
    }
  };

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
    <div className="fixed inset-0 bg-background z-50 md:flex md:flex-row md:items-center md:justify-center md:gap-8 md:px-8">

      {/* Day transition overlays */}
      <AnimatePresence>
        {beat === 'day-card' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[70] gap-6"
            onAnimationComplete={() => {
              if (beat === 'day-card') setTimeout(() => setBeat('beat2'), 1800);
            }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">The next day</p>
            <p className="text-foreground text-lg font-light" style={{ fontFamily: '-apple-system, sans-serif' }}>
              You check your messages with Lazlo.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Phone — full-screen on mobile, framed on desktop */}
      {beat !== 'day-card' && beat !== 'beat3-day' && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex flex-col overflow-hidden bg-[#000]
                     md:relative md:inset-auto md:order-2 md:max-h-[95vh]
                     md:w-[min(360px,82vw)] md:rounded-[3rem] md:border-[10px] md:border-[#1a1a1a]"
          style={{
            height: '95dvh',
            boxShadow: '0 0 0 1px #333, 0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1.5px rgba(255,255,255,0.12), inset 0 0 0 4px rgba(0,0,0,0.95)',
          }}
        >
          {/* Dynamic island */}
          <div className="absolute top-0 inset-x-0 flex justify-center pt-3 z-10">
            <div style={{ width: 120, height: 34, background: '#000', borderRadius: 20 }} />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-10 pb-1 shrink-0" style={{ background: '#1c1c1e' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, sans-serif' }}>09:41</span>
            <div className="flex items-center gap-1.5">
              {[3,4,5,6].map(h => <div key={h} style={{ width: 3, height: h, background: '#fff', borderRadius: 1 }} />)}
              <svg width="15" height="11" viewBox="0 0 15 11" fill="white"><path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM7.5 5c1.4 0 2.6.5 3.6 1.4l-1.1 1.1A3.5 3.5 0 0 0 7.5 6.5a3.5 3.5 0 0 0-2.5 1L3.9 6.4A5 5 0 0 1 7.5 5zm0-3.5C9.7 1.5 11.7 2.4 13.2 4l-1.1 1A6 6 0 0 0 7.5 3a6 6 0 0 0-4.6 2L1.8 4A7.5 7.5 0 0 1 7.5 1.5z"/></svg>
              <div style={{ width: 24, height: 12, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', padding: '1px 1.5px' }}>
                <div style={{ width: '85%', height: '100%', background: '#fff', borderRadius: 1 }} />
                <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 2, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* iMessage header */}
          <div className="flex items-center px-4 py-2 shrink-0" style={{ background: '#1c1c1e', borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center gap-0.5" style={{ color: '#0a84ff', minWidth: 60 }}>
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8.5 1L1.5 8l7 7" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 17, fontFamily: '-apple-system, sans-serif', color: '#0a84ff' }}>Back</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
                <span style={{ color: '#fff', fontSize: 15, fontFamily: '-apple-system, sans-serif', fontWeight: 500 }}>L</span>
              </div>
              <span style={{ fontSize: 12, color: '#fff', fontFamily: '-apple-system, sans-serif', fontWeight: 500 }}>Lazlo</span>
            </div>
            <div className="flex items-center gap-4" style={{ minWidth: 60, justifyContent: 'flex-end' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="#0a84ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <svg width="20" height="14" viewBox="0 0 24 18" fill="none"><rect x="1" y="1" width="15" height="16" rx="2" stroke="#0a84ff" strokeWidth="1.8"/><path d="M16 6l7-4v14l-7-4V6z" stroke="#0a84ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Message thread */}
          <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0" style={{ background: '#000', display: 'flex', flexDirection: 'column', gap: 6 }}>

            {/* Prior context */}
            <div style={{ textAlign: 'center', color: '#8e8e93', fontSize: 12, fontFamily: '-apple-system, sans-serif', marginBottom: 8 }}>
              Last week
            </div>

            <ThreadBubble
              text="Hey man, just got back from my semester abroad. We've got so much to catch up about! When you next free?"
              isYou
              label="You"
              time="Tue 2:40 PM"
              seen
              seenTime={SEEN_TIME_LAST_WEEK}
            />

            {(beat === 'beat1-sent' || beat === 'beat2' || beat === 'beat3-typing' || beat === 'beat3-sent') && (
              <div style={{ textAlign: 'center', color: '#8e8e93', fontSize: 12, fontFamily: '-apple-system, sans-serif', margin: '8px 0' }}>
                Today
              </div>
            )}

            {selectedTone && beat !== 'beat1' && beat !== 'beat1-typing' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <ThreadBubble
                  text={selectedTone.text}
                  isYou
                  label="You"
                  time="9:41 AM"
                  seen={beat === 'beat2' || beat === 'beat3-typing' || beat === 'beat3-sent'}
                  seenTime={SEEN_TIME_TODAY}
                />
              </motion.div>
            )}

            {beat === 'beat3-sent' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <ThreadBubble
                  text="Still there mate?"
                  isYou
                  label="You"
                  time="10:01 AM"
                  seen={beat3Seen}
                  seenTime={SEEN_TIME_B3}
                />
              </motion.div>
            )}

            {/* Spacer so messages don't hide under the choices sheet on mobile */}
            {showChoices && <div className="h-56 md:h-0 shrink-0" />}
            <div ref={bottomRef} />
          </div>

          {/* Compose bar — shown while typing */}
          <AnimatePresence>
            {isTypingBeat && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="shrink-0 flex items-center gap-2 px-3 py-2"
                style={{ borderTop: '0.5px solid rgba(255,255,255,0.12)', background: '#1c1c1e' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" fill="#3a3a3c"/>
                  <path d="M8 10.5h1.5l1-2h7l1 2H20a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" stroke="#ebebf5" strokeWidth="1.2" fill="none"/>
                  <circle cx="14" cy="15" r="2.5" stroke="#ebebf5" strokeWidth="1.2"/>
                </svg>
                <div
                  className="flex-1 flex items-center px-4"
                  style={{ background: '#2c2c2e', borderRadius: 20, minHeight: 36, border: '1px solid rgba(255,255,255,0.1)', fontFamily: '-apple-system, sans-serif', fontSize: 15 }}
                >
                  <span style={{ color: typingText ? '#fff' : '#636366', flex: 1 }}>
                    {typingText || 'iMessage'}
                  </span>
                  {typingText && (
                    <span style={{ display: 'inline-block', width: 2, height: 16, background: '#0a84ff', borderRadius: 1, marginLeft: 1, verticalAlign: 'middle', animation: 'pulse 1s ease-in-out infinite' }} />
                  )}
                </div>
                <motion.div
                  animate={sendReady ? { backgroundColor: '#0a84ff', scale: 1.12 } : { backgroundColor: '#3a3a3c', scale: 1 }}
                  transition={{ duration: 0.15 }}
                  style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 12V2M7 2L3 6M7 2L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* iOS keyboard */}
          <AnimatePresence>
            {isTypingBeat && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.18 }}
                className="shrink-0"
                style={{ background: '#1c1c1e', paddingTop: 10, paddingBottom: 4 }}
              >
                {KEYBOARD_ROWS.slice(0, 2).map((row, ri) => (
                  <div key={ri} className="flex justify-center mb-[10px]" style={{ gap: 6 }}>
                    {row.map((key) => (
                      <IosKey key={key} label={key} active={activeKey === key} />
                    ))}
                  </div>
                ))}
                <div className="flex justify-center mb-[10px]" style={{ gap: 6 }}>
                  <IosSpecialKey label="⇧" wide />
                  {KEYBOARD_ROWS[2].map((key) => (
                    <IosKey key={key} label={key} active={activeKey === key} />
                  ))}
                  <IosSpecialKey label="⌫" wide />
                </div>
                <div className="flex justify-center" style={{ gap: 6, paddingLeft: 4, paddingRight: 4 }}>
                  <IosSpecialKey label="123" flex={1.1} />
                  <div
                    className="flex items-center justify-center"
                    style={{ flex: 4, height: 44, background: '#3a3a3c', borderRadius: 10, fontSize: 15, boxShadow: '0 1px 0 rgba(0,0,0,0.5)', color: '#ebebf5cc' }}
                  >
                    space
                  </div>
                  <IosSpecialKey label="return" flex={1.4} small />
                </div>
                <div className="flex justify-center pt-2 pb-1">
                  <div style={{ width: 120, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Home bar */}
          {!isTypingBeat && (
            <div className="flex justify-center pb-3 pt-1 shrink-0" style={{ background: '#000' }}>
              <div className="w-28 h-1 bg-white/20 rounded-full" />
            </div>
          )}
        </motion.div>
      )}

      {/* Choices — bottom sheet on mobile, side panel on desktop */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10
                   md:relative md:inset-auto md:z-auto md:order-1 md:shrink-0 md:w-auto"
      >
        <AnimatePresence>
          {showChoices && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="bg-background/95 backdrop-blur-md border-t border-border/40
                         px-5 pt-4 pb-10 space-y-3
                         md:bg-transparent md:backdrop-blur-none md:border-0
                         md:px-0 md:py-0 md:space-y-3 md:max-w-xs"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {beat === 'beat1' ? 'Message Lazlo' : "He's seen it. No reply. What do you do?"}
              </p>

              {beat === 'beat1' && TONE_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startTyping(opt)}
                  className="w-full text-left"
                  style={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                    padding: '12px 16px',
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
                  className="w-full text-left"
                  style={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                    padding: '12px 16px',
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
        {!showChoices && beat !== 'day-card' && beat !== 'beat3-day' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden md:block font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground px-0 py-4"
          >
            Before you arrive
          </motion.p>
        )}
      </div>
    </div>
  );
}

function ThreadBubble({ text, isYou, label, time, seen, seenTime }: {
  text: string; isYou: boolean; label: string; time: string; seen?: boolean; seenTime?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isYou ? 'flex-end' : 'flex-start', marginTop: 10 }}>
      <span style={{ fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8e8e93', marginBottom: 3, paddingRight: isYou ? 4 : 0, paddingLeft: isYou ? 0 : 4 }}>
        {label} · {time}
      </span>
      <div style={{ position: 'relative', maxWidth: '75%' }}>
        <div style={{ padding: '8px 14px', fontSize: 15, lineHeight: 1.4, fontFamily: '-apple-system, sans-serif', background: isYou ? '#0a84ff' : '#3a3a3c', color: '#fff', borderRadius: isYou ? '20px 20px 4px 20px' : '20px 20px 20px 4px' }}>
          {text}
        </div>
        <div style={{ position: 'absolute', bottom: 0, ...(isYou ? { right: -6 } : { left: -6 }), width: 0, height: 0, borderTop: '10px solid transparent', ...(isYou ? { borderLeft: '10px solid #0a84ff' } : { borderRight: '10px solid #3a3a3c' }) }} />
      </div>
      {isYou && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: 11, color: '#8e8e93', fontFamily: '-apple-system, sans-serif', marginTop: 3, paddingRight: 4 }}
        >
          {seen ? `Read ${seenTime}` : 'Delivered'}
        </motion.span>
      )}
    </div>
  );
}

function IosKey({ label, active }: { label: string; active: boolean }) {
  return (
    <motion.div
      animate={active ? { backgroundColor: '#ffffff', color: '#000000', scale: 1.12, y: -2 } : { backgroundColor: '#3a3a3c', color: '#ffffff', scale: 1, y: 0 }}
      transition={{ duration: 0.06 }}
      className="flex items-center justify-center select-none"
      style={{ width: 32, height: 44, borderRadius: 10, fontSize: 17, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', fontWeight: 400, boxShadow: '0 1px 0 rgba(0,0,0,0.5)' }}
    >
      {label}
    </motion.div>
  );
}

function IosSpecialKey({ label, wide, flex, small }: { label: string; wide?: boolean; flex?: number; small?: boolean }) {
  return (
    <div
      className="flex items-center justify-center select-none"
      style={{ width: wide ? 42 : undefined, flex: flex ?? (wide ? undefined : 1), height: 44, borderRadius: 10, background: '#636366', color: '#ffffff', fontSize: small ? 15 : wide ? 20 : 15, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', fontWeight: 400, boxShadow: '0 1px 0 rgba(0,0,0,0.5)', whiteSpace: 'nowrap' }}
    >
      {label}
    </div>
  );
}
