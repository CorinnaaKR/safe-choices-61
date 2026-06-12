export type EvidenceType = 'message' | 'observation' | 'visual';

/** Player-facing modes. Learning = story/consequence driven, no visible scoring.
 *  Training = professional training with scoring, skill areas and certificate. */
export type Mode = 'learning' | 'training';

export type EvidenceCategory =
  | 'behavioural'
  | 'physical'
  | 'verbal'
  | 'digital'
  | 'environmental'
  | 'documentation';

export type EvidenceImportance = 'critical' | 'major' | 'minor';

/** Skill areas for Training-mode scoring and areas-for-improvement. */
export type SkillArea =
  | 'recognising-signs'
  | 'evidence-gathering'
  | 'responding'
  | 'escalation'
  | 'record-keeping';

export type SceneEnvironment = 'classroom' | 'playground' | 'office' | 'home';

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
  category?: EvidenceCategory;
  importance?: EvidenceImportance;
  points?: number;
}

export interface Choice {
  id: string;
  text: string;
  consequence: string;
  feedback: string;
  isOptimal: boolean;
  nextSceneId: string;
  points: number;
  skillArea?: SkillArea;
  /** Choice is hidden/locked until all listed evidence has been collected. */
  requiresEvidenceIds?: string[];
}

export interface Scene {
  id: string;
  title: string;
  narrative: string[];
  evidence?: Evidence[];
  choices?: Choice[];
  isDecisionPoint: boolean;
  isFinalScene?: boolean;
  /** Which 3D environment renders this scene. */
  environment?: SceneEnvironment;
}

export interface GameState {
  scenarioId: string;
  mode: Mode;
  currentSceneId: string;
  collectedEvidence: Evidence[];
  decisions: {
    sceneId: string;
    choiceId: string;
    isOptimal: boolean;
    points: number;
    skillArea?: SkillArea;
    supportingEvidenceIds?: string[];
  }[];
  totalPoints: number;
  maxPossiblePoints: number;
  isComplete: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface SuccessCriteria {
  minEvidence: number;
  requiredCriticalEvidence: number;
  maxPoorDecisions: number;
}

export interface ScenarioResource {
  title: string;
  url: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  role: string;
  learningObjectives: string[];
  scenes: Scene[];
  /** e.g. 'child-safeguarding', 'anti-radicalisation' */
  domain?: string;
  audience?: 'all' | 'young-people' | 'adults';
  /** 1 = introductory, 3 = advanced */
  difficulty?: number;
  durationMinutes?: number;
  contentWarnings?: string[];
  successCriteria?: SuccessCriteria;
  resources?: ScenarioResource[];
  completionFeedback?: {
    excellent: string;
    good: string;
    poor: string;
  };
  /** 'in-development' scenarios appear locked on the menu. */
  status?: 'available' | 'in-development';
  /** Plain-language "what to do if you ever see this" message (Learning mode results). */
  keyTakeaway?: string;
}

export interface FeedbackMessage {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
  bestPractice?: string;
}
