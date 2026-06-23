export interface PreFeedback {
  priorTraining: string;
  confidenceBefore: string;
}

export interface PostFeedback {
  confidenceAfter: string;
  realisticScore: number;
  toneScore: number;
  engagingScore: number;
  learnedScore: number;
  seriousnessScore: number;
  takeaway: string;
  whatWasMissing: string;
  whoWouldBenefit: string;
  role: string;
  orgType: string;
  wouldOrgUse: string;
  suggestions: string;
  /** Per-story reflections — only present when that story was played */
  jamieReflection?: string;
  lazloReflection?: string;
}

export interface FeedbackSubmission extends PreFeedback, PostFeedback {
  /** Comma-separated list of story IDs completed this session */
  storiesPlayed: string;
  submittedAt: string;
}

export async function submitFeedback(data: FeedbackSubmission): Promise<void> {
  const fields: Record<string, string | number> = {
    'Submitted At': data.submittedAt,
    'Stories Played': data.storiesPlayed,
    'Prior Training': data.priorTraining,
    'Confidence Before': data.confidenceBefore,
    'Confidence After': data.confidenceAfter,
    'Realistic & True to Life': data.realisticScore,
    'Tone Appropriate': data.toneScore,
    'Engaging': data.engagingScore,
    'Learned Something New': data.learnedScore,
    'Respected Seriousness': data.seriousnessScore,
  };

  if (data.takeaway) fields['Takeaway'] = data.takeaway;
  if (data.whatWasMissing) fields['What Was Missing'] = data.whatWasMissing;
  if (data.whoWouldBenefit) fields['Who Would Benefit'] = data.whoWouldBenefit;
  if (data.role) fields['Role'] = data.role;
  if (data.orgType) fields['Organisation Type'] = data.orgType;
  if (data.wouldOrgUse) fields['Would Org Use This'] = data.wouldOrgUse;
  if (data.suggestions) fields['Suggestions'] = data.suggestions;
  if (data.jamieReflection) fields["Jamie's Story — Reflection"] = data.jamieReflection;
  if (data.lazloReflection) fields["Lazlo's Story — Reflection"] = data.lazloReflection;

  const res = await fetch('/api/submit-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Feedback submission failed: ${err}`);
  }
}
