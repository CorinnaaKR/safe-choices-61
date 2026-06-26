import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CallSceneData, Evidence } from '@/types/simulation';
import { playUiTick } from '@/lib/sfx';

interface Props {
  data: CallSceneData;
  collectedEvidence: Evidence[];
  /** Up to 3 evidence items the player may draw on across the call. */
  onComplete: (scriptIds: string[]) => void;
}

type Turn =
  | { kind: 'operator'; text: string; time: string }
  | { kind: 'you'; text: string; time: string };

function formatElapsed(totalSeconds: number) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function CallScene({ data, collectedEvidence, onComplete }: Props) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [waitingForChoice, setWaitingForChoice] = useState(false);
  const [usedEvidenceIds, setUsedEvidenceIds] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [callEnded, setCallEnded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef(0);
  secondsRef.current = seconds;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  // Call timer
  useEffect(() => {
    if (callEnded) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callEnded]);

  // Advance through operator lines automatically; pause when a step has choices
  useEffect(() => {
    if (callEnded) return;
    const step = data.steps[stepIdx];
    if (!step) {
      // All steps done — closing line
      const t = setTimeout(() => {
        playUiTick();
        setTurns((prev) => [...prev, { kind: 'operator', text: data.closingLine, time: formatElapsed(secondsRef.current) }]);
        setCallEnded(true);
      }, 900);
      return () => clearTimeout(t);
    }
    // Only push the operator line once per step
    let alreadyShown = false;
    setTurns((prev) => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (last.kind === 'operator' && last.text === step.operatorLine) {
          alreadyShown = true;
          return prev;
        }
      }
      return [...prev, { kind: 'operator', text: step.operatorLine, time: formatElapsed(secondsRef.current) }];
    });
    if (alreadyShown) return;

    if (!step.choices) {
      // Monologue step — no player input, auto-advance after a reading pause
      const delay = Math.max(1400, step.operatorLine.split(' ').length * 200);
      const t = setTimeout(() => setStepIdx((i) => i + 1), delay);
      return () => clearTimeout(t);
    }
    // Give the player time to read the operator's line before choices appear
    const readDelay = Math.max(900, step.operatorLine.split(' ').length * 150);
    const t = setTimeout(() => setWaitingForChoice(true), readDelay);
    return () => clearTimeout(t);
  }, [stepIdx, data.steps, data.closingLine, callEnded]);

  const availableChoices = (() => {
    const step = data.steps[stepIdx];
    if (!step?.choices) return [];
    const offered = step.choices.filter(
      (c) => !c.requiresEvidenceId || collectedEvidence.some((e) => e.id === c.requiresEvidenceId)
    );
    return offered;
  })();

  const handlePick = (text: string, evidenceId?: string) => {
    if (!waitingForChoice) return;
    playUiTick();
    setWaitingForChoice(false);
    setTurns((prev) => [...prev, { kind: 'you', text, time: formatElapsed(secondsRef.current) }]);
    if (evidenceId) setUsedEvidenceIds((prev) => [...prev, evidenceId]);
    setTimeout(() => setStepIdx((i) => i + 1), 1100);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const step = data.steps[stepIdx];
  const hasChoiceStep = !!step?.choices;

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 gap-5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-background relative overflow-hidden"
        style={{
          width: 'min(360px, 82vw)',
          height: 'min(780px, 92vh)',
          borderRadius: '3rem',
          border: '10px solid #1a1a1a',
          boxShadow:
            '0 0 0 1px #333, 0 32px 80px rgba(0,0,0,0.8), inset 0 0 0 1.5px rgba(255,255,255,0.12), inset 0 0 0 4px rgba(0,0,0,0.95)',
        }}
      >
        {/* Dynamic island */}
        <div className="absolute top-0 inset-x-0 flex justify-center pt-3 z-10">
          <div style={{ width: 120, height: 34, background: '#000', borderRadius: 20 }} />
        </div>

        {/* Call header */}
        <div className="flex flex-col items-center pt-12 pb-4 shrink-0" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.12)' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.08em', color: '#8e8e93', fontFamily: '-apple-system, sans-serif', textTransform: 'uppercase' }}>
            {callEnded ? 'Call ended' : 'Calling'}
          </span>
          <span style={{ fontSize: 19, fontWeight: 600, color: '#fff', fontFamily: '-apple-system, sans-serif', marginTop: 4 }}>
            {data.serviceName}
          </span>
          <span style={{ fontSize: 13, color: '#8e8e93', fontFamily: '-apple-system, sans-serif', marginTop: 2 }}>
            {data.phoneNumber}
          </span>
          <span style={{ fontSize: 13, color: '#0a84ff', fontFamily: '-apple-system, sans-serif', marginTop: 4 }}>
            {mm}:{ss}
          </span>
        </div>

        {/* Transcript — rendered as chat bubbles, like a live call transcript */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <AnimatePresence initial={false}>
            {turns.map((turn, i) => {
              const isYou = turn.kind === 'you';
              const prevSame = turns[i - 1]?.kind === turn.kind;
              const nextSame = turns[i + 1]?.kind === turn.kind;
              const showTail = !nextSame;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: isYou ? 'flex-end' : 'flex-start', marginTop: prevSame ? 2 : 12 }}
                >
                  {!prevSame && (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#8e8e93',
                        marginBottom: 4,
                        paddingRight: isYou ? 4 : 0,
                        paddingLeft: isYou ? 0 : 4,
                      }}
                    >
                      {turn.kind === 'operator' ? data.operatorName : 'You'} · {turn.time}
                    </span>
                  )}
                  <div style={{ position: 'relative', maxWidth: '78%' }}>
                    <div
                      style={{
                        padding: '8px 14px',
                        fontSize: 14,
                        lineHeight: 1.45,
                        fontFamily: '-apple-system, sans-serif',
                        background: isYou ? '#0a84ff' : '#3a3a3c',
                        color: '#fff',
                        borderRadius: isYou
                          ? showTail ? '20px 20px 4px 20px' : '20px'
                          : showTail ? '20px 20px 20px 4px' : '20px',
                      }}
                    >
                      {turn.text}
                    </div>
                    {showTail && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          ...(isYou ? { right: -6 } : { left: -6 }),
                          width: 0,
                          height: 0,
                          borderTop: '10px solid transparent',
                          ...(isYou ? { borderLeft: '10px solid #0a84ff' } : { borderRight: '10px solid #3a3a3c' }),
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* End call button */}
        {callEnded && (
          <div className="flex justify-center pb-8 pt-2 shrink-0">
            <button
              onClick={() => onComplete(usedEvidenceIds)}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#ff3b30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                  fill="white"
                  transform="rotate(135 12 12)"
                />
              </svg>
            </button>
          </div>
        )}
      </motion.div>

      {/* Reply choices — outside the phone, same pattern as PreVisitConversation */}
      <AnimatePresence>
        {hasChoiceStep && waitingForChoice && !callEnded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ width: 'min(360px, 82vw)' }}
            className="space-y-2"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-3">
              What do you say?
            </p>
            {availableChoices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handlePick(choice.text, choice.requiresEvidenceId)}
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
            {availableChoices.length === 0 && step?.fallbackChoiceText && (
              <button
                onClick={() => handlePick(step.fallbackChoiceText!)}
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
                {step.fallbackChoiceText}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!hasChoiceStep && !callEnded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          Making the call
        </motion.p>
      )}
    </div>
  );
}
