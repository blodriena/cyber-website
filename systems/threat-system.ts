import { ThreatLevel, Alert } from '@/lib/types';

/**
 * Threat System - Manages trace levels, escalation, and pressure mechanics
 * Independent system: no React dependencies, pure business logic
 * Can be migrated to backend later
 */

export class ThreatEngine {
  private threatLevel: number = 0;
  private escalationRate: number = 0;
  private maxThreatLevel: number = 100;
  private alertHistory: Alert[] = [];
  private alertCounter: number = 0;

  constructor() {
    this.resetThreat();
  }

  /**
   * Calculate current threat status based on threat level
   */
  public getAlertStatus(level: number): 'clear' | 'caution' | 'warning' | 'critical' {
    if (level === 0) return 'clear';
    if (level <= 25) return 'caution';
    if (level <= 60) return 'warning';
    return 'critical';
  }

  /**
   * Increase threat based on player actions
   * Different actions have different threat impacts
   */
  public raiseThreat(amount: number, reason: string): ThreatLevel {
    this.threatLevel = Math.min(this.threatLevel + amount, this.maxThreatLevel);
    this.escalationRate = Math.min(this.escalationRate + amount * 0.1, 10);

    // Create alert if significant change
    if (amount > 5) {
      this.createAlert('warning', `Threat level increased: ${reason}`, 'warning');
    }

    return this.getThreatLevel();
  }

  /**
   * Decrease threat through careful actions or time
   */
  public decreaseThreat(amount: number, reason: string): ThreatLevel {
    this.threatLevel = Math.max(this.threatLevel - amount, 0);
    this.escalationRate = Math.max(this.escalationRate - amount * 0.05, 0);

    if (amount > 5) {
      this.createAlert('info', `Threat mitigated: ${reason}`, 'info');
    }

    return this.getThreatLevel();
  }

  /**
   * Natural escalation over time (simulates active trace)
   */
  public naturalEscalation(deltaMs: number): ThreatLevel {
    const escalationAmount = (deltaMs / 1000) * (this.escalationRate * 0.5);
    this.threatLevel = Math.min(this.threatLevel + escalationAmount, this.maxThreatLevel);

    return this.getThreatLevel();
  }

  /**
   * Get current threat level object
   */
  public getThreatLevel(): ThreatLevel {
    return {
      current: Math.round(this.threatLevel),
      escalation: this.escalationRate,
      alertStatus: this.getAlertStatus(this.threatLevel),
      traceActive: this.threatLevel > 30,
      traceDuration: Math.round(this.threatLevel * 100), // milliseconds, scales with threat
    };
  }

  /**
   * Create and track alerts
   */
  private createAlert(severity: 'info' | 'warning' | 'critical', message: string, type: string): Alert {
    const alert: Alert = {
      id: `alert_${++this.alertCounter}`,
      severity,
      message,
      timestamp: Date.now(),
      isAcknowledged: false,
    };

    this.alertHistory.push(alert);

    // Keep last 20 alerts
    if (this.alertHistory.length > 20) {
      this.alertHistory.shift();
    }

    return alert;
  }

  /**
   * Get alert history
   */
  public getAlertHistory(): Alert[] {
    return [...this.alertHistory];
  }

  /**
   * Get unacknowledged alerts
   */
  public getUnacknowledgedAlerts(): Alert[] {
    return this.alertHistory.filter((a) => !a.isAcknowledged);
  }

  /**
   * Acknowledge an alert
   */
  public acknowledgeAlert(alertId: string): void {
    const alert = this.alertHistory.find((a) => a.id === alertId);
    if (alert) {
      alert.isAcknowledged = true;
    }
  }

  /**
   * Trigger critical threat (mission compromised)
   */
  public triggerCriticalAlert(reason: string): Alert {
    this.threatLevel = this.maxThreatLevel;
    return this.createAlert('critical', `CRITICAL: ${reason}`, 'critical');
  }

  /**
   * Reset threat system
   */
  public resetThreat(): void {
    this.threatLevel = 0;
    this.escalationRate = 0;
    this.alertHistory = [];
  }

  /**
   * Check if mission is compromised (threat too high)
   */
  public isMissionCompromised(): boolean {
    return this.threatLevel >= 85;
  }

  /**
   * Get threat multiplier for difficulty scaling
   */
  public getThreatMultiplier(): number {
    // Returns 1.0 at threat 0, 2.0 at threat 100
    return 1 + this.threatLevel / 100;
  }

  /**
   * Simulate trace timer countdown
   */
  public getTimeUntilDetection(): number {
    if (!this.isMissionCompromised()) {
      // Random time between 30s and 2min, scales with threat
      const baseTime = 30000 + Math.random() * 90000;
      const threatFactor = 1 + this.threatLevel / 100;
      return Math.round(baseTime / threatFactor);
    }
    return 0;
  }
}

// Export singleton instance
let threatEngine: ThreatEngine | null = null;

export const getThreatEngine = (): ThreatEngine => {
  if (!threatEngine) {
    threatEngine = new ThreatEngine();
  }
  return threatEngine;
};
