import { motion, AnimatePresence } from 'framer-motion';
import { Choice } from '@/types/simulation';
import { playSelect } from '@/lib/sfx';

interface ChoiceConfirmModalProps {
  choice: Choice;
  evidence: never[];
  onConfirm: (supportingEvidenceIds: string[]) => void;
  onCancel: () => void;
}

export function ChoiceConfirmModal({ choice, onConfirm, onCancel }: ChoiceConfirmModalProps) {
  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-[92vw] max-w-md case-panel"
        >
          <div className="px-6 py-5 border-b border-border">
            <p className="hud-label text-primary mb-3">Before you decide</p>
            <p className="text-base md:text-lg text-foreground leading-snug">
              "{choice.text}"
            </p>
          </div>

          <div className="px-6 py-4 flex items-center justify-between gap-3">
            <button
              onClick={onCancel}
              className="key-hint hover:text-foreground transition-colors px-2 py-2"
            >
              ◂ Reconsider
            </button>
            <button
              onClick={() => {
                playSelect();
                onConfirm([]);
              }}
              className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] px-6 py-2.5 hover:bg-primary/90 transition-colors"
            >
              Confirm ▸
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
