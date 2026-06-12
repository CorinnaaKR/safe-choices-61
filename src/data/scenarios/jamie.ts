import {
  Scenario,
  EvidenceCategory,
  EvidenceImportance,
  SkillArea,
  SceneEnvironment,
} from '@/types/simulation';
import { safeguardingScenario as base } from '@/data/scenario';

/**
 * Jamie's Story, migrated to the multi-scenario schema.
 * The narrative lives in `data/scenario.ts`; this module layers on the
 * metadata the engine needs (evidence weighting, skill areas, environments).
 */

const evidenceMeta: Record<
  string,
  { category: EvidenceCategory; importance: EvidenceImportance; points: number }
> = {
  'obs-1': { category: 'behavioural', importance: 'major', points: 10 },
  'obs-2': { category: 'behavioural', importance: 'major', points: 10 },
  'vis-1': { category: 'physical', importance: 'major', points: 10 },
  'vis-2': { category: 'physical', importance: 'critical', points: 25 },
  'obs-3': { category: 'verbal', importance: 'critical', points: 20 },
  'vis-3': { category: 'behavioural', importance: 'critical', points: 20 },
  'msg-1': { category: 'documentation', importance: 'minor', points: 5 },
  'obs-4': { category: 'behavioural', importance: 'major', points: 10 },
  'msg-2': { category: 'documentation', importance: 'minor', points: 5 },
};

const choiceSkillAreas: Record<string, SkillArea> = {
  'c1-1': 'responding',
  'c1-2': 'recognising-signs',
  'c1-3': 'responding',
  'c2-1': 'responding',
  'c2-2': 'evidence-gathering',
  'c2-3': 'record-keeping',
  'c3a-1': 'escalation',
  'c3a-2': 'escalation',
  'c3a-3': 'escalation',
  'c3b-1': 'escalation',
  'c3b-2': 'escalation',
  'c3b-3': 'escalation',
  'c4-1': 'record-keeping',
  'c4-2': 'record-keeping',
  'c4-3': 'record-keeping',
  'c4d-1': 'escalation',
  'c4d-2': 'escalation',
  'c4r-1': 'escalation',
  'c4r-2': 'record-keeping',
  'c5-1': 'responding',
  'c5l-1': 'escalation',
  'c5c-1': 'escalation',
  'c5u-1': 'escalation',
  'c5i-1': 'record-keeping',
  'c5i-2': 'record-keeping',
};

/** Mirrors the old getSceneType() mapping exactly. */
const sceneEnvironments: Record<string, SceneEnvironment> = {
  'scene-1': 'classroom',
  'scene-2': 'playground',
  'scene-3a': 'classroom',
  'scene-3b': 'classroom',
};
const defaultEnvironment: SceneEnvironment = 'office';

export const jamieScenario: Scenario = {
  ...base,
  domain: 'child-safeguarding',
  audience: 'all',
  difficulty: 1,
  durationMinutes: 20,
  status: 'available',
  contentWarnings: [
    'This story is about a child who may be being hurt at home.',
    'It mentions bruises and a child being scared.',
    'You can stop playing at any time.',
  ],
  successCriteria: {
    minEvidence: 5,
    requiredCriticalEvidence: 2,
    maxPoorDecisions: 1,
  },
  resources: [
    { title: 'NSPCC - Spotting the signs of child abuse', url: 'https://www.nspcc.org.uk/what-is-child-abuse/spotting-signs-child-abuse/' },
    { title: 'Childline (for under 19s)', url: 'https://www.childline.org.uk/' },
    { title: 'Gov.uk - Report child abuse', url: 'https://www.gov.uk/report-child-abuse' },
  ],
  keyTakeaway:
    'If you ever notice things like this in real life - someone with bruises, someone who has stopped talking or playing, someone who seems scared - you do not need to be sure about what it means. Tell an adult you trust: a teacher, a parent, or the safeguarding lead. Noticing and telling is how people get help.',
  completionFeedback: {
    excellent:
      'You noticed the signs, gathered evidence carefully, and reported to the right person at the right time. This is exactly how children get protected.',
    good: 'You recognised that Jamie needed help and acted on it. Look at the timing of your decisions - earlier reporting makes children safer.',
    poor: 'Jamie needed an adult to notice and act quickly. Review the signs you saw and remember: report concerns to the safeguarding lead on the same day.',
  },
  scenes: base.scenes.map((scene) => ({
    ...scene,
    environment: sceneEnvironments[scene.id] ?? defaultEnvironment,
    evidence: scene.evidence?.map((ev) => ({ ...ev, ...evidenceMeta[ev.id] })),
    choices: scene.choices?.map((choice) => ({
      ...choice,
      skillArea: choiceSkillAreas[choice.id],
    })),
  })),
};
