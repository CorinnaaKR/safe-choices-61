import { motion } from 'framer-motion';
import { Scenario } from '@/types/simulation';

interface PauseOverlayProps {
  scenario: Scenario;
  onResume: () => void;
  onLeave: () => void;
}

export function PauseOverlay({ scenario, onResume, onLeave }: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'hsl(26 14% 10% / 0.92)', backdropFilter: 'blur(6px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="max-w-md w-full mx-5"
      >
        {/* Calm message */}
        <div className="content-card p-8 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Paused
          </p>
          <p className="text-base text-foreground/85 leading-relaxed mb-2">
            This story deals with difficult content.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            It is okay to step away. Your progress is saved — you can come back
            to exactly where you left off whenever you are ready.
          </p>
        </div>

        {/* Scenario-specific resources (e.g. ACT Early for Lazlo) */}
        {scenario.resources && scenario.resources.length > 0 && (
          <div className="content-card p-6 mb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              If this brought something real to mind
            </p>
            <ul className="space-y-2">
              {scenario.resources.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Always-visible NSPCC line */}
        <div className="content-card px-6 py-4 mb-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you are worried about a real person right now, contact the NSPCC on{' '}
            <span className="text-foreground font-mono">0808 800 5000</span> (free, 24/7).
            If someone is in immediate danger, call{' '}
            <span className="text-foreground font-mono">999</span>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onResume}
            className="w-full bg-primary text-primary-foreground font-sans text-sm font-medium px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to story
          </button>
          <button
            onClick={onLeave}
            className="w-full border border-border text-foreground/70 font-sans text-sm px-5 py-3 rounded-lg hover:border-foreground/40 hover:text-foreground/90 transition-colors"
          >
            Take a break — save and leave
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
