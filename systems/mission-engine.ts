import { Mission, Objective, MissionCategory, MissionDifficulty } from '@/lib/types';

/**
 * Mission Engine - Manages missions, progression, and objectives
 * Pure business logic for mission system
 */

export class MissionEngine {
  private missions: Map<string, Mission> = new Map();
  private missionCounter: number = 0;

  constructor() {
    this.initializeSampleMissions();
  }

  /**
   * Create a new mission
   */
  public createMission(
    title: string,
    briefing: string,
    category: MissionCategory,
    difficulty: MissionDifficulty,
    threatLevel: number,
    objectives: Objective[],
    storyFlags: string[] = [],
    requiredRank?: string,
  ): Mission {
    const mission: Mission = {
      id: `mission_${++this.missionCounter}`,
      title,
      briefing,
      category,
      difficulty,
      objectives,
      rewards: {
        xp: this.calculateXP(difficulty),
        credits: this.calculateCredits(difficulty),
      },
      consequences: {
        success: [],
        failure: [],
      },
      isLocked: !!requiredRank,
      requiredRank,
      storyFlags,
      threatLevel,
    };

    this.missions.set(mission.id, mission);
    return mission;
  }

  /**
   * Get a mission by ID
   */
  public getMission(id: string): Mission | undefined {
    return this.missions.get(id);
  }

  /**
   * Get all missions
   */
  public getAllMissions(): Mission[] {
    return Array.from(this.missions.values());
  }

  /**
   * Get missions by category
   */
  public getMissionsByCategory(category: MissionCategory): Mission[] {
    return Array.from(this.missions.values()).filter((m) => m.category === category);
  }

