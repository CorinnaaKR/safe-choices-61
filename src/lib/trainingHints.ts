import { SkillArea, EvidenceCategory, EvidenceImportance } from '@/types/simulation';

/**
 * Vague, curiosity-driving hints shown on the training results page.
 * The burden of learning and discernment is on the user — never give the answer,
 * only point their attention in a direction.
 */

// Hints keyed by skill area — shown when that area scored below threshold
export const SKILL_AREA_HINTS: Record<SkillArea, string[]> = {
  'recognising-signs': [
    "People communicate distress in many ways — not always through what they say. Consider what a person's environment, body language, and daily patterns might be telling you.",
    "Patterns matter more than single moments. What looked ordinary on its own might look different when you consider everything together.",
    "Absence can be as telling as presence. What was missing from the picture you were looking at?",
  ],
  'evidence-gathering': [
    "An environment can tell you a lot about a person — remember to pay attention and investigate anything you think might reveal more.",
    "Evidence rarely announces itself. The things that seem small or incidental are sometimes the things worth sitting with longer.",
    "What someone surrounds themselves with — objects, images, messages — often reflects something about where their mind is. Did you look closely enough?",
  ],
  'responding': [
    "How you respond to someone shapes whether they feel safe enough to let you in. Consider the difference between what you said and how it might have landed.",
    "There is often a tension between acting quickly and acting carefully. Think about which moments called for which approach.",
    "A response that feels right in the moment is not always the one that builds trust. What did the person in front of you actually need?",
  ],
  'escalation': [
    "Knowing when something is beyond your individual role to manage is itself a skill. Think about who else should have been part of this picture.",
    "Escalation is not a failure — it is a professional responsibility. Consider whether there were moments where another set of eyes was needed.",
    "The people with the clearest view of a situation are not always the ones who act on it. Think about who you could have brought in.",
  ],
  'record-keeping': [
    "What you notice is only useful if it can be passed on. Think about how you would describe what you observed to someone who wasn't there.",
    "Precise language matters when documenting concern — the difference between 'seemed upset' and what you actually observed can be significant.",
    "Records are not just for you. Consider whether what you documented would give someone else enough to act on.",
  ],
};

// Hints keyed by evidence category — shown for missed evidence items
const EVIDENCE_CATEGORY_HINTS: Record<EvidenceCategory, string> = {
  behavioural:
    "Behaviour is one of the clearest windows into how someone is doing. Changes — however gradual — are worth noting.",
  physical:
    "Physical signs are not always obvious, and not every mark tells the same story. But they are part of the picture.",
  verbal:
    "People often say more than they mean to — and less than they need to. Listen for what is underneath the words.",
  digital:
    "Digital life is real life. What someone engages with online is as meaningful as what you can see in a room.",
  environmental:
    "Spaces reflect the people who inhabit them. What does the environment around someone tell you about their world?",
  documentation:
    "Paper trails carry history. What was written down — and what wasn't — can tell its own story.",
};

// Extra weight for missed critical evidence
const IMPORTANCE_HINT: Record<EvidenceImportance, string | null> = {
  critical:
    "Some details in a situation carry more weight than others. Building the habit of looking for those details — not just the obvious ones — is what separates a careful observer from a concerned bystander.",
  major: null,
  minor: null,
};

export interface TrainingHint {
  text: string;
  /** Used to group hints visually — not shown to the user */
  source: 'skill' | 'evidence';
}

/**
 * Derives a deduplicated set of vague hints from:
 * - skill areas that scored below threshold
 * - evidence categories that were missed
 */
export function deriveHints(params: {
  weakSkillAreas: SkillArea[];
  missedEvidenceCategories: { category: EvidenceCategory; importance: EvidenceImportance }[];
}): TrainingHint[] {
  const hints: TrainingHint[] = [];
  const seen = new Set<string>();

  const add = (text: string, source: TrainingHint['source']) => {
    if (!seen.has(text)) {
      seen.add(text);
      hints.push({ text, source });
    }
  };

  // One hint per weak skill area (rotate through the pool by area index)
  params.weakSkillAreas.forEach((area, i) => {
    const pool = SKILL_AREA_HINTS[area];
    if (pool?.length) add(pool[i % pool.length], 'skill');
  });

  // One hint per unique missed evidence category
  const seenCategories = new Set<EvidenceCategory>();
  for (const { category, importance } of params.missedEvidenceCategories) {
    if (!seenCategories.has(category)) {
      seenCategories.add(category);
      add(EVIDENCE_CATEGORY_HINTS[category], 'evidence');
    }
    // Add the importance-level hint once if critical evidence was missed
    const importanceHint = IMPORTANCE_HINT[importance];
    if (importanceHint) add(importanceHint, 'evidence');
  }

  // Cap at 5 hints so the page doesn't overwhelm
  return hints.slice(0, 5);
}
