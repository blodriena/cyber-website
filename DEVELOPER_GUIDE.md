# PHANTOM PROTOCOL - Developer Guide

## System Architecture

Each system in `/systems/` is designed to be:
- **Pure Business Logic** - No React dependencies, can migrate to backend
- **Independently Testable** - Full unit test coverage possible
- **Singleton Pattern** - Single instance across application
- **Listener-Based** - Publish-subscribe for state changes

## Adding a New Command

```typescript
// In any component or system
import { getTerminalEngine } from '@/systems/terminal-system'

const terminal = getTerminalEngine()

terminal.registerCommand({
  name: 'mycommand',
  description: 'What this command does',
  usage: 'mycommand <arg1> [arg2]',
  category: 'mission', // or 'system', 'data', 'network', 'help'
  execute: async (args) => {
    // args is array of space-separated arguments
    // Can be sync or async
    if (args.length === 0) {
      return 'Usage: mycommand <arg1>'
    }
    
    // Simulate async operation
    await new Promise(r => setTimeout(r, 500))
    
    return `Command result: ${args.join(' ')}`
  }
})
```

## Adding a New Mission

```typescript
import { getMissionEngine } from '@/systems/mission-engine'

const missions = getMissionEngine()

const newMission = missions.createMission(
  'Mission Title',
  'Mission briefing text',
  'reconnaissance', // category
  'hard',            // difficulty
  65,                // threat level (0-100)
  [
    {
      id: 'obj_1',
      description: 'First objective',
      type: 'infiltrate',
      target: 'TARGET_001',
      isCompleted: false
    },
    // ... more objectives
  ],
  ['started_game'],  // story flag requirements
  'operative'        // required rank (optional)
)
```

## Story Branching

```typescript
import { getStoryEngine } from '@/systems/story-engine'

const story = getStoryEngine()

// Make a choice
const nextNode = story.makeChoice('choice_1a')

// Add flag (affects mission unlocks)
story.addFlag('completed_first_mission')

// Check flag
if (story.hasFlag('completed_first_mission')) {
  // Do something
}

// Get story progress
const progress = story.getProgressPercentage()
```

## Threat Escalation in Missions

```typescript
import { getThreatEngine } from '@/systems/threat-system'

const threat = getThreatEngine()

// Increase threat on player actions
threat.raiseThreat(10, 'Unauthorized access attempt detected')

// Decrease threat through careful play
threat.decreaseThreat(5, 'Successfully bypassed security')

// Natural escalation over time (call in game loop)
threat.naturalEscalation(1000) // 1000ms delta

// Check if mission is compromised
if (threat.isMissionCompromised()) {
  // Force mission failure
}

// Get current state
const threatLevel = threat.getThreatLevel()
```

## Modifying Player Stats

```typescript
import { getStateManager } from '@/systems/state-manager'

const state = getStateManager()

// Update player stats
state.updatePlayer({
  xp: 1500,
  completedMissions: 5,
  currentRank: 'operative'
})

// Subscribe to changes
const unsubscribe = state.subscribe((newState) => {
  console.log('Game state changed:', newState)
})

// Unsubscribe when component unmounts
return unsubscribe
```

## React Integration

### Using Game State in Components

```typescript
'use client'

import { useGameState, usePlayerStats, useThreatLevel } from '@/hooks/useGameState'

export function MyComponent() {
  const state = useGameState()
  const player = usePlayerStats()
  const threat = useThreatLevel()
  
  if (!state) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{player?.handle}</h1>
      <p>Threat: {threat?.current}%</p>
    </div>
  )
}
```

### Creating a New System

```typescript
// systems/my-system.ts

export class MySystem {
  private state: any = {}
  private listeners: ((state: any) => void)[] = []
  
  constructor() {
    // Initialize
  }
  
  public setState(updates: Partial<typeof this.state>) {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }
  
  public subscribe(listener: (state: any) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
  
  private notifyListeners() {
    this.listeners.forEach(l => l(this.state))
  }
}

let instance: MySystem | null = null

export const getMySystem = (): MySystem => {
  if (!instance) {
    instance = new MySystem()
  }
  return instance
}
```

## Performance Optimization

### Using GSAP Animations

```typescript
import gsap from 'gsap'

// Create timeline for complex animations
const timeline = gsap.timeline()

timeline
  .from(ref, { opacity: 0, duration: 0.5 })
  .to(ref, { y: 20, duration: 0.3 }, 0.2)
  .staggerFrom(
    childrenRefs,
    { opacity: 0, x: -20, duration: 0.4 },
    0.1
  )
```

### Lazy Loading Routes

```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic'

const Terminal = dynamic(() => import('@/components/terminal/Terminal'), {
  loading: () => <div>Loading terminal...</div>,
})
```

## Testing Guide

### Testing a System

```typescript
// __tests__/mission-engine.test.ts

import { getMissionEngine } from '@/systems/mission-engine'

describe('MissionEngine', () => {
  it('should create a mission', () => {
    const missions = getMissionEngine()
    const mission = missions.createMission(
      'Test',
      'Test briefing',
      'reconnaissance',
      'easy',
      20,
      []
    )
    
    expect(mission.title).toBe('Test')
    expect(mission.id).toBeDefined()
  })
})
```

## Debugging

### Console Logs

Use distinctive prefixes for debugging:

```typescript
console.log('[PHANTOM] Boot sequence started')
console.log('[THREAT] Escalation rate:', threat.escalation)
console.log('[MISSION] Objective completed:', objective.id)
```

### React DevTools

1. Install React Developer Tools browser extension
2. Inspect component hooks to see state changes
3. Use Profiler tab to identify performance bottlenecks

## Deployment

### Build for Production

```bash
pnpm build
```

### Environment Variables

No required environment variables for core functionality. Future phases will require:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `DATABASE_URL` - PostgreSQL connection string
- `WEBSOCKET_URL` - WebSocket server URL

### Vercel Deployment

```bash
# Deploy to Vercel
vercel deploy
```

---

For questions or contributions, reach out to Toirova Charos at [github.com/blodriena](https://github.com/blodriena)
