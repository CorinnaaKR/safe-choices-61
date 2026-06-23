import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { DEFAULT_SCENARIO_ID } from '@/data/scenarios';
import { Mode, SkillArea } from '@/types/simulation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SKILL_AREA_HINTS } from '@/lib/trainingHints';
import Certificate from '@/components/Certificate';
import { PostFeedbackForm } from '@/components/feedback/PostFeedbackForm';
import { submitFeedback, PostFeedback, PreFeedback } from '@/lib/feedback';
import { useToast } from '@/hooks/use-toast';

const PRE_FEEDBACK_KEY = 'heli-pre-feedback';
const COMPLETED_STORIES_KEY = 'heli-completed-stories';

const OTHER_STORY: Record<string, { id: string; title: string; hook: string; mode: string }> = {
  'jamie-case': {
    id: 'lazlo-case',
    title: "Lazlo's Story",
    hook: "Now step into the professional's shoes. A youth worker notices something is wrong with one of his group. This time there's a score — and a certificate.",
    mode: 'training',
  },
  'lazlo-case': {
    id: 'jamie-case',
    title: "Jamie's Story",
    hook: "See it from a different angle. You're a classmate — not a professional. No score, no procedure. Just a gut feeling that something isn't right.",
    mode: 'learning',
  },
};

/** Register current story as completed and return all completed story IDs. */
function registerStory(scenarioId: string): string[] {
  const existing: string[] = JSON.parse(sessionStorage.getItem(COMPLETED_STORIES_KEY) || '[]');
  if (!existing.includes(scenarioId)) existing.push(scenarioId);
  sessionStorage.setItem(COMPLETED_STORIES_KEY, JSON.stringify(existing));
  return existing;
}

const PASS_THRESHOLD = 85;

