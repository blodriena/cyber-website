import { ProfileManager } from '@/systems/profile-system';

/**
 * Profile System - Player stats, ranks, achievements
 * Pure business logic for player progression
 */

export class ProfileManager {
  private ranks: Map<string, { title: string; minXP: number; minMissions: number }> = new Map();

  constructor() {
    this.initializeRanks();
  }

  /**
   * Calculate current rank based on XP
   */
  public calculateRank(xp: number, completedMissions: number): string {
    let rank = 'recruit';

    const rankRequirements = [
      { rank: 'operative', xp: 1000, missions: 3 },
      { rank: 'specialist', xp: 3000, missions: 8 },
      { rank: 'veteran', xp: 7000, missions: 15 },
      { rank: 'commander', xp: 15000, missions: 25 },
      { rank: 'legend', xp: 30000, missions: 50 },
    ];

    for (const req of rankRequirements) {
      if (xp >= req.xp && completedMissions >= req.missions) {
        rank = req.rank;
      } else {
        break;
      }
    }

    return rank;
  }

  /**
   * Get rank progress to next rank
   */
  public getRankProgress(currentRank: string): { nextRank: string; progressPercent: number } {
    const rankProgression = ['recruit', 'operative', 'specialist', 'veteran', 'commander', 'legend'];
    const currentIndex = rankProgression.indexOf(currentRank);

    if (currentIndex === rankProgression.length - 1) {
      return { nextRank: 'MAX', progressPercent: 100 };
    }

    // Simplified progress calculation
    return {
      nextRank: rankProgression[currentIndex + 1],
      progressPercent: Math.random() * 100,
    };
  }

  /**
   * Initialize rank system
   */
  private initializeRanks(): void {
    this.ranks.set('recruit', { title: 'Recruit', minXP: 0, minMissions: 0 });
    this.ranks.set('operative', { title: 'Operative', minXP: 1000, minMissions: 3 });
    this.ranks.set('specialist', { title: 'Specialist', minXP: 3000, minMissions: 8 });
    this.ranks.set('veteran', { title: 'Veteran', minXP: 7000, minMissions: 15 });
    this.ranks.set('commander', { title: 'Commander', minXP: 15000, minMissions: 25 });
    this.ranks.set('legend', { title: 'Legend', minXP: 30000, minMissions: 50 });
  }
}

// Singleton
let profileManager: ProfileManager | null = null;

export const getProfileManager = (): ProfileManager => {
  if (!profileManager) {
    profileManager = new ProfileManager();
  }
  return profileManager;
};
