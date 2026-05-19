import { GameState, PlayerStats, Mission, MissionResult, ThreatLevel, StoryState, Alert } from '@/lib/types';

// Initial game state factory
export const createInitialGameState = (): GameState => ({
  player: {
    handle: 'PHANTOM',
    level: 1,
    xp: 0,
    skillPoints: 0,
    completedMissions: 0,
    failedMissions: 0,
    successRate: 0,
    totalTraceMinutes: 0,
    currentRank: 'recruit',
    badges: [],
    achievements: [],
  },
  currentMission: undefined,
  missions: [],
  missionHistory: [],
  terminal: {
    history: [],
    currentLine: '',
    isProcessing: false,
    currentDirectory: '/home/user',
  },
  threat: {
    current: 0,
    escalation: 0,
    alertStatus: 'clear',
    traceActive: false,
    traceDuration: 0,
  },
  story: {
    currentAct: 'prologue',
    currentNode: 'opening_1',
    visitedNodes: ['opening_1'],
    storyFlags: new Set(),
    endings: [],
  },
  audio: {
    ambient: 0.7,
    sfx: 0.8,
    dialogue: 0.85,
    alert: 0.9,
    music: 0.6,
  },
  gameMode: 'menu',
  isPaused: false,
  savedAt: Date.now(),
});

// State Manager - Centralized game state management
export class GameStateManager {
  private state: GameState;
  private listeners: ((state: GameState) => void)[] = [];

  constructor() {
    this.state = this.loadFromStorage() || createInitialGameState();
  }

  private loadFromStorage(): GameState | null {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('PHANTOM_PROTOCOL_STATE');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore Set from array
        if (parsed.story && parsed.story.storyFlags) {
          parsed.story.storyFlags = new Set(parsed.story.storyFlags);
        }
        return parsed;
      }
    } catch (e) {
      console.error('[PHANTOM] Failed to load state from storage:', e);
    }
    return null;
  }

  public saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const toSave = {
        ...this.state,
        story: {
          ...this.state.story,
          storyFlags: Array.from(this.state.story.storyFlags), // Convert Set to array
        },
      };
      localStorage.setItem('PHANTOM_PROTOCOL_STATE', JSON.stringify(toSave));
      this.state.savedAt = Date.now();
    } catch (e) {
      console.error('[PHANTOM] Failed to save state to storage:', e);
    }
  }

  // Getters
  public getState(): GameState {
    return this.state;
  }

  public getPlayer(): PlayerStats {
    return this.state.player;
  }

  public getMissions(): Mission[] {
    return this.state.missions;
  }

  public getCurrentMission(): Mission | undefined {
    return this.state.currentMission;
  }

  public getThreatLevel(): ThreatLevel {
    return this.state.threat;
  }

  public getStory(): StoryState {
    return this.state.story;
  }

  // State mutations
  public updatePlayer(updates: Partial<PlayerStats>): void {
    this.state.player = { ...this.state.player, ...updates };
    this.notifyListeners();
  }

  public updateThreat(updates: Partial<ThreatLevel>): void {
    this.state.threat = { ...this.state.threat, ...updates };
    this.notifyListeners();
  }

  public updateStory(updates: Partial<StoryState>): void {
    this.state.story = { ...this.state.story, ...updates };
    this.notifyListeners();
  }

  public setCurrentMission(mission: Mission | undefined): void {
    this.state.currentMission = mission;
    this.notifyListeners();
  }

  public setGameMode(mode: GameState['gameMode']): void {
    this.state.gameMode = mode;
    this.notifyListeners();
  }

  public addMissionResult(result: MissionResult): void {
    this.state.missionHistory.push(result);
    const successCount = this.state.missionHistory.filter((r) => r.success).length;
    this.updatePlayer({
      completedMissions: successCount,
      failedMissions: this.state.missionHistory.filter((r) => !r.success).length,
      successRate: this.state.missionHistory.length
        ? Math.round((successCount / this.state.missionHistory.length) * 100)
        : 0,
      xp: this.state.player.xp + result.xpEarned,
    });
    this.notifyListeners();
  }

  public addStoryFlag(flag: string): void {
    this.state.story.storyFlags.add(flag);
    this.notifyListeners();
  }

  public hasStoryFlag(flag: string): boolean {
    return this.state.story.storyFlags.has(flag);
  }

  // Listener management
  public subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Reset game
  public reset(): void {
    this.state = createInitialGameState();
    this.notifyListeners();
    this.saveToStorage();
  }
}

// Singleton instance
let stateManager: GameStateManager | null = null;

export const getStateManager = (): GameStateManager => {
  if (!stateManager) {
    stateManager = new GameStateManager();
  }
  return stateManager;
};
