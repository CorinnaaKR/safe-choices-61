import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Play,
  Shield,
  Gamepad2,
  GraduationCap,
  Lock,
  Clock,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const MODE_STORAGE_KEY = 'heli-mode';

const modeOptions: {
  id: Mode;
  icon: typeof Gamepad2;
  title: string;
  description: string;
}[] = [
  {
    id: 'learning',
    icon: Gamepad2,
    title: 'Story Mode',
    description:
      'Play through the story. Find clues, make choices, and see what happens because of them.',
  },
  {
    id: 'training',
    icon: GraduationCap,
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
    <div className="min-h-screen relative">
      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">
                Helping Everyone Learn Interactively
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1]">
              Heli
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Step into a story. Notice the signs. Help someone.
            </p>
            <p className="text-base text-muted-foreground mb-2 max-w-2xl mx-auto">
              Heli teaches you to recognise when someone is at risk - and what
              to do about it - through stories you play, not slides you read.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mode selection */}
      <section className="py-10 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4 text-center">
            How do you want to play?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Choose a mode">
            {modeOptions.map((option) => (
              <button
                key={option.id}
                role="radio"
                aria-checked={mode === option.id}
                onClick={() => setMode(option.id)}
                className={`text-left rounded-xl border-2 p-5 transition-colors ${
                  mode === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${mode === option.id ? 'bg-primary/15' : 'bg-muted'}`}>
                    <option.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">{option.title}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Scenario cards */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6 text-center">
            Choose a story
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((scenario, index) => {
              const locked = scenario.status === 'in-development';
              const inProgress = !locked && hasProgress(scenario.id, mode);
              return (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                >
                  <Card
                    className={`h-full border-2 transition-colors ${
                      locked ? 'opacity-60' : 'hover:border-primary/40'
                    }`}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {scenario.domain?.replace(/-/g, ' ')}
                        </span>
                        {locked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                            <Lock className="w-3.5 h-3.5" /> In development
                          </span>
                        ) : (
                          scenario.durationMinutes && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" /> ~{scenario.durationMinutes} min
                            </span>
                          )
                        )}
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                        {scenario.title}
                      </h3>
                      <p className="text-sm font-medium text-primary mb-3">
                        You play: {scenario.role}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                        {scenario.description}
                      </p>
                      {!locked && (
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => setPendingScenario(scenario)}
                            className="gap-2"
                          >
                            <Play className="w-4 h-4" />
                            {inProgress ? 'Continue' : 'Begin Simulation'}
                          </Button>
                          {inProgress && (
                            <Button
                              variant="outline"
                              onClick={() => startScenario(scenario, true)}
                              className="gap-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Start Over
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            The people in these stories are not real. They are here to help you
            learn. If you are worried about a real person, tell someone you
            trust, or contact the NSPCC on 0808 800 5000. If someone is in
            danger right now, call 999.
          </p>
        </div>
      </section>

      {/* Content warning dialog */}
      <Dialog
        open={pendingScenario !== null}
        onOpenChange={(open) => !open && setPendingScenario(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Before you start
            </DialogTitle>
            <DialogDescription asChild>
              <div className="pt-2 space-y-2 text-left">
                {pendingScenario?.contentWarnings?.map((warning, i) => (
                  <p key={i} className="text-sm leading-relaxed">
                    {warning}
                  </p>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPendingScenario(null)}>
              Go back
            </Button>
            <Button
              onClick={() => pendingScenario && startScenario(pendingScenario)}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              I understand - start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
