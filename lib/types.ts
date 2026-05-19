// Core game types for PHANTOM PROTOCOL

// ==================== PROFILE & PLAYER ====================
export interface PlayerStats {
  handle: string;
  level: number;
  xp: number;
  skillPoints: number;
  completedMissions: number;
  failedMissions: number;
  successRate: number;
  totalTraceMinutes: number;
  currentRank: string;
  badges: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: number;
  isHidden: boolean;
}

// ==================== MISSIONS ====================
export type MissionCategory =
  | 'reconnaissance'
  | 'infiltration'
  | 'extraction'
  | 'defense'
  | 'sabotage';

export type MissionDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface Mission {
  id: string;
  title: string;
  briefing: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  objectives: Objective[];
  rewards: {
    xp: number;
    credits: number;
  };
  consequences: {
    success: string[];
    failure: string[];
  };
  timeLimit?: number; // milliseconds
  isLocked: boolean;
  requiredRank?: string;
  storyFlags: string[];
  threatLevel: number; // 0-100, affects pressure system
}

export interface Objective {
  id: string;
  description: string;
  type: 'collect' | 'infiltrate' | 'extract' | 'defend' | 'sabotage';
  target: string;
  isCompleted: boolean;
}

export interface MissionResult {
  missionId: string;
  success: boolean;
  xpEarned: number;
  timeSpent: number;
  consequencesTriggered: string[];
}

// ==================== TERMINAL ====================
export interface TerminalCommand {
  name: string;
  description: string;
  usage: string;
  category: 'system' | 'data' | 'network' | 'mission' | 'help';
  execute: (args: string[]) => string | Promise<string>;
}

export interface TerminalHistory {
  timestamp: number;
  command: string;
  output: string;
  status: 'success' | 'error' | 'pending';
}

export interface TerminalState {
  history: TerminalHistory[];
  currentLine: string;
  isProcessing: boolean;
  currentDirectory: string;
}

// ==================== THREAT/PRESSURE ====================
export interface ThreatLevel {
  current: number; // 0-100
  escalation: number;
  alertStatus: 'clear' | 'caution' | 'warning' | 'critical';
  traceActive: boolean;
  traceDuration: number; // milliseconds
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  isAcknowledged: boolean;
}

// ==================== STORY ====================
export type StoryAct = 'prologue' | 'act1' | 'act2' | 'act3' | 'epilogue';

export interface StoryNode {
  id: string;
  act: StoryAct;
  character: string;
  dialogue: string;
  choices?: StoryChoice[];
  consequences?: string[];
  flags: string[];
}

export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
  triggerFlags?: string[];
}

export interface StoryState {
  currentAct: StoryAct;
  currentNode: string;
  visitedNodes: string[];
  storyFlags: Set<string>;
  endings: string[];
}

export interface Character {
  id: string;
  name: string;
  handle: string;
  role: string;
  description: string;
  avatar?: string;
  isAlly: boolean;
}

// ==================== AUDIO ====================
export interface AudioTrack {
  id: string;
  name: string;
  category: 'ambient' | 'sfx' | 'dialogue' | 'alert' | 'music';
  src: string;
  volume: number;
  loop: boolean;
  isPlaying: boolean;
}

export interface AudioMix {
  ambient: number;
  sfx: number;
  dialogue: number;
  alert: number;
  music: number;
}

// ==================== GAME STATE ====================
export interface GameState {
  player: PlayerStats;
  currentMission?: Mission;
  missions: Mission[];
  missionHistory: MissionResult[];
  terminal: TerminalState;
  threat: ThreatLevel;
  story: StoryState;
  audio: AudioMix;
  gameMode: 'menu' | 'mission' | 'terminal' | 'story' | 'profile';
  isPaused: boolean;
  savedAt: number;
}

// ==================== UI STATE ====================
export interface UIState {
  isTerminalOpen: boolean;
  isMenuOpen: boolean;
  isProfileOpen: boolean;
  isMissionOpen: boolean;
  notificationsQueue: Alert[];
  glitchIntensity: number;
}
