export type EvidenceType = 'message' | 'observation' | 'visual';

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export interface Choice {
  id: string;
  text: string;
  consequence: string;
  feedback: string;
  isOptimal: boolean;
  nextSceneId: string;
  points: number;
}

export interface Scene {
  id: string;
  title: string;
  narrative: string[];
  evidence?: Evidence[];
  choices?: Choice[];
  isDecisionPoint: boolean;
  isFinalScene?: boolean;
}

export interface GameState {
  currentSceneId: string;
  collectedEvidence: Evidence[];
  decisions: {
    sceneId: string;
    choiceId: string;
    isOptimal: boolean;
    points: number;
  }[];
  totalPoints: number;
  maxPossiblePoints: number;
  isComplete: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  role: string;
  learningObjectives: string[];
  scenes: Scene[];
}

export interface FeedbackMessage {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  message: string;
  bestPractice?: string;
}
