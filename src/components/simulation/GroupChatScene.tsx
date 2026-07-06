/** Group chat scene — used for Jamie's Story "Asking Around" beat.
 *  Auto-plays a group iMessage thread, then shows the morning-after
 *  consequences and the player's two choices. */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Choice } from '@/types/simulation';
import { playUiTick } from '@/lib/sfx';

interface Props {
  choices: Choice[];
  onChoice: (choice: Choice) => void;
}

type ChatMsg = {
  text: string;
  time: string;
  isPlayer?: boolean;
};

const CHAT_MESSAGES: ChatMsg[] = [
  { text: 'hey have you noticed anything off with jamie lately', time: '7:12 PM', isPlayer: true },
  { text: 'yeah actually. why?', time: '7:13 PM' },
  { text: 'idk. just a feeling. something doesn\'t seem right', time: '7:14 PM', isPlayer: true },
  { text: 'yeah same. they\'ve been really quiet', time: '7:14 PM' },
  { text: 'more than quiet. i can\'t explain it', time: '7:15 PM', isPlayer: true },
  { text: 'i live next door you know. i\'ve heard stuff. didn\'t really want to say anything', time: '7:16 PM' },
  { text: 'what kind of stuff', time: '7:16 PM', isPlayer: true },
  { text: 'think something happened to his step-dad\'s job. So much shouting over there now. I tried asking Jamie about it, but he wouldn\'t talk to me and he\'s been avoiding me since', time: '7:17 PM' },
  { text: 'okay, i\'ll try talking to him and see if he\'s okay', time: '7:18 PM', isPlayer: true },
  { text: 'good shout I\'m worried too', time: '7:18 PM' },
];

const MORNING_LINES = [
  'You put your phone down and feel slightly better.',
  'Until the next morning.',
  'Jamie doesn\'t look at you when you walk in — not the not-looking of someone having a bad day, but the not-looking of someone who knows you talked about them.',
  'At break Marcus finds you. "Jamie\'s not happy. They know someone\'s been saying something." He looks uncomfortable. "You know what this lot are like. It got around."',
];

