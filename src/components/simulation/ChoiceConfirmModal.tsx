import { useEffect, useRef } from 'react';
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
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const labelId = 'confirm-modal-label';

  return (
    <AnimatePresence>
      <div
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-[92vw] max-w-md case-panel"
        >
          <div className="px-6 py-5 border-b border-border">
            <p id={labelId} className="text-base md:text-lg text-foreground leading-snug">
              {choice.text.startsWith('"') && choice.text.endsWith('"')
                ? choice.text
                : `"${choice.text}"`}
            </p>
          </div>

          <div className="px-6 py-4 flex items-center justify-between gap-3">
            <button
              onClick={onCancel}
              className="key-hint hover:text-foreground transition-colors px-2 py-2"
              aria-label="Go back to choices"
            >
              ◂ Back
            </button>
            <button
              ref={confirmRef}
              onClick={() => {
                playSelect();
                onConfirm([]);
              }}
              className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] px-6 py-2.5 hover:bg-primary/90 transition-colors"
              aria-label="Confirm this choice"
            >
              Confirm ▸
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
