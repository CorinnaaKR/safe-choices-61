import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { listScenarios } from '@/data/scenarios';
import { Mode, Scenario } from '@/types/simulation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PreFeedbackGate } from '@/components/feedback/PreFeedbackGate';
import { PreFeedback } from '@/lib/feedback';

const PRE_FEEDBACK_KEY = 'heli-pre-feedback';

const MODE_STORAGE_KEY = 'heli-mode';

const modeOptions: {
  id: Mode;
  title: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: 'learning',
    title: 'Story mode',
    tagline: 'For everyone',
    description:
      'Play through the story. Find clues, make choices, and see what happens because of them.',
  },
  {
    id: 'training',
    title: 'Training mode',
    tagline: 'For professionals',
    description:
      'Designed for safeguarding training. Includes scoring, detailed feedback, and a certificate on completion.',
  },
];

const scenarioHooks: Record<string, string> = {
  'jamie-case': 'It wasn\'t the uniform that stayed with you. It was the way Jamie pulled their sleeve down when you came close.',
  'lazlo-case': 'Lazlo used to reply within the hour. Then his uncle died. Then he stopped replying at all. Then his sister called you.',
};

function savedStateKey(scenarioId: string, mode: Mode) {
  return `heli-state:${scenarioId}:${mode}`;
}

