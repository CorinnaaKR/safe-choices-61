import { motion, AnimatePresence } from 'framer-motion';
import { CastMember, Evidence, KnownFact, Mode } from '@/types/simulation';

interface KnowledgePanelProps {
  open: boolean;
  onClose: () => void;
  cast: CastMember[];
  knownFacts: KnownFact[];
  collectedEvidence: Evidence[];
  mode: Mode;
}

export function KnowledgePanel({ open, onClose, cast, knownFacts, collectedEvidence, mode }: KnowledgePanelProps) {
  const evidenceLabel = mode === 'learning' ? 'Observations' : 'Evidence';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/40 backdrop-blur-sm z-20 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="absolute top-0 right-0 h-full w-[min(360px,90vw)] bg-background border-l border-border z-30 pointer-events-auto flex flex-col overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">What you know</span>
              <button
                onClick={onClose}
                className="key-hint hover:text-foreground transition-colors hud-btn"
              >
                <b>[ESC]</b> Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">

              {/* Cast of characters */}
              {cast.length > 0 && (
                <section className="px-5 pt-5 pb-4 border-b border-border/60">
                  <p className="hud-label mb-3">People</p>
                  <div className="space-y-4">
                    {cast.map((person) => (
                      <div key={person.name}>
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-mono text-sm font-semibold text-foreground">{person.name}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary/70">{person.role}</span>
                        </div>
                        <p className="text-[12px] text-foreground/65 leading-relaxed">{person.details}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Known facts */}
              {knownFacts.length > 0 && (
                <section className="px-5 pt-5 pb-4 border-b border-border/60">
                  <p className="hud-label mb-3">What you already know</p>
                  <div className="space-y-3">
                    {knownFacts.map((fact) => (
                      <div key={fact.label} className="border-l-2 border-primary/30 pl-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground mb-0.5">{fact.label}</p>
                        <p className="text-[12px] text-foreground/60 leading-relaxed">{fact.detail}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Collected evidence / observations */}
              <section className="px-5 pt-5 pb-6">
                <p className="hud-label mb-3">
                  {evidenceLabel} — <span className="text-primary">{String(collectedEvidence.length).padStart(2, '0')}</span>
                </p>
                {collectedEvidence.length === 0 ? (
                  <p className="text-[12px] text-foreground/40 leading-relaxed">
                    Nothing logged yet. Click on objects in the room to look closer.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {collectedEvidence.map((ev) => (
                      <div key={ev.id} className="border-l-2 border-border pl-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground mb-0.5">{ev.title}</p>
                        <p className="text-[12px] text-foreground/60 leading-relaxed">{ev.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
