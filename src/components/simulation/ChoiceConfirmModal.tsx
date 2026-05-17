import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Choice, Evidence } from '@/types/simulation';
import { Check, ArrowLeft, ArrowRight, Eye, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChoiceConfirmModalProps {
  choice: Choice;
  evidence: Evidence[];
  onConfirm: (supportingEvidenceIds: string[]) => void;
  onCancel: () => void;
}

export function ChoiceConfirmModal({ choice, evidence, onConfirm, onCancel }: ChoiceConfirmModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24 }}
          className="relative z-10 w-[92vw] max-w-lg bg-black/85 backdrop-blur-md border border-decision-highlight/30 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-decision-highlight/70 font-semibold mb-2">
              Before you decide
            </p>
            <p className="font-serif text-base md:text-lg text-white leading-snug">
              "{choice.text}"
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[50vh] overflow-y-auto">
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              Which observations are guiding this choice? Select the evidence that supports your decision.
            </p>

            {hasEvidence ? (
              <div className="space-y-2">
                {evidence.map(ev => {
                  const isSel = selected.has(ev.id);
                  return (
                    <button
                      key={ev.id}
                      onClick={() => toggle(ev.id)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3',
                        isSel
                          ? 'bg-decision-highlight/15 border-decision-highlight/60'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-colors',
                          isSel
                            ? 'bg-decision-highlight border-decision-highlight'
                            : 'border-white/30'
                        )}
                      >
                        {isSel && <Check className="w-3.5 h-3.5 text-black" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3 text-decision-highlight/70 flex-shrink-0" />
                          <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                        </div>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed line-clamp-2">
                          {ev.content}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <AlertCircle className="w-4 h-4 text-decision-highlight/80 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/70 leading-relaxed">
                  You haven't gathered any clues in this scene yet. You can still proceed, but it's worth pausing to consider what you've actually observed.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3 bg-black/40">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Reconsider
            </button>
            <div className="flex items-center gap-3">
              {hasEvidence && (
                <span className="text-xs text-white/50">
                  {selected.size} selected
                </span>
              )}
              <button
                onClick={() => onConfirm(Array.from(selected))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-decision-highlight text-black text-sm font-semibold hover:bg-decision-highlight/90 transition-colors"
              >
                Confirm decision
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
