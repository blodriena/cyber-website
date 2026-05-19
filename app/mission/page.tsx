'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getStateManager } from '@/systems/state-manager'
import { getMissionEngine } from '@/systems/mission-engine'
import { Mission, MissionCategory } from '@/lib/types'

const difficultyColors: Record<string, string> = {
  easy: 'text-accent',
  medium: 'text-yellow-500',
  hard: 'text-orange-500',
  extreme: 'text-destructive',
}

const categoryIcons: Record<MissionCategory, string> = {
  reconnaissance: '🔍',
  infiltration: '🎯',
  extraction: '📦',
  defense: '🛡️',
  sabotage: '💣',
}

interface MissionCardProps {
  mission: Mission
  index: number
  isLocked: boolean
  onSelect: (mission: Mission) => void
}

function MissionCard({ mission, index, isLocked, onSelect }: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => !isLocked && onSelect(mission)}
      className={`group rounded-lg border border-foreground/10 hover:border-primary/50 p-6 cursor-pointer transition-all duration-300 ${
        isLocked ? 'opacity-50 cursor-not-allowed' : ''
      } bg-card/50 backdrop-blur hover:bg-card/80`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{categoryIcons[mission.category]}</div>
        <motion.div className={`text-xs font-black ${difficultyColors[mission.difficulty]}`}>
          {mission.difficulty.toUpperCase()}
        </motion.div>
      </div>

      <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors">
        {mission.title}
        {isLocked && ' 🔒'}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {mission.briefing}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span className="font-semibold">{mission.objectives.length} OBJECTIVES</span>
        <span className="flex gap-3 font-semibold">
          <span className="text-accent">+{mission.rewards.xp} XP</span>
          <span className="text-primary">+{mission.rewards.credits} ₧</span>
        </span>
      </div>

      {/* Threat indicator */}
      <div className="pt-4 border-t border-foreground/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground font-semibold">THREAT</span>
          <span className={difficultyColors[mission.difficulty] + ' font-black'}>{mission.threatLevel}%</span>
        </div>
        <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mission.threatLevel}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-accent via-primary to-destructive"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | 'all'>('all')
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [playerRank, setPlayerRank] = useState<string>('recruit')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stateManager = getStateManager()
    const missionEngine = getMissionEngine()

    // Initialize state
    const state = stateManager.getState()
    setPlayerRank(state.player.currentRank)
    setMissions(missionEngine.getAllMissions())

    // Subscribe to changes
    const unsubscribe = stateManager.subscribe((newState) => {
      setPlayerRank(newState.player.currentRank)
    })

    return unsubscribe
  }, [])

  if (!mounted) return null

  const filteredMissions = missions.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory,
  )

  const categories: Array<MissionCategory | 'all'> = [
    'all',
    'reconnaissance',
    'infiltration',
    'extraction',
    'defense',
    'sabotage',
  ]

  const handleSelectMission = (mission: Mission) => {
    setSelectedMission(mission)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-40 backdrop-blur border-b border-foreground/10 px-6 md:px-12 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-accent hover:text-primary transition-colors mb-6 inline-block font-semibold">
            ← RETURN TO BASE
          </Link>

          <h1 className="text-6xl md:text-7xl font-black mb-4">
            <span className="text-muted-foreground">MISSION</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              HUB
            </span>
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-4">
            OPERATIVE RANK: <span className="text-primary font-black">{playerRank.toUpperCase()}</span> | MISSIONS AVAILABLE: <span className="text-accent font-black">{filteredMissions.length}</span>
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Category filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 flex flex-wrap gap-3"
          >
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`px-5 py-2 rounded-lg font-black text-sm transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50'
                    : 'border-2 border-foreground/20 text-foreground hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat.toUpperCase()}
              </motion.button>
            ))}
          </motion.div>

          {/* Missions grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredMissions.map((mission, idx) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                index={idx}
                isLocked={mission.isLocked}
                onSelect={handleSelectMission}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission detail modal */}
      {selectedMission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedMission(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-foreground/10 max-w-2xl w-full p-8 md:p-12 rounded-lg"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-3">{selectedMission.title}</h2>
                <div className="flex gap-4 text-sm font-black">
                  <div className={difficultyColors[selectedMission.difficulty]}>
                    {selectedMission.difficulty.toUpperCase()}
                  </div>
                  <div className="text-muted-foreground">
                    {selectedMission.category.toUpperCase()}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMission(null)}
                className="text-muted-foreground hover:text-primary text-2xl"
              >
                ✕
              </motion.button>
            </div>

            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              {selectedMission.briefing}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary/50 border border-foreground/10 rounded-lg p-6 mb-8"
            >
              <h3 className="font-black mb-4 text-primary uppercase tracking-wide">OBJECTIVES</h3>
              <ul className="space-y-3">
                {selectedMission.objectives.map((obj, idx) => (
                  <motion.li
                    key={obj.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="text-sm flex items-start gap-3"
                  >
                    <span className="text-accent font-black mt-1">●</span>
                    <span>{obj.description}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-secondary/50 border border-foreground/10 rounded-lg p-4">
                <div className="text-xs text-muted-foreground font-black mb-2">EXPERIENCE</div>
                <div className="text-3xl font-black text-accent">+{selectedMission.rewards.xp}</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-secondary/50 border border-foreground/10 rounded-lg p-4">
                <div className="text-xs text-muted-foreground font-black mb-2">CREDITS</div>
                <div className="text-3xl font-black text-primary">+{selectedMission.rewards.credits}</div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(107, 114, 255, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                getStateManager().setCurrentMission(selectedMission)
                setSelectedMission(null)
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-lg transition-all text-lg"
            >
              START MISSION
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
