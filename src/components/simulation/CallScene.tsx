import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CallSceneData, Evidence } from '@/types/simulation';
import { playUiTick } from '@/lib/sfx';

interface Props {
  data: CallSceneData;
  collectedEvidence: Evidence[];
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

  useEffect(() => {
    if (callEnded) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callEnded]);

  useEffect(() => {
    if (callEnded) return;
    const step = data.steps[stepIdx];
    if (!step) {
      const t = setTimeout(() => {
        playUiTick();
        setTurns((prev) => [...prev, { kind: 'operator', text: data.closingLine, time: formatElapsed(secondsRef.current) }]);
        setCallEnded(true);
      }, 900);
      return () => clearTimeout(t);
    }
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
      const delay = Math.max(1400, step.operatorLine.split(' ').length * 200);
      const t = setTimeout(() => setStepIdx((i) => i + 1), delay);
      return () => clearTimeout(t);
    }
    const readDelay = Math.max(900, step.operatorLine.split(' ').length * 150);
    const t = setTimeout(() => setWaitingForChoice(true), readDelay);
    return () => clearTimeout(t);
  }, [stepIdx, data.steps, data.closingLine, callEnded]);

  const availableChoices = (() => {
    const step = data.steps[stepIdx];
    if (!step?.choices) return [];
    return step.choices.filter(
      (c) => !c.requiresEvidenceId || collectedEvidence.some((e) => e.id === c.requiresEvidenceId)
    );
  })();

  const handlePick = (text: string, evidenceId?: string) => {
    if (!waitingForChoice) return;
    playUiTick();
    setWaitingForChoice(false);
    setTurns((prev) => [...prev, { kind: 'you', text, time: formatElapsed(secondsRef.current) }]);
    if (evidenceId) setUsedEvidenceIds((prev) => [...prev, evidenceId]);
    setTimeout(() => setStepIdx((i) => i + 1), 1100);
  };

  const step = data.steps[stepIdx];
  const hasChoiceStep = !!step?.choices;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(to bottom, #0a0a0f 0%, #0f0f1a 100%)' }}
    >
      {/* Top — caller ID */}
      <div className="flex flex-col items-center pt-14 pb-6 px-6 shrink-0">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
              fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-white tracking-tight" style={{ fontFamily: '-apple-system, sans-serif' }}>
          {data.serviceName}
        </p>
        <p className="text-sm mt-1" style={{ color: '#8e8e93', fontFamily: '-apple-system, sans-serif' }}>
          {data.phoneNumber}
        </p>
        <p className="text-sm mt-2 tabular-nums" style={{ color: callEnded ? '#8e8e93' : '#30d158', fontFamily: '-apple-system, sans-serif' }}>
          {callEnded ? 'Call ended' : formatElapsed(seconds)}
        </p>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-6 min-h-0">
        <div className="max-w-lg mx-auto space-y-6 pb-4">
          <AnimatePresence initial={false}>
            {turns.map((turn, i) => {
              const isYou = turn.kind === 'you';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-1.5"
                    style={{ color: isYou ? '#0a84ff' : '#636366' }}>
                    {isYou ? 'You' : data.operatorName} · {turn.time}
                  </p>
                  <p className="text-base leading-relaxed"
                    style={{ color: isYou ? '#e0e0e0' : '#aeaeb2', fontFamily: '-apple-system, sans-serif' }}>
                    {turn.text}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom — choices or end call */}
      <div className="shrink-0 px-6 pb-12 pt-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {callEnded ? (
            <motion.div
              key="end"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={() => onComplete(usedEvidenceIds)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: '#ff3b30' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                      fill="white" transform="rotate(135 12 12)" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: '#636366' }}>
                  End call
                </span>
              </button>
            </motion.div>
          ) : hasChoiceStep && waitingForChoice ? (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-2.5"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-center mb-3"
                style={{ color: '#636366' }}>
                What do you say?
              </p>
              {(availableChoices.length > 0 ? availableChoices : step?.fallbackChoiceText ? [{ text: step.fallbackChoiceText, requiresEvidenceId: undefined }] : []).map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handlePick(choice.text, choice.requiresEvidenceId)}
                  className="w-full text-left transition-opacity hover:opacity-80 active:opacity-60"
                  style={{
                    padding: '13px 18px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14,
                    color: '#e0e0e0',
                    fontSize: 15,
                    fontFamily: '-apple-system, sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </motion.div>
          ) : !callEnded ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 py-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#636366' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