const SKILL_AREA_LABELS: Record<SkillArea, string> = {
  'recognising-signs': 'Recognising signs',
  'evidence-gathering': 'Evidence gathering',
  'responding': 'Responding',
  'escalation': 'Escalation',
  'record-keeping': 'Record keeping',
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scenarioId = searchParams.get('scenario') ?? DEFAULT_SCENARIO_ID;
  const mode: Mode = searchParams.get('mode') === 'training' ? 'training' : 'learning';

  const { gameState, resetSimulation, getOptimalDecisionsCount, getSkillAreaBreakdown, scenario } =
    useSimulation(scenarioId, mode);

  const { toast } = useToast();

  const scorePercentage =
    gameState.maxPossiblePoints > 0
      ? Math.min(100, Math.round((gameState.totalPoints / gameState.maxPossiblePoints) * 100))
      : 0;
  const optimalCount = getOptimalDecisionsCount();
  const totalDecisions = gameState.decisions.length;
  const passed = scorePercentage >= PASS_THRESHOLD;

  const getGrade = () => {
    if (scorePercentage === 100) return { grade: 'Excellent', accent: true };
    if (scorePercentage >= PASS_THRESHOLD) return { grade: 'Pass', accent: true };
    if (scorePercentage >= 50) return { grade: 'Not yet passed', accent: false };
    return { grade: 'Retake required', accent: false };
  };

  const { grade, accent } = getGrade();

  // Skill area breakdown for training mode
  const skillBreakdown = getSkillAreaBreakdown();

  // Identify weak skill areas (scored below 60% of available in that area)
  const weakSkillAreas = Array.from(skillBreakdown.entries())
    .filter(([, v]) => v.possible > 0 && v.earned / v.possible < 0.6)
    .map(([area]) => area as SkillArea);


  const [activeSkillArea, setActiveSkillArea] = useState<SkillArea | null>(null);

  // Track completed stories and decide initial view
  const completedStoryIds = registerStory(scenarioId);
  const otherStory = OTHER_STORY[scenarioId];
  const hasPlayedBoth = otherStory ? completedStoryIds.includes(otherStory.id) : true;
  type View = 'other-story-prompt' | 'feedback-form' | 'results';
  const [view, setView] = useState<View>(hasPlayedBoth ? 'feedback-form' : 'other-story-prompt');

  const profile = gameState.trainingProfile;

  const handlePostFeedback = async (post: PostFeedback) => {
    const preFeedbackRaw = sessionStorage.getItem(PRE_FEEDBACK_KEY);
    const pre: PreFeedback = preFeedbackRaw
      ? JSON.parse(preFeedbackRaw)
      : { priorTraining: 'Unknown', confidenceBefore: 'Unknown' };

    try {
      await submitFeedback({
        ...pre,
        ...post,
        storiesPlayed: completedStoryIds.join(', '),
        submittedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Feedback submission failed:', e);
    }
    setView('results');
  };

  const handleReplay = () => {
    resetSimulation();
    navigate(`/story/${scenario.id}?mode=${mode}`);
  };

  const decisionRows = (gameState.decisions ?? []).map((decision, index) => {
    const scene = scenario.scenes.find((s) => s.id === decision.sceneId);
    const choiceData = scene?.choices?.find((c) => c.id === decision.choiceId);
    return { decision, scene, choiceData, index };
  });

  const completedAt = gameState.completedAt
    ? new Date(gameState.completedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const completedAtFull = gameState.completedAt
    ? new Date(gameState.completedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  const downloadCertificate = async () => {
    const node = document.getElementById('certificate');
    if (!node) {
      toast({ title: 'Certificate not ready', description: 'Please wait a moment and try again.', variant: 'destructive' });
      return;
    }
    setDownloadingCertificate(true);
    try {
      // Wait for custom fonts (Archivo, JetBrains Mono) to fully render
      await document.fonts.ready;

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: '#2d2520', // match certificate background exactly
        useCORS: true,
        logging: false,
      });

      const w = canvas.width / 2;
      const h = canvas.height / 2;
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [w, h] });
      pdf.addImage(imageData, 'PNG', 0, 0, w, h);
      const safeName = (profile?.name || 'participant').replace(/[^a-z0-9]+/gi, '_');
      pdf.save(`Heli_Certificate_${safeName}.pdf`);
    } catch (err) {
      console.error('Certificate download failed:', err);
      toast({ title: 'Download failed', description: 'Something went wrong generating the certificate. Please try again.', variant: 'destructive' });
    } finally {
      setDownloadingCertificate(false);
    }
  };

  if (view === 'other-story-prompt' && otherStory) {
    return (
      <div className="fixed inset-0 bg-background overflow-y-auto z-50">
        <div className="min-h-full flex items-start justify-center px-5 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="content-card max-w-lg w-full p-7 md:p-9"
          >
            <p className="page-label mb-2">Before you give feedback</p>
            <h2 className="font-sans text-2xl font-bold text-foreground mb-4 tracking-tight leading-snug">
              Want to try {otherStory.title} first?
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-8 border-l-2 border-primary/40 pl-4">
              {otherStory.hook}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/story/${otherStory.id}?mode=${otherStory.mode}`)}
                className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Play {otherStory.title}
              </button>
              <button
                onClick={() => setView('feedback-form')}
                className="border border-border text-foreground/70 font-sans text-sm px-8 py-3.5 rounded-lg hover:border-foreground/50 hover:text-foreground transition-colors"
              >
                Give feedback now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === 'feedback-form') {
    return (
      <PostFeedbackForm
        onComplete={handlePostFeedback}
        onSkip={() => setView('results')}
        completedStoryIds={completedStoryIds}
      />
    );
  }

  return (
    <div className="min-h-screen relative">

      {/* Header */}
      <header className="no-print flex items-center justify-between px-5 md:px-10 py-4 border-b border-border">
        <span className="font-sans text-sm font-semibold text-foreground/80 tracking-wide">Heli</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:block">
          {mode === 'training' ? 'Training report' : 'End of story'}
        </span>
      </header>

      <div className="px-5 md:px-10 py-12 no-print">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="mb-10">
            <p className="page-label mb-3">
              {mode === 'training' ? 'Case closed — Debrief' : 'Case closed'}
            </p>
            <h1 className="font-sans text-4xl font-bold text-foreground mb-2 tracking-tight leading-tight">
              {mode === 'training'
                ? profile?.name
                  ? `Well done, ${profile.name.split(' ')[0]}.`
                  : 'Simulation complete'
                : 'The end of the story'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {scenario.title} — {scenario.role}
            </p>
            <div className="warm-divider mt-5" />
          </div>

          {/* Score block — training only */}
          {mode === 'training' && (
            <>
            <section className={cn('content-card mb-3', passed ? '' : 'border-muted-foreground/30')}>
              <div className="px-6 py-3 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Your score</span>
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
                  <div className="pb-1.5 space-y-1">
                    <span
                      className={cn(
                        'font-semibold text-sm block',
                        accent ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {grade}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      Pass mark: {PASS_THRESHOLD}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={cn('text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border', passed ? 'text-primary border-primary/40' : 'text-muted-foreground border-muted-foreground/30')}>
                    {passed ? '✓ Passed' : 'Did not pass'}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full relative mb-8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scorePercentage}%` }}
                    transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full',
                      passed ? 'bg-primary' : 'bg-muted-foreground/50'
                    )}
                  />
                  {/* Pass mark indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary/40"
                    style={{ left: `${PASS_THRESHOLD}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1.5">Points earned</p>
                    <p className="font-mono text-2xl text-foreground">
                      {gameState.totalPoints} <span className="text-sm text-muted-foreground">/ {gameState.maxPossiblePoints}</span>
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1.5">Optimal decisions</p>
                    <p className="font-mono text-2xl text-foreground">
                      {optimalCount} <span className="text-sm text-muted-foreground">/ {totalDecisions}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Skill area breakdown */}
            {skillBreakdown.size > 0 && (
              <section className="content-card mb-3">
                <div className="px-6 py-3 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">Skill areas</span>
                </div>
                <div className="p-6 space-y-5">
                  {Array.from(skillBreakdown.entries()).map(([area, { earned, possible }]) => {
                    const pct = possible > 0 ? Math.round((earned / possible) * 100) : 0;
                    const weak = pct < 60;
                    return (
                      <div key={area}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-foreground">
                            {SKILL_AREA_LABELS[area as SkillArea]}
                          </span>
                          <div className="flex items-center gap-2">
                            {weak && (
                              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-muted-foreground/30 rounded px-1.5 py-0.5">
                                Review
                              </span>
                            )}
                            <span className={cn('text-xs font-mono', weak ? 'text-muted-foreground' : 'text-primary')}>
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className={cn('absolute inset-y-0 left-0 rounded-full', weak ? 'bg-muted-foreground/40' : 'bg-primary')}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Weak skill area tags */}
            {weakSkillAreas.length > 0 && (
              <section className="content-card mb-3">
                <div className="px-6 py-3 border-b border-border">
                  <span className="text-xs font-medium text-muted-foreground">
                    {passed ? 'Areas to explore further' : 'Where to focus before retaking'}
                  </span>
                </div>
                <div className="px-6 py-4 flex flex-wrap gap-2">
                  {weakSkillAreas.map((area, i) => {
                    const active = activeSkillArea === area;
                    return (
                      <motion.button
                        key={area}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.08 * i }}
                        onClick={() => setActiveSkillArea(active ? null : area)}
                        className={cn(
                          'text-xs font-mono border rounded px-3 py-1.5 transition-colors',
                          active
                            ? 'text-primary border-primary/60 bg-primary/10'
                            : 'text-muted-foreground border-muted-foreground/30 hover:border-muted-foreground/60 hover:text-foreground/80'
                        )}
                      >
                        {SKILL_AREA_LABELS[area]} {active ? '▴' : '▾'}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {activeSkillArea && SKILL_AREA_HINTS[activeSkillArea] && (
                    <motion.div
                      key={activeSkillArea}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <ul className="px-6 py-4 space-y-3">
                        {SKILL_AREA_HINTS[activeSkillArea].map((hint, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <span className="text-primary text-xs font-mono mt-0.5 flex-shrink-0">—</span>
                            <p className="text-sm text-foreground/75 leading-relaxed">{hint}</p>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}

            {/* Completion statement (pass) or retake notice (fail) */}
            {passed && profile ? (
              <section className="content-card border-primary/40 mb-3" id="completion-statement">
                <div className="px-6 py-3 border-b border-primary/20 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1L8.545 5.09H13L9.545 7.82L10.91 12L7 9.18L3.09 12L4.455 7.82L1 5.09H5.455L7 1Z" fill="currentColor"/>
                  </svg>
                  <span className="text-xs font-medium text-primary">Completion statement</span>
                </div>
                <div className="px-6 py-6 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">
                    This confirms that{' '}
                    <strong>{profile.name}</strong>
                    {profile.organisation ? ` (${profile.organisation})` : ''} completed the{' '}
                    <strong>{scenario.title}</strong> simulation on{' '}
                    <strong>{completedAtFull}</strong>, achieving a score of{' '}
                    <strong>{scorePercentage}%</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Prior training declared: {profile.priorTraining}.
                    This simulation validates applied awareness and judgement as a complement
                    to formal safeguarding and Prevent training.
                  </p>
                </div>
              </section>
            ) : !passed ? (
              <section className="content-card border-muted-foreground/20 mb-3">
                <div className="px-6 py-5 space-y-2">
                  <p className="text-sm text-foreground leading-relaxed">
                    A score of <strong>{PASS_THRESHOLD}%</strong> or above is required to receive
                    a completion certificate. You scored <strong>{scorePercentage}%</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Review the observations above, then retake the simulation. There is no limit
                    on attempts.
                  </p>
                </div>
              </section>
            ) : null}
            </>
          )}

          {/* Decision recap */}
          <section className="content-card mb-3">
            <div className="px-6 py-3 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground">
                {mode === 'training' ? 'Decision summary' : 'What you did — and what happened'}
              </span>
            </div>
            <div className="p-4 space-y-3">
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
                    transition={{ delay: 0.06 * index }}
                    className="p-4 bg-secondary/40 rounded-lg border border-border/60"
                  >
                    <p className="text-xs font-medium text-primary mb-2">
                      Decision {index + 1} — {scene?.title || 'Scene'}
                    </p>
                    {choiceData && (
                      <p className="text-sm text-foreground/85 leading-relaxed">
                        You chose: {choiceData.text}
                      </p>
                    )}
                    {mode === 'learning' && choiceData && (
                      <p className="text-sm text-foreground/70 mt-2 leading-relaxed border-l-2 border-primary/50 pl-3">
                        Because of this: {choiceData.consequence}
                      </p>
                    )}
                    {citedEvidence.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/60">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          {mode === 'training' ? 'Evidence you cited' : 'Clues you used'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {citedEvidence.map((ev) => (
                            <span
                              key={ev.id}
                              className="text-xs px-2.5 py-1 rounded-md border border-border text-foreground/80 bg-background/60"
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
          <section className="content-card mb-3">
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {mode === 'training' ? 'Evidence collected' : 'Clues you found'}
              </span>
              <span className="font-mono text-xs text-primary">
                {gameState.collectedEvidence.length}
              </span>
            </div>
            <div className="p-4">
              {gameState.collectedEvidence.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No evidence collected.</p>
              ) : (
                <div className="space-y-2">
                  {gameState.collectedEvidence.map((evidence, i) => (
                    <div
                      key={evidence.id}
                      className="p-3 bg-secondary/40 rounded-lg border border-border/60 flex items-baseline gap-3"
                    >
                      <span className="font-mono text-[10px] text-primary flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-sm text-foreground">{evidence.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{evidence.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Key takeaway — learning mode */}
          {mode === 'learning' && scenario.keyTakeaway && (
            <section className="content-card border-primary/40 mb-3">
              <div className="px-6 py-3 border-b border-primary/20">
                <span className="text-xs font-medium text-primary">Remember this</span>
              </div>
              <p className="px-6 py-5 text-base text-foreground leading-relaxed">
                {scenario.keyTakeaway}
              </p>
            </section>
          )}

          {/* Resources */}
          {scenario.resources && scenario.resources.length > 0 && (
            <section className="content-card mb-3">
              <div className="px-6 py-3 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Find out more / get help</span>
              </div>
              <ul className="p-6 space-y-3">
                {scenario.resources.map((resource) => (
                  <li key={resource.url}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-foreground underline decoration-primary/60 underline-offset-4 hover:text-primary transition-colors"
                    >
                      {resource.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
            <button
              onClick={handleReplay}
              className={cn(
                'font-sans text-sm font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto',
                mode === 'training' && !passed
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-border text-foreground/80 hover:border-foreground/50 hover:text-foreground'
              )}
            >
              {mode === 'training' ? 'Retake simulation' : 'Play again'}
            </button>
            {mode === 'training' && passed && profile && (
              <button
                onClick={downloadCertificate}
                disabled={downloadingCertificate}
                className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto disabled:opacity-60"
              >
                {downloadingCertificate ? 'Preparing certificate…' : 'Download certificate'}
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-3"
            >
              Return home
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-10">Completed {completedAtFull}</p>
        </motion.div>
      </div>

      {/* Certificate — rendered off-screen, captured to PDF on download */}
      {mode === 'training' && passed && profile && (
        <div style={{ position: 'absolute', top: 0, left: '-9999px', width: '1000px', overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
          <div id="certificate">
            <Certificate
              name={profile.name}
              organisation={profile.organisation}
              scenarioTitle={scenario.title}
              scenarioRole={scenario.role}
              completedAt={completedAt}
              score={scorePercentage}
              grade={grade}
              passThreshold={PASS_THRESHOLD}
            />
          </div>
        </div>
      )}
    </div>
  );
}
