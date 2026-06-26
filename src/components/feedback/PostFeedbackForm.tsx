import { useState } from 'react';
import { motion } from 'framer-motion';
import { PostFeedback } from '@/lib/feedback';

interface Props {
  onComplete: (data: PostFeedback) => void;
  onSkip: () => void;
  /** Which story IDs were completed this session — controls per-story sections */
  completedStoryIds?: string[];
  /** Scenario domain — adapts the confidence question to what this story is actually about. */
  domain?: string;
}

const CONFIDENCE_OPTIONS = [
  'Not at all confident',
  'Slightly confident',
  'Fairly confident',
  'Very confident',
  'Completely confident',
];

const CONFIDENCE_QUESTION_BY_DOMAIN: Record<string, string> = {
  'anti-radicalisation':
    'Having completed the scenario, how confident do you now feel in your ability to recognise the signs that someone may be being drawn into extremism?',
  'child-safeguarding':
    'Having completed the scenario, how confident do you now feel in your ability to recognise the signs that a child might be experiencing abuse at home?',
};
const DEFAULT_CONFIDENCE_QUESTION =
  'Having completed the scenario, how confident do you now feel in your ability to recognise the signs that someone may be at risk?';

const LIKERT_STATEMENTS = [
  { key: 'realisticScore',      label: 'The scenario felt realistic and true to life' },
  { key: 'toneScore',           label: 'The tone felt appropriate for a difficult subject' },
  { key: 'engagingScore',       label: 'I found the experience engaging' },
  { key: 'learnedScore',        label: 'I learned something I didn\'t already know' },
  { key: 'seriousnessScore',    label: 'I felt the experience respected the seriousness of the topic' },
];

const ROLES = [
  'Teacher / education staff',
  'Social worker',
  'Healthcare worker',
  'Charity / third sector worker',
  'Parent or carer',
  'Student',
  'Everyone — this should be universal',
  'Other',
];

const ORG_TYPES = [
  'School or college',
  'NHS / healthcare',
  'Local authority',
  'Charity or voluntary sector',
  'Private sector',
  "I don't work in an organisation",
  'Other',
];

const INTENT_OPTIONS = [
  'Yes, definitely',
  'Possibly',
  'Probably not',
  'I work alone / not applicable',
];

type LikertKey = 'realisticScore' | 'toneScore' | 'engagingScore' | 'learnedScore' | 'seriousnessScore';

