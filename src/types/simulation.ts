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

export type SceneEnvironment = 'classroom' | 'playground' | 'office' | 'home' | 'home-jamie';

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
  /** Short scene-setting lines shown before the phone conversation opens. */
  introNarrative?: string[];
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
  /**
   * Which closing-sequence outcome this final scene leads to (see ClosingSequenceData).
   * Generic alternative to the Lazlo-specific `callSceneComplete` flag — lets any
   * scenario branch its epilogue purely from which final scene was reached.
   */
  epilogueOutcome?: 'good' | 'sobering';
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
  /** Whether the Lazlo thread scene has been completed. */
  lazloThreadComplete?: boolean;
  /** Tone choice ID from the Lazlo thread (lt-tone-a / lt-tone-b / lt-tone-c). */
  lazloTone?: string;
  /** Follow-up choice from the Lazlo thread (wait / message / visit). */
  lazloFollowUp?: 'wait' | 'message' | 'visit';
  /** Whether the "making the call" scene (ACT Early simulation) has been completed. */
  callSceneComplete?: boolean;
  /** Evidence IDs the player chose to mention during the call scene. */
  callScript?: string[];
}

// ─── "Making the call" scene (ACT Early simulation) ──────────────────────────

export interface CallOperatorLine {
  /** Spoken by the operator. */
  text: string;
}

export interface CallEvidencePrompt {
  /** Evidence id this option requires to be offered — if not collected, option is hidden. */
  requiresEvidenceId?: string;
  /** What Evan says, drawing on that evidence. */
  text: string;
}

export interface CallStep {
  operatorLine: string;
  /** If present, the player picks one (evidence-gated options shown only when collected). */
  choices?: CallEvidencePrompt[];
  /** Fallback line used if none of the evidence-gated choices are available. */
  fallbackChoiceText?: string;
}

export interface CallSceneData {
  phoneNumber: string;
  serviceName: string;
  operatorName: string;
  steps: CallStep[];
  closingLine: string;
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

export interface CastMember {
  name: string;
  /** One-line who they are to the player character */
  role: string;
  /** 1–2 sentences of context shown in the panel */
  details: string;
}

export interface KnownFact {
  label: string;
  detail: string;
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
  /** People the player knows at the start — shown in the "What you know" panel. */
  castOfCharacters?: CastMember[];
  /** Pre-existing facts the player knows — shown in the "What you know" panel. */
  knownFacts?: KnownFact[];
  /** Fixed maximum score for the canonical optimal path — used as the scoring denominator. */
  maxPoints?: number;
  completionFeedback?: {
    excellent: string;
    good: string;
    poor: string;
  };
  /** 'in-development' scenarios appear locked on the menu. */
  status?: 'available' | 'in-development';
  /**
   * Which mode(s) this scenario currently supports. Omit to support both.
   * Each story is eventually meant to have both a personal (learning) and
   * professional (training) version — for the demo, each story covers one
   * mode only rather than building both POVs for both stories.
   */
  supportedModes?: Mode[];
  /** Plain-language "what to do if you ever see this" message (Learning mode results). */
  keyTakeaway?: string;
  /** Optional SMS conversation that plays before the first 3D scene. */
  preVisit?: PreVisitConversationData;
  /** Optional "making the call" scene, shown when the player escalates via a phone referral. */
  callScene?: CallSceneData;
  /** Optional epilogue, shown after the final scene before results. */
  epilogue?: EpilogueData;
  /**
   * Optional narrative closing sequence (epilogue + personalised reflection + a real
   * "common signs of..." page) — the Story-mode alternative to `epilogue`, which is
   * phone-thread-shaped and Lazlo-specific. See ClosingSequenceData.
   */
  closingSequence?: ClosingSequenceData;
}

// ─── Epilogue (post-final-scene outcome) ─────────────────────────────────────

export interface EpilogueThread {
  /** iMessage-style thread, shown for the good outcome. */
  sceneStamp: string;
  contactName: string;
  messages: { sender: 'contact' | 'you'; text: string }[];
}

export interface EpilogueSilence {
  /** One-sided outcome, shown for the sobering outcome. */
  sceneStamp: string;
  contactName: string;
  sentMessages: string[];
  narrativeCard: string[];
}

export interface EpilogueMiddle {
  sceneStamp: string;
  narrativeCard: string[];
}

export interface EpilogueData {
  good: EpilogueThread;
  sobering: EpilogueSilence;
  middle?: EpilogueMiddle;
}

// ─── Closing sequence (narrative epilogue + personalised reflection + real info) ────
//
// Built for the "gut instinct over completionism" design: the ending is gated only on
// whether the player told a trusted adult (Scene.epilogueOutcome), never on how many
// observations were logged. The reflection step adapts to what the player actually
// logged, but never treats a sparse log as a failure — see
// safeguarding-restructure-jamie-friend-pov memory for the full rationale.

export interface ClosingReflection {
  /** Shown when the player logged several observations during the story. */
  manyObservations: string[];
  /** Shown when few/none were logged but the player still told a trusted adult. */
  fewObservationsToldAnyway: string[];
  /** Shown when few/none were logged and the player did not tell anyone. */
  fewObservationsSilent: string[];
  /** Minimum number of logged observations counted as "several". Defaults to 3. */
  manyThreshold?: number;
}

export interface CommonSign {
  title: string;
  description: string;
}

export interface CommonSignsPage {
  title: string;
  intro: string;
  signs: CommonSign[];
  closingLine: string;
}

export interface ClosingSequenceData {
  /** Narrative paragraphs for the "told someone" outcome. */
  epilogueGood: string[];
  /** Narrative paragraphs for the "didn't tell anyone" outcome. */
  epilogueSobering: string[];
  reflection: ClosingReflection;
  commonSigns: CommonSignsPage;
}

export interface FeedbackMessage {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
  bestPractice?: string;
}