export function GroupChatScene({ choices, onChoice }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [chatDone, setChatDone] = useState(false);
  const [morningIdx, setMorningIdx] = useState(-1); // -1 = not started
  const [showChoices, setShowChoices] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-reveal messages one by one
  useEffect(() => {
    if (visibleCount >= CHAT_MESSAGES.length) {
      const t = setTimeout(() => setChatDone(true), 1200);
      return () => clearTimeout(t);
    }
    const msg = CHAT_MESSAGES[visibleCount];
    const delay = visibleCount === 0 ? 600 : msg.isPlayer ? 900 : 1400 + msg.text.length * 18;
    const t = setTimeout(() => {
      playUiTick();
      setVisibleCount((n) => n + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [visibleCount]);

  // Scroll to bottom as messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, morningIdx, showChoices]);

  // Advance morning narrative on tap
  const advanceMorning = () => {
    if (morningIdx < MORNING_LINES.length - 1) {
      playUiTick();
      setMorningIdx((i) => i + 1);
    } else {
      setShowChoices(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col md:flex-row items-center md:items-center justify-center z-50 px-4 py-6 gap-6">

      {/* Chat panel — fixed height, never shrinks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col relative overflow-hidden shrink-0"
        style={{
          width: 'min(380px, 94vw)',
          height: '80vh',
          borderRadius: '2.8rem',
          border: '10px solid #1a1a1a',
          boxShadow: '0 0 0 1px #333, 0 32px 80px rgba(0,0,0,0.9), inset 0 0 0 1.5px rgba(255,255,255,0.1)',
          background: '#000',
        }}
      >
        {/* Dynamic island */}
        <div className="absolute top-0 inset-x-0 flex justify-center pt-3 z-10 pointer-events-none">
          <div style={{ width: 120, height: 34, background: '#000', borderRadius: 20 }} />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-10 pb-1 shrink-0">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, sans-serif' }}>07:12</span>
          <div className="flex items-center gap-1.5">
            {[3,4,5,6].map(h => <div key={h} style={{ width: 3, height: h, background: '#fff', borderRadius: 1 }} />)}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="white"><path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM7.5 5c1.4 0 2.6.5 3.6 1.4l-1.1 1.1A3.5 3.5 0 0 0 7.5 6.5a3.5 3.5 0 0 0-2.5 1L3.9 6.4A5 5 0 0 1 7.5 5zm0-3.5C9.7 1.5 11.7 2.4 13.2 4l-1.1 1A6 6 0 0 0 7.5 3a6 6 0 0 0-4.6 2L1.8 4A7.5 7.5 0 0 1 7.5 1.5z"/></svg>
            <div style={{ width: 24, height: 12, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', padding: '1px 1.5px' }}>
              <div style={{ width: '85%', height: '100%', background: '#fff', borderRadius: 1 }} />
              <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 2, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* 1:1 chat header — Marcus */}
        <div className="flex items-center px-4 py-2 shrink-0" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#0a84ff', minWidth: 60, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8.5 1L1.5 8l7 7" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 17, fontFamily: '-apple-system, sans-serif' }}>Back</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ff9f0a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
              <span style={{ color: '#fff', fontSize: 15, fontFamily: '-apple-system, sans-serif', fontWeight: 600 }}>M</span>
            </div>
            <span style={{ fontSize: 12, color: '#fff', fontFamily: '-apple-system, sans-serif', fontWeight: 500 }}>Marcus</span>
          </div>
          <div className="flex items-center gap-4" style={{ minWidth: 60, justifyContent: 'flex-end' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="#0a84ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg width="20" height="14" viewBox="0 0 24 18" fill="none"><rect x="1" y="1" width="15" height="16" rx="2" stroke="#0a84ff" strokeWidth="1.8"/><path d="M16 6l7-4v14l-7-4V6z" stroke="#0a84ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <AnimatePresence initial={false}>
            {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => {
              const isPlayer = !!msg.isPlayer;
              const prev = CHAT_MESSAGES[i - 1];
              const next = CHAT_MESSAGES[i + 1];
              const sameAsPrev = !!prev && !!prev.isPlayer === isPlayer;
              const sameAsNext = !!next && !!next.isPlayer === isPlayer;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: isPlayer ? 'flex-end' : 'flex-start', marginTop: sameAsPrev ? 2 : 10 }}
                >
                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '8px 13px',
                      fontSize: 15,
                      lineHeight: 1.45,
                      fontFamily: '-apple-system, sans-serif',
                      background: isPlayer ? '#0a84ff' : '#2c2c2e',
                      color: '#fff',
                      borderRadius: isPlayer
                        ? sameAsNext ? '18px 18px 6px 18px' : '18px 18px 4px 18px'
                        : sameAsNext ? '18px 18px 18px 6px' : '18px 18px 18px 4px',
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing indicator while waiting for next message */}
          {visibleCount < CHAT_MESSAGES.length && visibleCount > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '8px 14px', background: '#2c2c2e', borderRadius: '18px 18px 18px 4px', alignSelf: 'flex-start', marginTop: 4 }}>
              {[0, 1, 2].map((d) => (
                <motion.div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8e8e93' }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.18 }} />
              ))}
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Home bar */}
        <div className="flex justify-center pb-3 pt-1 shrink-0">
          <div style={{ width: 100, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>
      </motion.div>

      {/* Morning-after narrative — beside the phone on wide screens, below on narrow */}
      <AnimatePresence>
        {chatDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full md:w-80 md:max-w-xs"
          >
            {morningIdx === -1 ? (
              <button
                onClick={() => { playUiTick(); setMorningIdx(0); }}
                className="w-full text-left"
                style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#fff', fontFamily: '-apple-system, sans-serif', fontSize: 14, cursor: 'pointer' }}
              >
                <span style={{ fontSize: 11, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'monospace', display: 'block', marginBottom: 6 }}>Next morning →</span>
                Tap to continue
              </button>
            ) : !showChoices ? (
              <motion.div
                key={morningIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="cursor-pointer"
                onClick={advanceMorning}
                style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }}
              >
                <p style={{ color: '#e5e5ea', fontFamily: '-apple-system, sans-serif', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
                  {MORNING_LINES[morningIdx]}
                </p>
                <p style={{ color: '#636366', fontSize: 12, marginTop: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {morningIdx < MORNING_LINES.length - 1 ? 'Tap to continue →' : 'What do you do? →'}
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <p style={{ fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#636366', marginBottom: 12 }}>
                  What do you do?
                </p>
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => onChoice(choice)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '13px 16px', background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14,
                      color: '#e5e5ea', fontSize: 14, fontFamily: '-apple-system, sans-serif',
                      lineHeight: 1.45, cursor: 'pointer',
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
