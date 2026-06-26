import { useState } from 'react';
import { motion } from 'framer-motion';
import { PreFeedback } from '@/lib/feedback';

interface Props {
  onComplete: (data: PreFeedback) => void;
  /** Scenario domain — adapts the confidence question to what this story is actually about. */
  domain?: string;
}

const CONFIDENCE_OPTIONS = [
  'Not at all confident',
  'Slightly confident',
  'Fairly confident',
  'Very confident',
  'Completely confident',
];

const CONFIDENCE_QUESTION_BY_DOMAIN: Record<string, string> = {
  'anti-radicalisation':
    'How confident do you feel in your ability to recognise the signs that someone may be being drawn into extremism?',
  'child-safeguarding':
    'How confident do you feel in your ability to recognise the signs that a child might be experiencing abuse at home?',
};
const DEFAULT_CONFIDENCE_QUESTION =
  'How confident do you feel in your ability to recognise the signs that someone may be at risk?';

export function PreFeedbackGate({ onComplete, domain }: Props) {
  const [priorTraining, setPriorTraining] = useState('');
  const [confidenceBefore, setConfidenceBefore] = useState('');

  const canContinue = priorTraining && confidenceBefore;

  return (
    <div className="fixed inset-0 bg-background overflow-y-auto z-50">
      <div className="min-h-full flex items-start justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="content-card max-w-lg w-full p-7 md:p-9"
      >
        <p className="page-label mb-2">Before you begin</p>
        <p className="text-sm text-foreground/70 leading-relaxed mb-8">
          Two quick questions before you start — your answers help us understand the impact of this experience.
        </p>

        {/* Q1 */}
        <div className="mb-7">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground mb-4">
            Have you previously completed safeguarding training?
          </p>
          <div className="space-y-2">
            {['Yes', 'No', "I'm not sure"].map((opt) => (
              <button
                key={opt}
                onClick={() => setPriorTraining(opt)}
                className={`w-full text-left px-4 py-3 border transition-colors text-sm ${
                  priorTraining === opt
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-secondary/40 text-foreground/70 hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q2 */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground mb-4">
            {(domain && CONFIDENCE_QUESTION_BY_DOMAIN[domain]) ?? DEFAULT_CONFIDENCE_QUESTION}
          </p>
          <div className="space-y-2">
            {CONFIDENCE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setConfidenceBefore(opt)}
                className={`w-full text-left px-4 py-3 border transition-colors text-sm ${
                  confidenceBefore === opt
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-secondary/40 text-foreground/70 hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            disabled={!canContinue}
            onClick={() => onComplete({ priorTraining, confidenceBefore })}
            className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          >
            Begin
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
