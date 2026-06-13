import { motion } from 'framer-motion';
import { Choice, Mode } from '@/types/simulation';
import { playUiTick } from '@/lib/sfx';

interface FeedbackPanelProps {
  choice: Choice;
  onContinue: () => void;
  /** In learning mode the story consequence IS the feedback - no professional commentary. */
  mode?: Mode;
}

export function FeedbackPanel({ choice, onContinue, mode = 'training' }: FeedbackPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      {/* Consequence — in training mode labelled; in learning mode pure narrative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="case-panel mb-px"
      >
        {mode === 'training' && (
          <div className="px-6 py-3 border-b border-border">
            <span className="hud-label text-primary">What happens</span>
          </div>
        )}
        <p className={`px-6 text-foreground/90 leading-relaxed ${mode === 'learning' ? 'py-6 text-base md:text-xl italic' : 'py-5 text-base md:text-lg'}`}>
          {choice.consequence}
        </p>
      </motion.div>

      {/* Reflection note — training mode only: in learning mode the
          consequence carries the lesson (cause and effect). */}
      {mode === 'training' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="case-panel"
        >
          <div className="px-6 py-3 border-b border-border">
            <span className="hud-label">Something to consider</span>
          </div>
          <p className="px-6 py-4 text-sm text-foreground/75 leading-relaxed">
            {choice.feedback}
          </p>
        </motion.div>
      )}

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex justify-center"
      >
        <button
          onClick={() => {
            playUiTick();
            onContinue();
          }}
          className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-primary/90 transition-colors"
        >
          Continue ▸
        </button>
      </motion.div>
    </motion.div>
  );
}
