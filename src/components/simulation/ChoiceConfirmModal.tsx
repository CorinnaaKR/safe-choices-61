import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Choice, Evidence } from '@/types/simulation';
import { cn } from '@/lib/utils';
import { playUiTick, playSelect } from '@/lib/sfx';

interface ChoiceConfirmModalProps {
  choice: Choice;
  evidence: Evidence[];
  onConfirm: (supportingEvidenceIds: string[]) => void;
  onCancel: () => void;
}

export function ChoiceConfirmModal({ choice, evidence, onConfirm, onCancel }: ChoiceConfirmModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    playUiTick();
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasEvidence = evidence.length > 0;

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
          className="relative z-10 w-[92vw] max-w-lg case-panel"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <p className="hud-label text-primary mb-2">Before you decide</p>
            <p className="text-base md:text-lg text-foreground leading-snug">
              "{choice.text}"
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[50vh] overflow-y-auto">
            <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
              Which observations are guiding this choice? Select the evidence
              that supports your decision.
            </p>

            {hasEvidence ? (
              <div className="space-y-px">
                {evidence.map((ev, i) => {
                  const isSel = selected.has(ev.id);
                  return (
                    <button
                      key={ev.id}
                      onClick={() => toggle(ev.id)}
                      className={cn(
                        'w-full text-left p-3 border transition-colors flex items-start gap-3',
                        isSel
                          ? 'bg-secondary border-primary/60'
                          : 'bg-secondary/40 border-border hover:bg-secondary'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0 border transition-colors font-mono text-[10px]',
                          isSel
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground text-transparent'
                        )}
                      >
                        ✓
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                          Nº {String(i + 1).padStart(2, '0')}
                        </p>
                        <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                          {ev.content}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-secondary/40 border border-border">
                <p className="text-sm text-foreground/70 leading-relaxed">
                  You haven't gathered any clues in this scene yet. You can
                  still proceed, but it's worth pausing to consider what you've
                  actually observed.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
            <button
              onClick={onCancel}
              className="key-hint hover:text-foreground transition-colors px-2 py-2"
            >
              ◂ Reconsider
            </button>
            <div className="flex items-center gap-4">
              {hasEvidence && (
                <span className="hud-label">
                  {String(selected.size).padStart(2, '0')} selected
                </span>
              )}
              <button
                onClick={() => {
                  playSelect();
                  onConfirm(Array.from(selected));
                }}
                className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] px-5 py-2.5 hover:bg-primary/90 transition-colors"
              >
                Confirm ▸
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
