import { Scenario } from '@/types/simulation';

/**
 * Lazlo's Story (anti-radicalisation) - Phase 2.
 * Stub registered so the menu shows it as in development; full scenario
 * is adapted from the Heli-V2 Ink draft.
 */
export const lazloScenario: Scenario = {
  id: 'lazlo-case',
  title: "Lazlo's Story",
  description:
    'An old friend has changed since his uncle died. His sister asks you to visit. What you notice in his home - and what you do about it - will shape what happens to him.',
  role: "Evan - Lazlo's friend",
  domain: 'anti-radicalisation',
  audience: 'all',
  difficulty: 2,
  durationMinutes: 20,
  status: 'in-development',
  learningObjectives: [
    'Recognise signs that someone is being drawn towards extremism',
    'Understand how grief and isolation increase vulnerability',
    'Learn how to keep communication open without judgement',
    'Know when and how to seek help (Prevent, ACT Early)',
  ],
  contentWarnings: [
    'This story is about a person being drawn into extremism.',
    'It mentions grief and the death of a family member.',
    'You can stop playing at any time.',
  ],
  scenes: [],
};