export function PostFeedbackForm({ onComplete, onSkip, completedStoryIds = [], domain }: Props) {
  const playedJamie = completedStoryIds.includes('jamie-case');
  const playedLazlo = completedStoryIds.includes('lazlo-case');

  const [confidenceAfter, setConfidenceAfter] = useState('');
  const [likert, setLikert] = useState<Record<LikertKey, number>>({
    realisticScore: 0, toneScore: 0, engagingScore: 0, learnedScore: 0, seriousnessScore: 0,
  });
  const [jamieReflection, setJamieReflection] = useState('');
  const [lazloReflection, setLazloReflection] = useState('');
  const [takeaway, setTakeaway] = useState('');
  const [whatWasMissing, setWhatWasMissing] = useState('');
  const [whoWouldBenefit, setWhoWouldBenefit] = useState('');
  const [role, setRole] = useState('');
  const [orgType, setOrgType] = useState('');
  const [wouldOrgUse, setWouldOrgUse] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const allLikertFilled = Object.values(likert).every((v) => v > 0);
  const canSubmit = confidenceAfter && allLikertFilled;

  const handleSubmit = () => {
    onComplete({
      confidenceAfter,
      ...likert,
      takeaway,
      whatWasMissing,
      whoWouldBenefit,
      role,
      orgType,
      wouldOrgUse,
      suggestions,
      ...(playedJamie && jamieReflection ? { jamieReflection } : {}),
      ...(playedLazlo && lazloReflection ? { lazloReflection } : {}),
    });
  };

  return (
    <div className="fixed inset-0 bg-background overflow-y-auto z-50">
      <div className="min-h-full flex items-start justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="content-card max-w-lg w-full p-7 md:p-9"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="page-label">Feedback</p>
            <button
              onClick={onSkip}
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed mb-8">
            Your answers go directly towards evidencing the impact of this programme. It takes about two minutes.
          </p>

          {/* Per-story reflections — shown only when that story was played */}
          {(playedJamie || playedLazlo) && (
            <div className="mb-7 border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-secondary/40">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Story reflections
                </p>
              </div>
              <div className="p-4 space-y-5">
                {playedJamie && (
                  <div>
                    <p className="text-sm text-foreground/80 mb-2 leading-snug">
                      Jamie's Story — what stayed with you? Did stepping into a friend's shoes change how you think about noticing signs in someone you know?
                    </p>
                    <Textarea value={jamieReflection} onChange={setJamieReflection} placeholder="Optional" />
                  </div>
                )}
                {playedLazlo && (
                  <div>
                    <p className="text-sm text-foreground/80 mb-2 leading-snug">
                      Lazlo's Story — how did it feel to navigate that situation as a professional? Was there a moment where you weren't sure what the right thing to do was?
                    </p>
                    <Textarea value={lazloReflection} onChange={setLazloReflection} placeholder="Optional" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Confidence after */}
          <Section label={(domain && CONFIDENCE_QUESTION_BY_DOMAIN[domain]) ?? DEFAULT_CONFIDENCE_QUESTION}>
            <div className="space-y-2">
              {CONFIDENCE_OPTIONS.map((opt) => (
                <SelectButton key={opt} label={opt} selected={confidenceAfter === opt} onClick={() => setConfidenceAfter(opt)} />
              ))}
            </div>
          </Section>

          {/* Likert */}
          <Section label="Please rate the following — 1 (strongly disagree) to 5 (strongly agree):">
            <div className="space-y-5">
              {LIKERT_STATEMENTS.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-sm text-foreground/80 mb-2 leading-snug">{label}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setLikert((prev) => ({ ...prev, [key]: n }))}
                        className={`w-10 h-10 border font-mono text-sm transition-colors ${
                          likert[key as LikertKey] === n
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-secondary/40 text-foreground/60 hover:border-primary/50'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Open text */}
          <Section label="What, if anything, will you take away from this experience?">
            <Textarea value={takeaway} onChange={setTakeaway} placeholder="Optional" />
          </Section>

          <Section label="What have you found missing or ineffective in safeguarding training you've encountered before — and did this address it?">
            <Textarea value={whatWasMissing} onChange={setWhatWasMissing} placeholder="Optional" />
          </Section>

          <Section label="Who do you think would benefit most from using something like this?">
            <Textarea value={whoWouldBenefit} onChange={setWhoWouldBenefit} placeholder="Optional" />
          </Section>

          {/* Role */}
          <Section label="What best describes your role?">
            <div className="space-y-2">
              {ROLES.map((opt) => (
                <SelectButton key={opt} label={opt} selected={role === opt} onClick={() => setRole(opt)} />
              ))}
            </div>
          </Section>

          {/* Org type */}
          <Section label="What type of organisation do you work or volunteer for?">
            <div className="space-y-2">
              {ORG_TYPES.map((opt) => (
                <SelectButton key={opt} label={opt} selected={orgType === opt} onClick={() => setOrgType(opt)} />
              ))}
            </div>
          </Section>

          {/* Intent */}
          <Section label="Would you want your organisation or community to use a tool like this?">
            <div className="space-y-2">
              {INTENT_OPTIONS.map((opt) => (
                <SelectButton key={opt} label={opt} selected={wouldOrgUse === opt} onClick={() => setWouldOrgUse(opt)} />
              ))}
            </div>
          </Section>

          {/* Suggestions */}
          <Section label="Is there anything you'd change or improve?">
            <Textarea value={suggestions} onChange={setSuggestions} placeholder="Optional" />
          </Section>

          <div className="flex justify-end mt-2">
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
            >
              Submit feedback
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground mb-4 leading-relaxed">
        {label}
      </p>
      {children}
    </div>
  );
}

function SelectButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border transition-colors text-sm ${
        selected
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-border bg-secondary/40 text-foreground/70 hover:border-primary/50 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full bg-secondary/40 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
    />
  );
}
