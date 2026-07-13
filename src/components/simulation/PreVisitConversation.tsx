import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreVisitConversationData, PreVisitChoice } from '@/types/simulation';
import { playUiTick, playHoverTick } from '@/lib/sfx';

interface Props {
  data: PreVisitConversationData;
  onComplete: (choiceIds: string[], finalTrust: number) => void;
}

type PhaseState =
  | { kind: 'incoming'; exchangeIdx: number; msgIdx: number }
  | { kind: 'choosing'; exchangeIdx: number }
  | { kind: 'response'; exchangeIdx: number; choice: PreVisitChoice }
  | { kind: 'done' };

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

/** Formats minutes-since-midnight as a 12-hour clock, e.g. "1:53 PM". */
function formatClock(totalMinutes: number) {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

type ThreadMessage = {
  sender: 'contact' | 'you';
  text: string;
  time: string;
  seen?: boolean;
  seenTime?: string;
};

export function PreVisitConversation({ data, onComplete }: Props) {
  const [introIdx, setIntroIdx] = useState(0);
  const introLines = data.introNarrative ?? [];
  const [introDone, setIntroDone] = useState(introLines.length === 0);

  const [thread, setThread] = useState<ThreadMessage[]>([]);
  // Drives the in-fiction clock — starts mid-afternoon, advances a little with each message.
  const clockRef = useRef(13 * 60 + 50); // 1:50 PM
  const nextTime = () => {
    clockRef.current += 1 + Math.floor(Math.random() * 3);
    return formatClock(clockRef.current);
  };
  const [phase, setPhase] = useState<PhaseState>({ kind: 'incoming', exchangeIdx: 0, msgIdx: 0 });
  const [trust, setTrust] = useState(data.baseTrust);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const [pendingChoice, setPendingChoice] = useState<PreVisitChoice | null>(null);

  // Typing animation state
  const [typingText, setTypingText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [sendReady, setSendReady] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread, typingText]);

  // Drive incoming messages
  useEffect(() => {
    if (phase.kind !== 'incoming') return;
    const { exchangeIdx, msgIdx } = phase;
    const exchange = data.exchanges[exchangeIdx];
    if (!exchange) return;

    const msg = exchange.incoming[msgIdx];
    if (!msg) {
      setPhase({ kind: 'choosing', exchangeIdx });
      return;
    }

    // Give user time to read the previous message before the next one appears
    const prevMsg = exchange.incoming[msgIdx - 1];
    const readingTime = prevMsg
      ? Math.max(1800, prevMsg.split(' ').length * 280)
      : 800;
    const typingTime = Math.max(600, msg.split(' ').length * 60);
    const delay = msgIdx === 0 ? 800 : readingTime + typingTime;

    const t = setTimeout(() => {
      playUiTick();
      setThread((prev) => [...prev, { sender: 'contact', text: msg, time: nextTime() }]);
      setPhase({ kind: 'incoming', exchangeIdx, msgIdx: msgIdx + 1 });
    }, delay);
    return () => clearTimeout(t);
  }, [phase, data.exchanges]);

  const handleChoice = (choice: PreVisitChoice) => {
    if (isTyping) return;
    playSelect();
    setFullText(choice.text);
    setTypingText('');
    setIsTyping(true);
    setActiveKey(null);

    // Cancel any previous typing
    typingRef.current.cancelled = true;
    const ctrl = { cancelled: false };
    typingRef.current = ctrl;

    const chars = choice.text.split('');
    let i = 0;

    const typeNext = () => {
      if (ctrl.cancelled) return;
      if (i >= chars.length) {
        // Typing done — light up send button, then send after brief pause
        setActiveKey(null);
        setSendReady(true);
        setTimeout(() => {
          if (ctrl.cancelled) return;
          setSendReady(false);
          setIsTyping(false);
          setTypingText('');
          setFullText('');
          commitChoice(choice);
        }, 500);
        return;
      }
      const ch = chars[i];
      setActiveKey(ch.toUpperCase().match(/[A-Z]/) ? ch.toUpperCase() : null);
      setTypingText(choice.text.slice(0, i + 1));
      i++;
      // Human-paced typing: slower base, longer pauses after spaces and punctuation
      const isPause = ch === ' ' || ch === ',' || ch === '.' || ch === '!' || ch === '?';
      const delay = isPause
        ? 120 + Math.random() * 80
        : 55 + Math.random() * 45;
      setTimeout(typeNext, delay);
    };

    setTimeout(typeNext, 80);
  };

  const commitChoice = (choice: PreVisitChoice) => {
    const newTrust = Math.max(0, Math.min(100, trust + choice.trustDelta));
    setTrust(newTrust);
    setChoiceIds((prev) => [...prev, choice.id]);
    const sentTime = nextTime();
    setThread((prev) => [...prev, { sender: 'you', text: choice.text, time: sentTime }]);
    setPendingChoice(choice);

    // Mark the just-sent message as read once the contact's reply comes in
    const markSeen = (seenTime: string) => {
      setThread((prev) => {
        const idx = prev.map((m) => m.sender).lastIndexOf('you');
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = { ...next[idx], seen: true, seenTime };
        return next;
      });
    };

    if (choice.response) {
      const t = setTimeout(() => {
        playUiTick();
        const replyTime = nextTime();
        markSeen(replyTime);
        setThread((prev) => [...prev, { sender: 'contact', text: choice.response!, time: replyTime }]);
        setPendingChoice(null);
        advanceExchange(choice, newTrust);
      }, 900);
      return () => clearTimeout(t);
    } else {
      markSeen(sentTime);
      advanceExchange(choice, newTrust);
    }
  };

  const advanceExchange = (choice: PreVisitChoice, currentTrust: number) => {
    const next = (phase as { exchangeIdx: number }).exchangeIdx + 1;
    if (next < data.exchanges.length) {
      setTimeout(() => {
        setPhase({ kind: 'incoming', exchangeIdx: next, msgIdx: 0 });
      }, 500);
    } else {
      setTimeout(() => {
        setPhase({ kind: 'done' });
        onComplete([...choiceIds, choice.id], currentTrust);
      }, 800);
    }
  };

  const isChoosing = phase.kind === 'choosing' && !pendingChoice && !isTyping;

  if (!introDone) {
    const advanceIntro = () => {
      playUiTick();
      if (introIdx + 1 < introLines.length) {
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
              <p className="narrative-text">{introLines[introIdx]}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="hud-label opacity-50">
                  {String(introIdx + 1).padStart(2, '0')} / {String(introLines.length).padStart(2, '0')}
                </span>
                <motion.span
                  className="flex items-center gap-2 bg-primary/90 text-primary-foreground font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2"
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {introIdx + 1 >= introLines.length ? 'Continue' : 'Next'}
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
    <div className="fixed inset-0 bg-background flex flex-col md:flex-row items-center justify-center z-50 gap-2 md:gap-8 px-4 md:px-8 pt-2 pb-3 md:py-0">

      {/* Left panel on desktop / bottom panel on mobile: choices or scene label */}
      <div className="flex flex-col justify-center w-full md:shrink-0 md:w-auto order-2 md:order-1" style={{ maxWidth: 'min(320px, 90vw)' }}>
        <AnimatePresence>
          {isChoosing && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-2"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Choose your reply
              </p>
              {data.exchanges[
                (phase as { exchangeIdx: number }).exchangeIdx
              ]?.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  onPointerEnter={() => playHoverTick()}
                  className="w-full text-left transition-colors"
                  style={{
                    padding: '11px 16px',
                    background: 'hsl(var(--secondary))',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14,
                    color: 'hsl(var(--foreground))',
                    fontSize: 14,
                    fontFamily: '-apple-system, sans-serif',
                    lineHeight: 1.45,
                    cursor: 'pointer',
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {!isChoosing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
          >
            Before you arrive
          </motion.p>
        )}
      </div>

      {/* Right: Phone frame */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-background relative overflow-hidden order-1 md:order-2 max-h-[68vh] md:max-h-[95vh]"
        style={{
          width: 'min(360px, 82vw)',
          height: isTyping ? 'min(880px, 95vh)' : 'min(780px, 92vh)',
          borderRadius: '3rem',
          border: '10px solid #1a1a1a',
          boxShadow: '0 0 0 1px #333, 0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1.5px rgba(255,255,255,0.12), inset 0 0 0 4px rgba(0,0,0,0.95)',
          transition: 'height 0.3s ease',
        }}
      >
        {/* Dynamic island */}
        <div className="absolute top-0 inset-x-0 flex justify-center pt-3 z-10">
          <div style={{ width: 120, height: 34, background: '#000', borderRadius: 20 }} />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-10 pb-1 shrink-0">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, sans-serif' }}>09:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal */}
            {[3,4,5,6].map(h => <div key={h} style={{ width: 3, height: h, background: '#fff', borderRadius: 1 }} />)}
            {/* WiFi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="white"><path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM7.5 5c1.4 0 2.6.5 3.6 1.4l-1.1 1.1A3.5 3.5 0 0 0 7.5 6.5a3.5 3.5 0 0 0-2.5 1L3.9 6.4A5 5 0 0 1 7.5 5zm0-3.5C9.7 1.5 11.7 2.4 13.2 4l-1.1 1A6 6 0 0 0 7.5 3a6 6 0 0 0-4.6 2L1.8 4A7.5 7.5 0 0 1 7.5 1.5z"/></svg>
            {/* Battery */}
            <div style={{ width: 24, height: 12, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', padding: '1px 1.5px' }}>
              <div style={{ width: '85%', height: '100%', background: '#fff', borderRadius: 1 }} />
              <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 2, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* iMessage header */}
        <div className="flex items-center px-4 py-2 shrink-0" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
          {/* Back */}
          <div className="flex items-center gap-0.5" style={{ color: '#0a84ff', minWidth: 60 }}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8.5 1L1.5 8l7 7" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 17, fontFamily: '-apple-system, sans-serif', color: '#0a84ff' }}>Back</span>
          </div>
          {/* Avatar + name centre */}
          <div className="flex-1 flex flex-col items-center">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
              <span style={{ color: '#fff', fontSize: 15, fontFamily: '-apple-system, sans-serif', fontWeight: 500 }}>{data.contactInitial}</span>
            </div>
            <span style={{ fontSize: 12, color: '#fff', fontFamily: '-apple-system, sans-serif', fontWeight: 500 }}>{data.contactName}</span>
          </div>
          {/* Call + video icons */}
          <div className="flex items-center gap-4" style={{ minWidth: 60, justifyContent: 'flex-end' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="#0a84ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg width="20" height="14" viewBox="0 0 24 18" fill="none"><rect x="1" y="1" width="15" height="16" rx="2" stroke="#0a84ff" strokeWidth="1.8"/><path d="M16 6l7-4v14l-7-4V6z" stroke="#0a84ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <AnimatePresence initial={false}>
            {thread.map((msg, i) => {
              const isYou = msg.sender === 'you';
              const prevSame = thread[i - 1]?.sender === msg.sender;
              const nextSame = thread[i + 1]?.sender === msg.sender;
              const showTail = !nextSame;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: isYou ? 'flex-end' : 'flex-start', marginTop: prevSame ? 1 : 10 }}
                >
                  {!prevSame && (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#8e8e93',
                        marginBottom: 3,
                        paddingRight: isYou ? 4 : 0,
                        paddingLeft: isYou ? 0 : 4,
                      }}
                    >
                      {isYou ? 'You' : data.contactName} · {msg.time}
                    </span>
                  )}
                  <div style={{ position: 'relative', maxWidth: '75%' }}>
                    <div
                      style={{
                        padding: '8px 14px',
                        fontSize: 15,
                        lineHeight: 1.4,
                        fontFamily: '-apple-system, sans-serif',
                        background: isYou ? '#0a84ff' : '#3a3a3c',
                        color: '#fff',
                        borderRadius: isYou
                          ? showTail ? '20px 20px 4px 20px' : '20px'
                          : showTail ? '20px 20px 20px 4px' : '20px',
                      }}
                    >
                      {msg.text}
                    </div>
                    {/* Bubble tail */}
                    {showTail && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        ...(isYou ? { right: -6 } : { left: -6 }),
                        width: 0,
                        height: 0,
                        borderTop: '10px solid transparent',
                        ...(isYou
                          ? { borderLeft: '10px solid #0a84ff' }
                          : { borderRight: '10px solid #3a3a3c' }),
                      }} />
                    )}
                  </div>
                  {isYou && showTail && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{ fontSize: 11, color: '#8e8e93', fontFamily: '-apple-system, sans-serif', marginTop: 3, paddingRight: 4 }}
                    >
                      {msg.seen ? `Read ${msg.seenTime}` : 'Delivered'}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing indicator — shown while waiting for Lilly's next message or response */}
          {(phase.kind === 'incoming' || !!pendingChoice) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: '#3a3a3c', borderRadius: '20px 20px 20px 4px', padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map((d) => (
                  <motion.div
                    key={d}
                    style={{ width: 7, height: 7, borderRadius: '50%', background: '#ebebf599' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>


        {/* Compose bar */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="shrink-0 flex items-center gap-2 px-3 py-2"
              style={{ borderTop: '0.5px solid rgba(255,255,255,0.12)', background: '#1c1c1e' }}
            >
              {/* Camera icon */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" fill="#3a3a3c"/>
                <path d="M8 10.5h1.5l1-2h7l1 2H20a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" stroke="#ebebf5" strokeWidth="1.2" fill="none"/>
                <circle cx="14" cy="15" r="2.5" stroke="#ebebf5" strokeWidth="1.2"/>
              </svg>
              {/* Input field */}
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
              {/* Send button */}
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

        {/* iOS-style keyboard */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.18 }}
              className="shrink-0"
              style={{ background: '#1c1c1e', paddingTop: 10, paddingBottom: 4 }}
            >
              {/* Rows 1 & 2 — letter keys */}
              {KEYBOARD_ROWS.slice(0, 2).map((row, ri) => (
                <div key={ri} className="flex justify-center mb-[10px]" style={{ gap: 6 }}>
                  {row.map((key) => (
                    <IosKey key={key} label={key} active={activeKey === key} />
                  ))}
                </div>
              ))}
              {/* Row 3 — shift + letters + backspace */}
              <div className="flex justify-center mb-[10px]" style={{ gap: 6 }}>
                <IosSpecialKey label="⇧" wide />
                {KEYBOARD_ROWS[2].map((key) => (
                  <IosKey key={key} label={key} active={activeKey === key} />
                ))}
                <IosSpecialKey label="⌫" wide />
              </div>
              {/* Row 4 — 123 / space / return */}
              <div className="flex justify-center" style={{ gap: 6, paddingLeft: 4, paddingRight: 4 }}>
                <IosSpecialKey label="123" flex={1.1} />
                <div
                  className="flex items-center justify-center text-white"
                  style={{
                    flex: 4,
                    height: 44,
                    background: '#3a3a3c',
                    borderRadius: 10,
                    fontSize: 16,
                    boxShadow: '0 1px 0 rgba(0,0,0,0.5)',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span style={{ fontSize: 15, color: '#ebebf5cc' }}>space</span>
                </div>
                <IosSpecialKey label="return" flex={1.4} small />
              </div>
              {/* Home indicator */}
              <div className="flex justify-center pt-2 pb-1">
                <div style={{ width: 120, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home bar */}
        <div className="flex justify-center pb-3 pt-1 shrink-0">
          <div className="w-28 h-1 bg-foreground/20 rounded-full" />
        </div>
      </motion.div>

    </div>
  );
}

function IosKey({ label, active }: { label: string; active: boolean }) {
  return (
    <motion.div
      animate={
        active
          ? { backgroundColor: '#ffffff', color: '#000000', scale: 1.12, y: -2 }
          : { backgroundColor: '#3a3a3c', color: '#ffffff', scale: 1, y: 0 }
      }
      transition={{ duration: 0.06 }}
      className="flex items-center justify-center text-white select-none"
      style={{
        width: 32,
        height: 44,
        borderRadius: 10,
        fontSize: 17,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        fontWeight: 400,
        boxShadow: '0 1px 0 rgba(0,0,0,0.5)',
        letterSpacing: 0,
      }}
    >
      {label}
    </motion.div>
  );
}

function IosSpecialKey({ label, wide, flex, small }: { label: string; wide?: boolean; flex?: number; small?: boolean }) {
  return (
    <div
      className="flex items-center justify-center select-none"
      style={{
        width: wide ? 42 : undefined,
        flex: flex ?? (wide ? undefined : 1),
        height: 44,
        borderRadius: 10,
        background: '#636366',
        color: '#ffffff',
        fontSize: small ? 15 : wide ? 20 : 15,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        fontWeight: 400,
        boxShadow: '0 1px 0 rgba(0,0,0,0.5)',
        letterSpacing: wide && label.length === 1 ? 0 : '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
}

function playSelect() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // silently ignore
  }
}
