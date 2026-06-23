import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClosingSequenceData, Evidence } from '@/types/simulation';

interface Props {
  data: ClosingSequenceData;
  outcome: 'good' | 'sobering';
  /** The player's own logged observations — used to personalise the reflection step. */
  collectedEvidence: Evidence[];
  onComplete: () => void;
}

type Step = 'epilogue' | 'reflection' | 'common-signs';

/**
 * Narrative closing sequence for Story-mode scenarios: epilogue → personalised
 * reflection → real "common signs of..." page. See ClosingSequenceData and the
 * safeguarding-restructure-jamie-friend-pov memory for the design rationale —
 * in short: this never scores or tallies the player, it reflects their own
 * choices back at them and then validates the instinct, not the completeness.
 */
export function ClosingSequence({ data, outcome, collectedEvidence, onComplete }: Props) {
  const [step, setStep] = useState<Step>('epilogue');

  if (step === 'epilogue') {
    const paragraphs = outcome === 'good' ? data.epilogueGood : data.epilogueSobering;
    return (
      <NarrativeCard
        label="Some time later"
        paragraphs={paragraphs}
        ctaLabel="Continue"
        onContinue={() => setStep('reflection')}
      />
    );
  }

  if (step === 'reflection') {
    const threshold = data.reflection.manyThreshold ?? 3;
    const paragraphs =
      outcome === 'sobering'
        ? data.reflection.fewObservationsSilent
        : collectedEvidence.length >= threshold
          ? data.reflection.manyObservations
          : data.reflection.fewObservationsToldAnyway;

    return (
      <NarrativeCard
        label="What you noticed"
        paragraphs={paragraphs}
        observations={
          outcome !== 'sobering' && collectedEvidence.length >= threshold
            ? collectedEvidence.map((e) => e.title)
            : undefined
        }
        ctaLabel="Continue"
        onContinue={() => setStep('common-signs')}
      />
    );
  }

  return <CommonSignsCard data={data.commonSigns} onComplete={onComplete} />;
}

function NarrativeCard({
  label,
  paragraphs,
  observations,
  ctaLabel,
  onContinue,
}: {
  label: string;
  paragraphs: string[];
  observations?: string[];
  ctaLabel: string;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="content-card max-w-lg w-full p-7 md:p-9"
      >
        <p className="page-label mb-5">{label}</p>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              className="text-sm md:text-base text-foreground/85 leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {observations && observations.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: paragraphs.length * 0.15 + 0.1 }}
            className="mt-5 space-y-1.5"
          >
            {observations.map((title) => (
              <li key={title} className="text-sm text-foreground/70 flex gap-2">
                <span className="text-primary">·</span>
                {title}
              </li>
            ))}
          </motion.ul>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onContinue}
            className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {ctaLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function CommonSignsCard({
  data,
  onComplete,
}: {
  data: ClosingSequenceData['commonSigns'];
  onComplete: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 px-5 py-10 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="content-card max-w-lg w-full p-7 md:p-9 my-auto"
      >
        <p className="page-label mb-3">{data.title}</p>
        <p className="text-sm text-foreground/80 leading-relaxed mb-6">{data.intro}</p>

        <div className="space-y-4 mb-6">
          {data.signs.map((sign) => (
            <div key={sign.title} className="bg-secondary/40 rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-1">{sign.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{sign.description}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-foreground/85 leading-relaxed italic mb-8">{data.closingLine}</p>

        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            View results
          </button>
        </div>
      </motion.div>
    </div>
  );
}
