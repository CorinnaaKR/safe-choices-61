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

// ─── Rich evidence visual types ──────────────────────────────────────────────

export type EvidenceVisualType = 'phone-message' | 'poster' | 'tv-screen' | 'document';

export interface MessageBubble {
  sender: 'contact' | 'you';
  text: string;
  time?: string;
}

export interface EvidenceVisual {
  type: EvidenceVisualType;
  // phone-message
  contactName?: string;
  contactInitial?: string;
  thread?: MessageBubble[];
  // poster
  posterTitle?: string;
  posterBody?: string[];
  posterTagline?: string;
  posterAccentColor?: string;
  // tv-screen
  channelName?: string;
  tvHeadline?: string;
  tvSubheadline?: string;
  tvTicker?: string;
  // document
  documentTitle?: string;
  documentBody?: string[];
}

// ─── Pre-visit conversation (SMS screen before 3D scene) ─────────────────────

export interface PreVisitChoice {
  id: string;
  /** Text the player "sends" */
  text: string;
  /** Optional reply from the contact */
  response?: string;
  /** Effect on trust level: positive = Lazlo more open, negative = less */
  trustDelta: number;
  /** A clue revealed to the player via Lilly's reply */
  revealsClue?: string;
}

export interface PreVisitExchange {
  id: string;
  /** Incoming messages from the contact, shown in sequence */
  incoming: string[];
  choices: PreVisitChoice[];
}

export interface PreVisitConversationData {
  contactName: string;
  contactInitial: string;
  contactSubtitle?: string;
  /** Starting trust level before any choices modify it */
  baseTrust: number;
  exchanges: PreVisitExchange[];
}

// ─── Core evidence & scene types ─────────────────────────────────────────────

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
  /** Rich visual for the inspect panel */
  visual?: EvidenceVisual;
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
  /** Effect on trust level when this choice is made */
  trustDelta?: number;
  /** Only visible if current trustLevel >= this value */
  requiresMinTrust?: number;
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

export interface TrainingProfile {
  name: string;
  organisation: string;
  priorTraining: string;
  declaredAt: string;
}

export interface GameState {
  scenarioId: string;
  mode: Mode;
  currentSceneId: string;
  /** Set when the user completes the training gate form. */
  trainingProfile?: TrainingProfile;
  collectedEvidence: Evidence[];
  decisions: {
    sceneId: string;
    choiceId: string;
    isOptimal: boolean;
    points: number;
    skillArea?: SkillArea;
    supportingEvidenceIds?: string[];
    trustDelta?: number;
  }[];
  totalPoints: number;
  maxPossiblePoints: number;
  isComplete: boolean;
  startedAt: string;
  completedAt?: string;
  /** Trust level for trust-sensitive scenarios (0–100). */
  trustLevel?: number;
  /** Whether the pre-visit conversation has been completed. */
  preVisitComplete?: boolean;
  /** Choices made during the pre-visit conversation. */
  preVisitChoices?: string[];
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
  /** Optional SMS conversation that plays before the first 3D scene. */
  preVisit?: PreVisitConversationData;
}

export interface FeedbackMessage {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
  bestPractice?: string;
}
