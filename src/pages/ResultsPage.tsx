import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { DEFAULT_SCENARIO_ID } from '@/data/scenarios';
import { Mode } from '@/types/simulation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scenarioId = searchParams.get('scenario') ?? DEFAULT_SCENARIO_ID;
  const mode: Mode = searchParams.get('mode') === 'training' ? 'training' : 'learning';

  const { gameState, resetSimulation, getOptimalDecisionsCount, scenario } =
    useSimulation(scenarioId, mode);

  const scorePercentage =
    gameState.maxPossiblePoints > 0
      ? Math.round((gameState.totalPoints / gameState.maxPossiblePoints) * 100)
      : 0;
  const optimalCount = getOptimalDecisionsCount();
  const totalDecisions = gameState.decisions.length;

  const getGrade = () => {
    if (scorePercentage >= 90) return { grade: 'Excellent', accent: true };
    if (scorePercentage >= 70) return { grade: 'Good', accent: true };
    if (scorePercentage >= 50) return { grade: 'Satisfactory', accent: false };
    return { grade: 'Needs Improvement', accent: false };
  };

  const { grade, accent } = getGrade();

  const handleReplay = () => {
    resetSimulation();
    navigate(`/story/${scenario.id}?mode=${mode}`);
  };

  /** Decision rows: in learning mode each shows choice + what happened because of it. */
  const decisionRows = gameState.decisions.map((decision, index) => {
    const scene = scenario.scenes.find((s) => s.id === decision.sceneId);
    const choiceData = scene?.choices?.find((c) => c.id === decision.choiceId);
    return { decision, scene, choiceData, index };
  });

  const completedAt = gameState.completedAt
    ? new Date(gameState.completedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="min-h-screen relative">
      {/* Top rule */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border">
        <span className="hud-label">Heli — Safeguarding Simulation</span>
        <span className="hud-label hidden sm:block">
          {mode === 'training' ? 'Training report' : 'End of story'}
        </span>
      </header>

      <div className="px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <p className="hud-label text-primary mb-4">
              {mode === 'training' ? 'Case closed — Debrief' : 'Case closed'}
            </p>
            <h1 className="font-sans text-4xl md:text-5xl font-bold uppercase tracking-tight text-foreground mb-3">
              {mode === 'training' ? 'Simulation Complete' : 'The End of the Story'}
            </h1>
            <p className="text-muted-foreground">
              {scenario.title} — {scenario.role}
            </p>
            <div className="rule-h w-16 bg-primary mt-6" />
          </div>

          {/* Score block — training only */}
          {mode === 'training' && (
            <section className="border border-border mb-px">
              <div className="px-6 py-3 border-b border-border">
                <span className="hud-label">Your score</span>
              </div>
              <div className="px-6 py-8">
                <div className="flex items-end gap-6 mb-6">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-mono text-7xl font-bold text-foreground leading-none"
                  >
                    {String(scorePercentage).padStart(3, '0')}
                    <span className="text-2xl text-muted-foreground">%</span>
                  </motion.span>
                  <span
                    className={cn(
                      'font-mono text-sm uppercase tracking-[0.2em] pb-1.5',
                      accent ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {grade}
                  </span>
                </div>

                <div className="h-px bg-border relative mb-8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scorePercentage}%` }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="absolute inset-y-0 left-0 bg-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-px bg-border border border-border">
                  <div className="bg-background p-5">
                    <p className="hud-label mb-2">Points earned</p>
                    <p className="font-mono text-2xl text-foreground">
                      {gameState.totalPoints} / {gameState.maxPossiblePoints}
                    </p>
                  </div>
                  <div className="bg-background p-5">
                    <p className="hud-label mb-2">Optimal decisions</p>
                    <p className="font-mono text-2xl text-foreground">
                      {optimalCount} / {totalDecisions}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Decision recap. Learning mode: cause and effect, no judgement. */}
          <section className="border border-border mb-px">
            <div className="px-6 py-3 border-b border-border">
              <span className="hud-label">
                {mode === 'training' ? 'Decision summary' : 'What you did — and what happened'}
              </span>
            </div>
            <div className="p-3 space-y-px">
              {decisionRows.map(({ decision, scene, choiceData, index }) => {
                const citedIds = decision.supportingEvidenceIds ?? [];
                const citedEvidence = citedIds
                  .map((id) => gameState.collectedEvidence.find((e) => e.id === id))
                  .filter((e): e is NonNullable<typeof e> => Boolean(e));
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.08 * index }}
                    className="p-4 bg-secondary/40 border border-border"
                  >
                    <p className="hud-label text-primary mb-2">
                      Decision {String(index + 1).padStart(2, '0')} —{' '}
                      {scene?.title || 'Scene'}
                    </p>
                    {choiceData && (
                      <p className="text-sm text-foreground/85 leading-relaxed">
                        You chose: {choiceData.text}
                      </p>
                    )}
                    {mode === 'learning' && choiceData && (
                      <p className="text-sm text-foreground/70 mt-2 leading-relaxed border-l border-primary/50 pl-3">
                        Because of this: {choiceData.consequence}
                      </p>
                    )}
                    {citedEvidence.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="hud-label mb-2">
                          {mode === 'training' ? 'Evidence you cited' : 'Clues you used'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {citedEvidence.map((ev) => (
                            <span
                              key={ev.id}
                              className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-1 border border-border text-foreground/80"
                            >
                              {ev.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Evidence collected */}
          <section className="border border-border mb-px">
            <div className="px-6 py-3 border-b border-border">
              <span className="hud-label">
                {mode === 'training' ? 'Evidence collected' : 'Clues you found'} —{' '}
                {String(gameState.collectedEvidence.length).padStart(2, '0')}
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm text-muted-foreground mb-3 px-1 leading-relaxed">
                You {mode === 'training' ? 'collected' : 'found'}{' '}
                {gameState.collectedEvidence.length}{' '}
                {mode === 'training'
                  ? `piece${gameState.collectedEvidence.length !== 1 ? 's' : ''} of evidence`
                  : `clue${gameState.collectedEvidence.length !== 1 ? 's' : ''}`}{' '}
                during the {mode === 'training' ? 'scenario' : 'story'}.
              </p>
              {gameState.collectedEvidence.length > 0 && (
                <div className="space-y-px">
                  {gameState.collectedEvidence.map((evidence, i) => (
                    <div
                      key={evidence.id}
                      className="p-3 bg-secondary/40 border border-border flex items-baseline gap-3"
                    >
                      <span className="font-mono text-[10px] text-primary">
                        Nº {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-sm text-foreground">{evidence.title}</p>
                        <p className="hud-label mt-0.5">{evidence.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Key takeaway — learning mode */}
          {mode === 'learning' && scenario.keyTakeaway && (
            <section className="border border-primary mb-px">
              <div className="px-6 py-3 border-b border-primary/50">
                <span className="hud-label text-primary">Remember this</span>
              </div>
              <p className="px-6 py-5 text-base text-foreground leading-relaxed">
                {scenario.keyTakeaway}
              </p>
            </section>
          )}

          {/* Resources */}
          {scenario.resources && scenario.resources.length > 0 && (
            <section className="border border-border mb-px">
              <div className="px-6 py-3 border-b border-border">
                <span className="hud-label">Find out more / get help</span>
              </div>
              <ul className="p-6 space-y-3">
                {scenario.resources.map((resource) => (
                  <li key={resource.url}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-foreground underline decoration-primary underline-offset-4 hover:text-primary transition-colors"
                    >
                      {resource.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
            <button
              onClick={handleReplay}
              className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              ▸ {mode === 'training' ? 'Try Again' : 'Play Again'}
            </button>
            {mode === 'training' && (
              <button
                onClick={() => window.print()}
                className="border border-border text-foreground font-mono text-xs uppercase tracking-[0.2em] px-8 py-3.5 hover:border-foreground transition-colors w-full sm:w-auto"
              >
                Print Certificate
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors px-4 py-3.5"
            >
              Return Home
            </button>
          </div>

          <p className="hud-label mt-12">Completed {completedAt}</p>
        </motion.div>
      </div>
    </div>
  );
}
