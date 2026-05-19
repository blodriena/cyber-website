import { EventEmitter } from 'events'

export interface PoliceTrace {
  distance: number // 0-100 (100 = caught)
  threatLevel: number // 0-100
  status: 'searching' | 'triangulating' | 'closing_in' | 'detected'
  scanProgress: number // 0-100
  timeRemaining: number // seconds
}

export type PoliceEventType = 'update' | 'alert' | 'detected' | 'escaped'

class PoliceTrackerSystem extends EventEmitter {
  private trace: PoliceTrace = {
    distance: 100,
    threatLevel: 0,
    status: 'searching',
    scanProgress: 0,
    timeRemaining: 180, // 3 minutes
  }

  private isActive = false
  private interval: NodeJS.Timeout | null = null
  private baseDecreaseRate = 0.3

  constructor() {
    super()
  }

  startTracking(): void {
    if (this.isActive) return
    this.isActive = true
    this.trace.timeRemaining = 180

    this.interval = setInterval(() => {
      this.updateTrace()
    }, 1000)

    this.emit('update', { ...this.trace })
  }

  private updateTrace(): void {
    if (!this.isActive) return

    this.trace.timeRemaining = Math.max(0, this.trace.timeRemaining - 1)
    this.trace.scanProgress = Math.min(100, this.trace.scanProgress + 0.5)

    // Distance decreases as scan progresses
    const baseDistance = 100 - this.trace.scanProgress * 0.8
    this.trace.distance = Math.max(0, baseDistance)

    // Update threat level based on distance
    if (this.trace.distance > 80) {
      this.trace.status = 'searching'
      this.trace.threatLevel = Math.min(25, this.trace.scanProgress * 0.25)
    } else if (this.trace.distance > 50) {
      this.trace.status = 'triangulating'
      this.trace.threatLevel = Math.min(50, 25 + (80 - this.trace.distance) * 1.16)
      this.emit('alert', { level: 'warning', message: 'Police triangulating your position!' })
    } else if (this.trace.distance > 20) {
      this.trace.status = 'closing_in'
      this.trace.threatLevel = Math.min(75, 50 + (50 - this.trace.distance) * 1)
      this.emit('alert', { level: 'critical', message: 'Police closing in on your location!' })
    } else if (this.trace.distance > 0) {
      this.trace.status = 'detected'
      this.trace.threatLevel = 100
      this.emit('detected', { message: 'SYSTEM COMPROMISED - POLICE DETECTED' })
    }

    if (this.trace.timeRemaining === 0 && this.trace.distance > 0) {
      this.stopTracking()
      this.emit('escaped', { message: 'Trace expired - You got away!' })
    }

    this.emit('update', { ...this.trace })
  }

  // Player actions to increase distance/reset trace
  activateVPN(): void {
    this.trace.distance = Math.min(100, this.trace.distance + 15)
    this.trace.scanProgress = Math.max(0, this.trace.scanProgress - 10)
    this.emit('update', { ...this.trace, action: 'vpn_activated' })
  }

  routeThroughProxy(): void {
    this.trace.distance = Math.min(100, this.trace.distance + 25)
    this.trace.scanProgress = Math.max(0, this.trace.scanProgress - 20)
    this.emit('update', { ...this.trace, action: 'proxy_routed' })
  }

  spawnFakeSignal(): void {
    this.trace.distance = Math.min(100, this.trace.distance + 10)
    this.trace.scanProgress = Math.max(0, this.trace.scanProgress - 5)
    this.emit('update', { ...this.trace, action: 'fake_signal_spawned' })
  }

  stopTracking(): void {
    this.isActive = false
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  getTrace(): PoliceTrace {
    return { ...this.trace }
  }

  reset(): void {
    this.stopTracking()
    this.trace = {
      distance: 100,
      threatLevel: 0,
      status: 'searching',
      scanProgress: 0,
      timeRemaining: 180,
    }
  }
}

let instance: PoliceTrackerSystem | null = null

export function getPoliceTracker(): PoliceTrackerSystem {
  if (!instance) {
    instance = new PoliceTrackerSystem()
  }
  return instance
}