function hasProgress(scenarioId: string, mode: Mode): boolean {
  try {
    const saved = localStorage.getItem(savedStateKey(scenarioId, mode));
    if (!saved) return false;
    const state = JSON.parse(saved);
    return state.decisions?.length > 0 && !state.isComplete;
  } catch {
    return false;
  }
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const scenarios = listScenarios();

  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    return saved === 'learning' || saved === 'training' ? saved : 'learning';
  });
  const [pendingScenario, setPendingScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  /** A scenario with a fixed supportedModes list always launches in that mode,
   *  regardless of the global toggle — e.g. Jamie's Story is Story-mode only. */
  const modeForScenario = (scenario: Scenario): Mode =>
    scenario.supportedModes?.[0] ?? mode;

  const [pendingFeedbackScenario, setPendingFeedbackScenario] = useState<{ scenario: Scenario; fresh: boolean } | null>(null);

  const startScenario = (scenario: Scenario, fresh = false) => {
    // Show pre-feedback gate if we haven't collected it yet this session
    const alreadyAnswered = sessionStorage.getItem(PRE_FEEDBACK_KEY);
    if (!alreadyAnswered) {
      setPendingFeedbackScenario({ scenario, fresh });
      return;
    }
    launchScenario(scenario, fresh);
  };

  const launchScenario = (scenario: Scenario, fresh = false) => {
    const effectiveMode = modeForScenario(scenario);
    if (fresh) localStorage.removeItem(savedStateKey(scenario.id, effectiveMode));
    navigate(`/story/${scenario.id}?mode=${effectiveMode}`);
  };

  const handlePreFeedbackComplete = (data: PreFeedback) => {
    sessionStorage.setItem(PRE_FEEDBACK_KEY, JSON.stringify(data));
    if (pendingFeedbackScenario) {
      const { scenario, fresh } = pendingFeedbackScenario;
      setPendingFeedbackScenario(null);
      launchScenario(scenario, fresh);
    }
  };

  if (pendingFeedbackScenario) {
    return <PreFeedbackGate onComplete={handlePreFeedbackComplete} domain={pendingFeedbackScenario.scenario.domain} />;
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between px-5 md:px-10 py-4 border-b border-border">
        <span className="font-sans text-sm font-semibold text-foreground/80 tracking-wide">Heli</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:block">
          Prototype v0.1
        </span>
      </header>

      {/* Hero */}
      <section className="w-full max-w-4xl px-5 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
            Case file — open
          </p>
          <h1 className="font-sans text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            The signs are there.<br />
            <span className="text-primary">Be the person who notices.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
            Step into a real situation. Read the room. Make decisions under
            uncertainty. Find out what you missed — and what your choices meant.
          </p>
        </motion.div>
      </section>

      {/* Scenario cards — lead with the stories */}
      <section className="w-full max-w-4xl px-5 md:px-10 pb-12 flex-grow">
        <div>
          <p className="page-label mb-5">Choose a case</p>
          <div className="grid md:grid-cols-2 gap-4">
            {scenarios.map((scenario, index) => {
              const locked = scenario.status === 'in-development';
              const modeMismatch = !locked && !!scenario.supportedModes && !scenario.supportedModes.includes(mode);
              const effectiveMode = modeForScenario(scenario);
              const inProgress = !locked && !modeMismatch && hasProgress(scenario.id, effectiveMode);
              const hook = scenarioHooks[scenario.id];
              const fixedModeLabel = scenario.supportedModes?.length === 1
                ? modeOptions.find((m) => m.id === scenario.supportedModes![0])?.title
                : null;
              return (
                <motion.article
                  key={scenario.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                  className={cn(
                    'content-card p-6 flex flex-col group',
                    (locked || modeMismatch) && 'opacity-40'
                  )}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {scenario.domain?.replace(/-/g, ' ')}
                    </span>
                    {fixedModeLabel && !locked && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-primary/80 border border-primary/30 rounded px-2 py-0.5">
                        {fixedModeLabel}
                      </span>
                    )}
                    {locked ? (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded px-2 py-0.5">
                        Coming soon
                      </span>
                    ) : (
                      scenario.durationMinutes && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          ~{scenario.durationMinutes} min
                        </span>
                      )
                    )}
                  </div>

                  {hook && (
                    <p className="text-sm text-foreground/70 leading-relaxed mb-5 italic border-l-2 border-primary/40 pl-4">
                      {hook}
                    </p>
                  )}

                  <h3 className="font-sans text-xl font-bold text-foreground mb-1 leading-snug tracking-tight">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6 flex-grow">
                    You play: {scenario.role}
                  </p>

                  {!locked && !modeMismatch && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => setPendingScenario(scenario)}
                        className="bg-primary text-primary-foreground font-sans text-sm font-medium px-5 py-2.5 hover:bg-primary/90 transition-colors hud-btn"
                      >
                        {inProgress ? 'Continue' : 'Enter the story'}
                      </button>
                      {inProgress && (
                        <button
                          onClick={() => startScenario(scenario, true)}
                          className="border border-border text-foreground/60 font-sans text-sm px-4 py-2.5 hover:border-foreground/50 hover:text-foreground/80 transition-colors hud-btn"
                        >
                          Start over
                        </button>
                      )}
                    </div>
                  )}
                  {!locked && modeMismatch && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                      Not available in {mode === 'training' ? 'training' : 'story'} mode
                    </p>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mode selection — quieter, below the stories */}
      <section className="px-5 md:px-10 pb-14">
        <div className="max-w-3xl">
          <p className="page-label mb-4">How do you want to approach this?</p>
          <div
            className="flex flex-col sm:flex-row gap-2"
            role="radiogroup"
            aria-label="Choose a mode"
          >
            {modeOptions.map((option) => {
              const selected = mode === option.id;
              return (
                <button
                  key={option.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMode(option.id)}
                  className={cn(
                    'text-left px-5 py-4 rounded-lg border transition-all duration-150 flex-1',
                    selected
                      ? 'border-primary/50 bg-primary/6 ring-1 ring-primary/20'
                      : 'border-border bg-card hover:border-border/80 hover:bg-secondary/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors',
                        selected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/40'
                      )}
                      aria-hidden="true"
                    />
                    <div>
                      <span className="block font-medium text-sm text-foreground">
                        {option.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {option.tagline} — {option.description}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 md:px-10 py-8 border-t border-border">
        <div className="max-w-3xl">
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            The people in these stories are not real. They are here to help you
            learn. If you are worried about a real person, tell someone you
            trust, or contact the NSPCC on{' '}
            <span className="text-foreground font-mono">0808 800 5000</span>.
            If someone is in danger right now, call{' '}
            <span className="text-foreground font-mono">999</span>.
          </p>
        </div>
      </footer>

      {/* Content warning dialog */}
      <Dialog
        open={pendingScenario !== null}
        onOpenChange={(open) => !open && setPendingScenario(null)}
      >
        <DialogContent className="border-border rounded-xl">
          <DialogHeader>
            <p className="page-label mb-1">Content notice</p>
            <DialogTitle className="font-sans text-xl font-bold tracking-tight">
              Before you start
            </DialogTitle>
            <DialogDescription asChild>
              <div className="pt-3 space-y-2 text-left">
                {pendingScenario?.contentWarnings?.map((warning, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {warning}
                  </p>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <button
              onClick={() => setPendingScenario(null)}
              className="border border-border text-foreground/80 font-sans text-sm font-medium px-5 py-2.5 rounded-lg hover:border-foreground/50 hover:text-foreground transition-colors"
            >
              Go back
            </button>
            <button
              onClick={() => pendingScenario && startScenario(pendingScenario)}
              className="bg-primary text-primary-foreground font-sans text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              I understand — start
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
