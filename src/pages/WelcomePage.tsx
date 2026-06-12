import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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

const MODE_STORAGE_KEY = 'heli-mode';

const modeOptions: {
  id: Mode;
  code: string;
  title: string;
  description: string;
}[] = [
  {
    id: 'learning',
    code: '01',
    title: 'Story Mode',
    description:
      'Play through the story. Find clues, make choices, and see what happens because of them.',
  },
  {
    id: 'training',
    code: '02',
    title: 'Training Mode',
    description:
      'For people training in safeguarding. Includes scores, areas to improve, and a certificate.',
  },
];

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

  const startScenario = (scenario: Scenario, fresh = false) => {
    if (fresh) localStorage.removeItem(savedStateKey(scenario.id, mode));
    navigate(`/story/${scenario.id}?mode=${mode}`);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Top rule: corner-anchored HUD labels */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border">
        <span className="hud-label">Heli — Safeguarding Simulation</span>
        <span className="hud-label hidden sm:block">Prototype / V0.1</span>
      </header>

      {/* Hero */}
      <section className="px-4 md:px-8 py-16 md:py-24 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <p className="hud-label mb-6">Helping Everyone Learn Interactively</p>
          <h1 className="font-sans text-6xl md:text-8xl font-bold uppercase tracking-tight text-foreground mb-8 leading-none">
            Heli
          </h1>
          <div className="rule-h w-16 bg-primary mb-8" />
          <p className="text-xl md:text-2xl text-foreground mb-4 max-w-2xl">
            Step into a story. Notice the signs. Help someone.
          </p>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            Heli teaches you to recognise when someone is at risk - and what to
            do about it - through stories you play, not slides you read.
          </p>
        </motion.div>
      </section>

      {/* Mode selection */}
      <section className="px-4 md:px-8 py-12 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <p className="hud-label mb-6">Select mode — How do you want to play?</p>
          <div
            className="grid sm:grid-cols-2 gap-px bg-border border border-border"
            role="radiogroup"
            aria-label="Choose a mode"
          >
            {modeOptions.map((option) => (
              <button
                key={option.id}
                role="radio"
                aria-checked={mode === option.id}
                onClick={() => setMode(option.id)}
                className={cn(
                  'text-left p-6 transition-colors relative',
                  mode === option.id
                    ? 'bg-secondary'
                    : 'bg-background hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      'font-mono text-[10px] uppercase tracking-[0.25em]',
                      mode === option.id ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    Mode {option.code}
                  </span>
                  <span
                    className={cn(
                      'w-2.5 h-2.5 border',
                      mode === option.id
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span className="block font-semibold text-lg text-foreground mb-2">
                  {option.title}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Scenario dossiers */}
      <section className="px-4 md:px-8 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <p className="hud-label mb-6">Case files — Choose a story</p>
          <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
            {scenarios.map((scenario, index) => {
              const locked = scenario.status === 'in-development';
              const inProgress = !locked && hasProgress(scenario.id, mode);
              return (
                <motion.article
                  key={scenario.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  className={cn(
                    'p-6 flex flex-col bg-background',
                    locked && 'opacity-60'
                  )}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                      Case {String(index + 1).padStart(2, '0')} —{' '}
                      {scenario.domain?.replace(/-/g, ' ')}
                    </span>
                    {locked ? (
                      <span className="hud-label border border-border px-2 py-1">
                        In development
                      </span>
                    ) : (
                      scenario.durationMinutes && (
                        <span className="hud-label">
                          ~{scenario.durationMinutes} min
                        </span>
                      )
                    )}
                  </div>
                  <h3 className="font-sans text-3xl font-bold uppercase tracking-tight text-foreground mb-2">
                    {scenario.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">
                    You play: {scenario.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-grow">
                    {scenario.description}
                  </p>
                  {!locked && (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setPendingScenario(scenario)}
                        className="font-mono uppercase tracking-[0.15em] text-xs"
                      >
                        {inProgress ? '▸ Continue' : '▸ Begin Simulation'}
                      </Button>
                      {inProgress && (
                        <Button
                          variant="outline"
                          onClick={() => startScenario(scenario, true)}
                          className="font-mono uppercase tracking-[0.15em] text-xs"
                        >
                          Start Over
                        </Button>
                      )}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer signposting — plain language, generous type (pillar 4) */}
      <footer className="px-4 md:px-8 py-8 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
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
        <DialogContent className="border-border">
          <DialogHeader>
            <p className="hud-label text-primary mb-1">Content notice</p>
            <DialogTitle className="font-sans text-xl uppercase tracking-tight">
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
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setPendingScenario(null)}
              className="font-mono uppercase tracking-[0.15em] text-xs"
            >
              Go back
            </Button>
            <Button
              onClick={() => pendingScenario && startScenario(pendingScenario)}
              className="font-mono uppercase tracking-[0.15em] text-xs"
            >
              I understand — start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
