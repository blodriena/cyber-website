'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getStateManager } from '@/systems/state-manager'
import { getProfileManager } from '@/systems/profile-system'
import { PlayerStats, MissionResult } from '@/lib/types'

export default function ProfilePage() {
  const [player, setPlayer] = useState<PlayerStats | null>(null)
  const [missionHistory, setMissionHistory] = useState<MissionResult[]>([])
  const stateManager = getStateManager()
  const profileManager = getProfileManager()

  useEffect(() => {
    const state = stateManager.getState()
    setPlayer(state.player)
    setMissionHistory(state.missionHistory)

    const unsubscribe = stateManager.subscribe((newState) => {
      setPlayer(newState.player)
      setMissionHistory(newState.missionHistory)
    })

    return unsubscribe
  }, [])

  if (!player) return null

  const nextRankProgress = profileManager.getRankProgress(player.currentRank)
  const levelProgress = (player.xp % 1000) / 1000 // Every 1000 XP = next level

  return (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-neon-cyan hover:text-accent transition-colors mb-6 inline-block">
          ← RETURN TO BASE
        </Link>

        {/* Header */}
        <div className="glassmorphism p-8 rounded border border-neon-cyan/20 mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-muted-foreground">OPERATIVE</span> {player.handle}
          </h1>
          <div className="flex items-center justify-between mt-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">RANK</div>
              <div className="text-2xl font-bold text-neon-cyan">{player.currentRank.toUpperCase()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">LEVEL</div>
              <div className="text-2xl font-bold text-accent">{player.level}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">XP PROGRESS</div>
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan to-accent transition-all"
                  style={{ width: `${levelProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded border border-neon-cyan/20">
            <div className="text-xs text-muted-foreground mb-2 uppercase">Missions Completed</div>
            <div className="text-3xl font-bold text-accent">{player.completedMissions}</div>
            <div className="text-xs text-muted-foreground mt-2">Success Rate: {player.successRate}%</div>
          </div>

          <div className="glassmorphism p-6 rounded border border-neon-cyan/20">
            <div className="text-xs text-muted-foreground mb-2 uppercase">Total XP</div>
            <div className="text-3xl font-bold text-neon-cyan">{player.xp.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-2">Failed: {player.failedMissions}</div>
          </div>

          <div className="glassmorphism p-6 rounded border border-neon-cyan/20">
            <div className="text-xs text-muted-foreground mb-2 uppercase">Trace Time</div>
            <div className="text-3xl font-bold text-yellow-500">{player.totalTraceMinutes}m</div>
            <div className="text-xs text-muted-foreground mt-2">Total exposure: {player.totalTraceMinutes} minutes</div>
          </div>
        </div>

        {/* Achievements/Badges */}
        {player.badges.length > 0 && (
          <div className="glassmorphism p-6 rounded border border-neon-cyan/20 mb-8">
            <h2 className="text-xl font-bold text-neon-cyan mb-4">BADGES</h2>
            <div className="flex flex-wrap gap-2">
              {player.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 bg-secondary rounded text-xs text-accent font-mono"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission History */}
        {missionHistory.length > 0 && (
          <div className="glassmorphism p-6 rounded border border-neon-cyan/20">
            <h2 className="text-xl font-bold text-neon-cyan mb-4">MISSION HISTORY</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {missionHistory.slice(-10).reverse().map((mission, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-secondary rounded text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${mission.success ? 'bg-accent' : 'bg-destructive'}`} />
                    <div>
                      <div className="font-bold text-foreground">Mission {mission.missionId}</div>
                      <div className="text-muted-foreground">
                        {mission.success ? 'SUCCESSFUL' : 'FAILED'} · +{mission.xpEarned} XP
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground">{(mission.timeSpent / 1000).toFixed(1)}s</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creator attribution */}
        <div className="mt-12 pt-8 border-t border-neon-cyan/20 text-xs text-muted-foreground text-center opacity-70">
          <p>Built by Toirova Charos</p>
          <p>
            <a 
              href="https://github.com/blodriena" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-neon-cyan transition-colors"
            >
              github.com/blodriena
            </a>
          </p>
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay fixed inset-0 pointer-events-none" />
    </div>
  )
}
