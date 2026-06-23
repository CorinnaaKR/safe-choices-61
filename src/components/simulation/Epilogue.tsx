import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EpilogueData, EpilogueMiddle } from '@/types/simulation';
import { playUiTick } from '@/lib/sfx';

interface Props {
  data: EpilogueData;
  outcome: 'good' | 'sobering' | 'middle';
  onComplete: () => void;
}

export function Epilogue({ data, outcome, onComplete }: Props) {
  if (outcome === 'good') {
    return <GoodEpilogue data={data.good} onComplete={onComplete} />;
  }
  if (outcome === 'middle' && data.middle) {
    return <MiddleEpilogue data={data.middle} onComplete={onComplete} />;
  }
  return <SoberingEpilogue data={data.sobering} onComplete={onComplete} />;
}

/** Formats minutes-since-midnight as a 12-hour clock, e.g. "1:53 PM". */
function formatClock(totalMinutes: number) {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function GoodEpilogue({ data, onComplete }: { data: EpilogueData['good']; onComplete: () => void }) {
  const [shown, setShown] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef(11 * 60 + 20); // 11:20 AM
  const timesRef = useRef<string[]>([]);
  if (timesRef.current.length < data.messages.length) {
    while (timesRef.current.length < data.messages.length) {
      clockRef.current += 1 + Math.floor(Math.random() * 2);
      timesRef.current.push(formatClock(clockRef.current));
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shown]);

  useEffect(() => {
    if (shown >= data.messages.length) {
      const t = setTimeout(() => setShowContinue(true), 600);
      return () => clearTimeout(t);
    }
    const msg = data.messages[shown];
    const delay = shown === 0 ? 600 : Math.max(900, msg.text.split(' ').length * 220);
    const t = setTimeout(() => {
      playUiTick();
      setShown((s) => s + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [shown, data.messages]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 gap-5 px-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {data.sceneStamp}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-background relative overflow-hidden"
        style={{
          width: 'min(360px, 82vw)',
          height: 'min(640px, 80vh)',
          borderRadius: '3rem',
          border: '10px solid #1a1a1a',
          boxShadow:
            '0 0 0 1px #333, 0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1.5px rgba(255,255,255,0.12), inset 0 0 0 4px rgba(0,0,0,0.95)',
        }}
      >
        <div className="absolute top-0 inset-x-0 flex justify-center pt-3 z-10">
          <div style={{ width: 120, height: 34, background: '#000', borderRadius: 20 }} />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-12" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <AnimatePresence initial={false}>
            {data.messages.slice(0, shown).map((msg, i) => {
              const isYou = msg.sender === 'you';
              const prevSame = data.messages[i - 1]?.sender === msg.sender;
              const nextSame = data.messages[i + 1]?.sender === msg.sender;
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
                      {isYou ? 'You' : data.contactName} · {timesRef.current[i]}
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
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </motion.div>

      <AnimatePresence>
        {showContinue && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            View results
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiddleEpilogue({ data, onComplete }: { data: EpilogueMiddle; onComplete: () => void }) {
  const [cardShown, setCardShown] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (cardShown >= data.narrativeCard.length) {
      const t = setTimeout(() => setShowContinue(true), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      playUiTick();
      setCardShown((c) => c + 1);
    }, cardShown === 0 ? 900 : 2000);
    return () => clearTimeout(t);
  }, [cardShown, data.narrativeCard.length]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 gap-6 px-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {data.sceneStamp}
      </p>
      <div className="space-y-4 text-center" style={{ width: 'min(420px, 86vw)' }}>
        {data.narrativeCard.slice(0, cardShown).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-foreground/80 leading-relaxed"
          >
            {line}
          </motion.p>
        ))}
      </div>
      <AnimatePresence>
        {showContinue && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            View results
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function SoberingEpilogue({ data, onComplete }: { data: EpilogueData['sobering']; onComplete: () => void }) {
  const [sentShown, setSentShown] = useState(0);
  const [cardShown, setCardShown] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const clockRef = useRef(16 * 60 + 5); // 4:05 PM
  const timesRef = useRef<string[]>([]);
  if (timesRef.current.length < data.sentMessages.length) {
    while (timesRef.current.length < data.sentMessages.length) {
      clockRef.current += 6 + Math.floor(Math.random() * 4);
      timesRef.current.push(formatClock(clockRef.current));
    }
  }

  useEffect(() => {
    if (sentShown >= data.sentMessages.length) return;
    const t = setTimeout(() => {
      playUiTick();
      setSentShown((s) => s + 1);
    }, sentShown === 0 ? 700 : 2200);
    return () => clearTimeout(t);
  }, [sentShown, data.sentMessages.length]);

  useEffect(() => {
    if (sentShown < data.sentMessages.length) return;
    if (cardShown >= data.narrativeCard.length) {
      const t = setTimeout(() => setShowContinue(true), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCardShown((c) => c + 1), cardShown === 0 ? 1400 : 1600);
    return () => clearTimeout(t);
  }, [sentShown, cardShown, data]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 gap-5 px-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {data.sceneStamp}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-background relative overflow-hidden"
        style={{
          width: 'min(360px, 82vw)',
          height: 'min(420px, 50vh)',
          borderRadius: '3rem',
          border: '10px solid #1a1a1a',
          boxShadow:
            '0 0 0 1px #333, 0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1.5px rgba(255,255,255,0.12), inset 0 0 0 4px rgba(0,0,0,0.95)',
        }}
      >
        <div className="absolute top-0 inset-x-0 flex justify-center pt-3 z-10">
          <div style={{ width: 120, height: 34, background: '#000', borderRadius: 20 }} />
        </div>
        <div className="flex-1 px-3 py-12" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.sentMessages.slice(0, sentShown).map((text, i) => {
            const isLast = i === sentShown - 1 && sentShown >= data.sentMessages.length;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 10 }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#8e8e93',
                    marginBottom: 3,
                    paddingRight: 4,
                  }}
                >
                  You · {timesRef.current[i]}
                </span>
                <div
                  style={{
                    padding: '8px 14px',
                    fontSize: 15,
                    lineHeight: 1.4,
                    fontFamily: '-apple-system, sans-serif',
                    background: '#0a84ff',
                    color: '#fff',
                    borderRadius: '20px 20px 4px 20px',
                    maxWidth: '75%',
                  }}
                >
                  {text}
                </div>
                {isLast && (
                  <span style={{ fontSize: 11, color: '#8e8e93', fontFamily: '-apple-system, sans-serif', marginTop: 3, paddingRight: 4 }}>
                    Delivered
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {sentShown >= data.sentMessages.length && (
        <div className="space-y-3 text-center" style={{ width: 'min(360px, 82vw)' }}>
          {data.narrativeCard.slice(0, cardShown).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-foreground/80 leading-relaxed italic"
            >
              {line}
            </motion.p>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showContinue && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            View results
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
