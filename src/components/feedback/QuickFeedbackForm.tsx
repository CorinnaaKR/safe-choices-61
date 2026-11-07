import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onComplete: (data: QuickFeedback) => void;
  onSkip: () => void;
}

export interface QuickFeedback {
  engagingScore: number;
  realisticScore: number;
  oneThingToChange: string;
}

export function QuickFeedbackForm({ onComplete, onSkip }: Props) {
  const [engaging, setEngaging] = useState(0);
  const [realistic, setRealistic] = useState(0);
  const [change, setChange] = useState('');

  const canSubmit = engaging > 0 && realistic > 0;

  return (
    <div className="fixed inset-0 bg-background overflow-y-auto z-50">
      <div className="min-h-full flex items-start justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="content-card max-w-lg w-full p-7 md:p-9"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="page-label">Quick feedback</p>
            <button
              onClick={onSkip}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed mb-8">
            Three quick questions — takes under a minute.
          </p>

          <RatingQuestion
            label="How engaging did you find the experience?"
            value={engaging}
            onChange={setEngaging}
            lowLabel="Not engaging"
            highLabel="Extremely engaging"
          />

          <RatingQuestion
            label="Did the scenario feel realistic?"
            value={realistic}
            onChange={setRealistic}
            lowLabel="Not realistic"
            highLabel="Very realistic"
          />

          <div className="mb-7">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground mb-4">
              Is there one thing you'd change or improve?
            </p>
            <textarea
              value={change}
              onChange={e => setChange(e.target.value)}
              placeholder="Optional"
              rows={3}
              className="w-full bg-secondary/40 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <button
              disabled={!canSubmit}
              onClick={() => onComplete({ engagingScore: engaging, realisticScore: realistic, oneThingToChange: change })}
              className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            >
              Submit
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RatingQuestion({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div className="mb-7">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground mb-4 leading-relaxed">
        {label}
      </p>
      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-10 h-10 border font-mono text-sm transition-colors ${
              value === n
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-secondary/40 text-foreground/60 hover:border-primary/50'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground px-0.5">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
