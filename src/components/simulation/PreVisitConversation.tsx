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

export function PreVisitConversation({ data, onComplete }: Props) {
  const [thread, setThread] = useState<{ sender: 'contact' | 'you'; text: string }[]>([]);
  const [phase, setPhase] = useState<PhaseState>({ kind: 'incoming', exchangeIdx: 0, msgIdx: 0 });
  const [trust, setTrust] = useState(data.baseTrust);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const [pendingChoice, setPendingChoice] = useState<PreVisitChoice | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  // Drive the "incoming messages arrive one by one" sequencing
  useEffect(() => {
    if (phase.kind !== 'incoming') return;
    const { exchangeIdx, msgIdx } = phase;
    const exchange = data.exchanges[exchangeIdx];
    if (!exchange) return;

    const msg = exchange.incoming[msgIdx];
    if (!msg) {
      // All incoming for this exchange shown → offer choices
      setPhase({ kind: 'choosing', exchangeIdx });
      return;
    }

    const delay = msgIdx === 0 ? 600 : 900;
    const t = setTimeout(() => {
      playUiTick();
      setThread((prev) => [...prev, { sender: 'contact', text: msg }]);
      setPhase({ kind: 'incoming', exchangeIdx, msgIdx: msgIdx + 1 });
    }, delay);
    return () => clearTimeout(t);
  }, [phase, data.exchanges]);

  const handleChoice = (choice: PreVisitChoice) => {
    playSelect();
    const newTrust = Math.max(0, Math.min(100, trust + choice.trustDelta));
    setTrust(newTrust);
    setChoiceIds((prev) => [...prev, choice.id]);
    setThread((prev) => [...prev, { sender: 'you', text: choice.text }]);
    setPendingChoice(choice);

    if (choice.response) {
      // Show Lilly's reply then advance
      const t = setTimeout(() => {
        playUiTick();
        setThread((prev) => [...prev, { sender: 'contact', text: choice.response! }]);
        setPendingChoice(null);
        advanceExchange(choice, newTrust);
      }, 1200);
      return () => clearTimeout(t);
    } else {
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

  const isChoosing = phase.kind === 'choosing' && !pendingChoice;

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      {/* Phone frame */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm h-[680px] flex flex-col border border-border bg-background relative overflow-hidden"
        style={{ borderRadius: '2.5rem', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}
      >
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 flex justify-center pt-2 z-10">
          <div className="w-24 h-5 bg-background border-b border-border rounded-b-xl" />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-8 pb-2 shrink-0">
          <span className="font-mono text-[10px] text-muted-foreground">09:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-2 border border-muted-foreground rounded-sm relative">
              <div className="absolute inset-y-0.5 left-0.5 right-1 bg-muted-foreground rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Contact header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="font-mono text-sm text-foreground">{data.contactInitial}</span>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground">
              {data.contactName}
            </p>
            {data.contactSubtitle && (
              <p className="font-mono text-[10px] text-muted-foreground">{data.contactSubtitle}</p>
            )}
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0">
          <AnimatePresence initial={false}>
            {thread.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] px-3.5 py-2 text-sm leading-relaxed ${
                    msg.sender === 'you'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground border border-border'
                  }`}
                  style={{ borderRadius: msg.sender === 'you' ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {phase.kind === 'incoming' && (phase as { msgIdx: number }).msgIdx > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-secondary border border-border px-3.5 py-2.5 flex gap-1" style={{ borderRadius: '18px 18px 18px 4px' }}>
                {[0, 1, 2].map((d) => (
                  <motion.div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Reply choices */}
        <AnimatePresence>
          {isChoosing && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="border-t border-border px-3 py-3 space-y-1.5 shrink-0 bg-background"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground px-1 mb-2">
                Your reply
              </p>
              {data.exchanges[
                (phase as { exchangeIdx: number }).exchangeIdx
              ]?.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  onPointerEnter={() => playHoverTick()}
                  className="w-full text-left px-3.5 py-2.5 bg-secondary border border-border hover:border-primary/60 hover:bg-secondary/80 transition-colors text-sm text-foreground leading-snug"
                  style={{ borderRadius: '18px 18px 18px 4px' }}
                >
                  {choice.text}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home bar */}
        <div className="flex justify-center pb-3 pt-1 shrink-0">
          <div className="w-28 h-1 bg-foreground/20 rounded-full" />
        </div>
      </motion.div>

      {/* Scene stamp below phone */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-6"
      >
        Before you arrive
      </motion.p>
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
    // silently ignore if AudioContext unavailable
  }
}
