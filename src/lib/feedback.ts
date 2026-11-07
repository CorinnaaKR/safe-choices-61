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
  /** Contact details — all optional, collected for impact attribution */
  name?: string;
  organisation?: string;
  email?: string;
  /** Per-story reflections — only present when that story was played */
  jamieReflection?: string;
  lazloReflection?: string;
}

export interface QuickFeedbackSubmission {
  scenario: string;
  mode: string;
  engagingScore: number;
  realisticScore: number;
  oneThingToChange: string;
  submittedAt: string;
}

export async function submitQuickFeedback(data: QuickFeedbackSubmission): Promise<void> {
  const fields: Record<string, string | number> = {
    'Submitted At': data.submittedAt,
    'Scenario': data.scenario,
    'Mode': data.mode,
    'Engaging Score': data.engagingScore,
    'Realistic Score': data.realisticScore,
  };

  if (data.oneThingToChange) fields['One Thing to Change'] = data.oneThingToChange;

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
