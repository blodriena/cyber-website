import { useState, useEffect } from 'react'
import { GameState } from '@/lib/types'
import { getStateManager } from '@/systems/state-manager'

/**
 * Custom hook to access game state and subscribe to changes
 * Bridges React components with pure game systems
 */
export function useGameState() {
  const [state, setState] = useState<GameState | null>(null)

  useEffect(() => {
    const stateManager = getStateManager()

    // Set initial state
    setState(stateManager.getState())

    // Subscribe to updates
    const unsubscribe = stateManager.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [])

  return state
}

/**
 * Hook to access specific player stats
 */
export function usePlayerStats() {
  const state = useGameState()
  return state?.player || null
}

/**
 * Hook to access current threat level
 */
export function useThreatLevel() {
  const state = useGameState()
  return state?.threat || null
}

/**
 * Hook to access missions
 */
export function useMissions() {
  const state = useGameState()
  return state?.missions || []
}