  /**
   * Get available missions for player
   */
  public getAvailableMissions(playerRank: string, storyFlags: Set<string>): Mission[] {
    return Array.from(this.missions.values()).filter((m) => {
      // Check if mission is locked
      if (m.isLocked && m.requiredRank && !this.isRankUnlocked(playerRank, m.requiredRank)) {
        return false;
      }

      // Check if story prerequisites are met
      if (m.storyFlags.length > 0) {
        const missingFlags = m.storyFlags.filter((f) => !storyFlags.has(f));
        if (missingFlags.length > 0) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Complete an objective
   */
  public completeObjective(mission: Mission, objectiveId: string): void {
    const objective = mission.objectives.find((o) => o.id === objectiveId);
    if (objective) {
      objective.isCompleted = true;
    }
  }

  /**
   * Check if all objectives are complete
   */
  public areMissionObjectivesComplete(mission: Mission): boolean {
    return mission.objectives.every((o) => o.isCompleted);
  }

  /**
   * Reset mission objectives
   */
  public resetMissionObjectives(mission: Mission): void {
    mission.objectives.forEach((o) => {
      o.isCompleted = false;
    });
  }

  /**
   * Add consequence to mission
   */
  public addConsequence(mission: Mission, consequence: string, isSuccess: boolean): void {
    if (isSuccess) {
      mission.consequences.success.push(consequence);
    } else {
      mission.consequences.failure.push(consequence);
    }
  }

  /**
   * Add story flag requirement to mission
   */
  public addStoryFlagRequirement(mission: Mission, flag: string): void {
    if (!mission.storyFlags.includes(flag)) {
      mission.storyFlags.push(flag);
    }
  }

  /**
   * Calculate difficulty-based XP reward
   */
  private calculateXP(difficulty: MissionDifficulty): number {
    const baseXP = 100;
    const multipliers: Record<MissionDifficulty, number> = {
      easy: 1,
      medium: 1.5,
      hard: 2.5,
      extreme: 4,
    };
    return Math.round(baseXP * multipliers[difficulty]);
  }

  /**
   * Calculate difficulty-based credit reward
   */
  private calculateCredits(difficulty: MissionDifficulty): number {
    const baseCredits = 500;
    const multipliers: Record<MissionDifficulty, number> = {
      easy: 1,
      medium: 1.5,
      hard: 2.5,
      extreme: 4,
    };
    return Math.round(baseCredits * multipliers[difficulty]);
  }

  /**
   * Check rank unlock progression
   */
  private isRankUnlocked(playerRank: string, requiredRank: string): boolean {
    const rankHierarchy = ['recruit', 'operative', 'specialist', 'veteran', 'commander', 'legend'];
    const playerRankIndex = rankHierarchy.indexOf(playerRank);
    const requiredRankIndex = rankHierarchy.indexOf(requiredRank);
    return playerRankIndex >= requiredRankIndex;
  }

  /**
   * Initialize sample missions for gameplay
   */
  private initializeSampleMissions(): void {
    // Reconnaissance missions
    this.createMission(
      'Satellite Hack',
      'Infiltrate government satellite network and extract telemetry data.',
      'reconnaissance',
      'medium',
      35,
      [
        { id: 'obj_1', description: 'Establish connection to satellite uplink', type: 'infiltrate', target: 'SAT_UPLINK', isCompleted: false },
        { id: 'obj_2', description: 'Extract encryption keys from secure vault', type: 'collect', target: 'VAULT_001', isCompleted: false },
        { id: 'obj_3', description: 'Download telemetry data and exfiltrate', type: 'extract', target: 'TEL_DB', isCompleted: false },
      ],
      ['started_game'],
    );

    this.createMission(
      'Network Surveillance',
      'Tap into corporate network and monitor internal communications.',
      'reconnaissance',
      'easy',
      20,
      [
        { id: 'obj_1', description: 'Deploy sniffer on backbone router', type: 'infiltrate', target: 'ROUTER_09', isCompleted: false },
        { id: 'obj_2', description: 'Collect VIP communication logs (15 min minimum)', type: 'collect', target: 'COMM_LOG', isCompleted: false },
      ],
      ['started_game'],
    );

    this.createMission(
      'Deep Web Analysis',
      'Research underground data markets and catalog active sellers.',
      'reconnaissance',
      'hard',
      50,
      [
        { id: 'obj_1', description: 'Access dark market forums', type: 'infiltrate', target: 'FORUM_DW', isCompleted: false },
        { id: 'obj_2', description: 'Identify 5 high-value targets', type: 'collect', target: 'TARGETS', isCompleted: false },
        { id: 'obj_3', description: 'Extract seller reputation data', type: 'extract', target: 'REP_DB', isCompleted: false },
      ],
      [],
      'operative',
    );

    // Infiltration missions
    this.createMission(
      'Corporate Espionage',
      'Breach competitor R&D servers and steal proprietary AI research.',
      'infiltration',
      'hard',
      60,
      [
        { id: 'obj_1', description: 'Bypass firewall security', type: 'infiltrate', target: 'FW_001', isCompleted: false },
        { id: 'obj_2', description: 'Locate R&D database', type: 'collect', target: 'REARCH_DB', isCompleted: false },
        { id: 'obj_3', description: 'Copy AI model files', type: 'extract', target: 'AI_MODELS', isCompleted: false },
      ],
      [],
      'operative',
    );

    this.createMission(
      'Government Database Breach',
      'Access classified government systems and retrieve encrypted documents.',
      'infiltration',
      'extreme',
      80,
      [
        { id: 'obj_1', description: 'Break past MFA authentication', type: 'infiltrate', target: 'MFA_AUTH', isCompleted: false },
        { id: 'obj_2', description: 'Locate classified document vault', type: 'collect', target: 'CLASS_VAULT', isCompleted: false },
        { id: 'obj_3', description: 'Extract and decrypt documents', type: 'extract', target: 'DOCS', isCompleted: false },
        { id: 'obj_4', description: 'Cover tracks and exit system', type: 'sabotage', target: 'LOGS', isCompleted: false },
      ],
      [],
      'specialist',
    );

    // Extraction missions
    this.createMission(
      'Data Exfiltration',
      'Extract target files from secure server before authorities lock down the system.',
      'extraction',
      'hard',
      55,
      [
        { id: 'obj_1', description: 'Locate target files', type: 'collect', target: 'TARGET_FILES', isCompleted: false },
        { id: 'obj_2', description: 'Bypass encryption', type: 'infiltrate', target: 'ENCRYPT', isCompleted: false },
        { id: 'obj_3', description: 'Exfiltrate within time limit', type: 'extract', target: 'EXFIL', isCompleted: false },
      ],
      [],
    );

    // Defense missions
    this.createMission(
      'System Defense',
      'Protect allied network from incoming attack and neutralize threats.',
      'defense',
      'medium',
      40,
      [
        { id: 'obj_1', description: 'Identify attacking IP addresses', type: 'collect', target: 'ATTACK_IPS', isCompleted: false },
        { id: 'obj_2', description: 'Deploy countermeasures', type: 'defend', target: 'DEFENSE_NODE', isCompleted: false },
        { id: 'obj_3', description: 'Maintain network uptime for 10 minutes', type: 'defend', target: 'UPTIME', isCompleted: false },
      ],
      ['mission_briefing'],
    );

    // Sabotage missions
    this.createMission(
      'Infrastructure Sabotage',
      'Disable critical systems at target facility without getting caught.',
      'sabotage',
      'hard',
      65,
      [
        { id: 'obj_1', description: 'Access power management system', type: 'infiltrate', target: 'POWER_MGMT', isCompleted: false },
        { id: 'obj_2', description: 'Plant malware in backup systems', type: 'sabotage', target: 'BACKUP_SYS', isCompleted: false },
        { id: 'obj_3', description: 'Disable security cameras', type: 'sabotage', target: 'CAM_SYS', isCompleted: false },
        { id: 'obj_4', description: 'Maintain cover and escape', type: 'sabotage', target: 'COVER', isCompleted: false },
      ],
      [],
      'veteran',
    );
  }
}

// Singleton instance
let missionEngine: MissionEngine | null = null;

export const getMissionEngine = (): MissionEngine => {
  if (!missionEngine) {
    missionEngine = new MissionEngine();
  }
  return missionEngine;
};
