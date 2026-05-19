# PHANTOM PROTOCOL

An immersive, cinematic hacker simulation experience built with Next.js 16, React 19, and a modular game engine architecture.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Visit `http://localhost:3000` to begin.

## Architecture

### Modular Game Systems (`/systems`)

Each system is independent, testable, and designed for backend migration:

- **`state-manager.ts`** - Centralized game state with localStorage persistence
- **`terminal-system.ts`** - Command parser and execution engine (core gameplay)
- **`mission-engine.ts`** - Mission definitions, progression, objectives
- **`threat-system.ts`** - Trace level tracking and pressure mechanics
- **`story-engine.ts`** - Branching narrative with consequence tracking
- **`profile-system.ts`** - Player stats, ranks, achievements
- **`audio-engine.ts`** - Audio management and mix control

### Components (`/components`)

Presentation layer consuming game systems:

- **`terminal/Terminal.tsx`** - Interactive terminal interface for gameplay
- Future: Mission cards, HUD elements, character dialogue, story sequences

### Routes (`/app`)

- **`/`** - Boot sequence landing page with GSAP animations
- **`/mission`** - Mission hub with 18+ branching missions
- **`/terminal`** - Main gameplay terminal interface
- **`/profile`** - Player stats, achievements, mission history
- **`/about`** - Game information and creator credits

### Custom Hooks (`/hooks`)

- **`useGameState.ts`** - Bridge between React components and game systems

## Game Features

### Missions
- 18+ fictional missions across 5 categories (reconnaissance, infiltration, extraction, defense, sabotage)
- Difficulty scaling (easy → extreme)
- Branching objectives and rewards
- Category-based filtering and sorting

### Terminal System
- Command-based gameplay with realistic hacking mechanics
- Extensible command registry for mission-specific commands
- History tracking and command execution
- Simulated delays and success/failure outcomes

### Threat/Pressure System
- Dynamic threat level (0-100%) that escalates during missions
- Four alert statuses (clear → critical)
- Natural escalation over time
- Mission compromise mechanics at high threat levels

### Story Engine
- 3-act narrative with branching nodes
- Four main characters (Cipher, Echo, Director Voss, Nova)
- Story flags for conditional progression
- Choice tracking and consequence system
- Multiple possible endings

### Player Progression
- Rank system: recruit → operative → specialist → veteran → commander → legend
- XP-based leveling
- Achievement tracking
- Mission history with success/failure rates

## Design System

### Colors (PHANTOM PROTOCOL Theme)
- **Primary**: Neon cyan (`--neon-cyan`) for UI accents
- **Accent**: Hacker green (`--hacker-green`) for positives
- **Background**: Deep space black (`--background`)
- **Threat Indicators**: Green (low) → yellow (medium) → orange (high) → red (critical)

### Custom CSS Effects
- **Glitch animation** - Terminal text corruption
- **Scanlines** - CRT monitor effect overlay
- **Pulse glow** - Cyan pulse animation for emphasis
- **Glassmorphism** - Frosted glass UI panels
- **Flicker** - Text fade animation

## Data Persistence

Game state is saved to localStorage at `PHANTOM_PROTOCOL_STATE`:
- Player stats and progression
- Mission history
- Story progress and flags
- Terminal history
- Current threat level

State is automatically synced to localStorage on changes.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, custom CSS animations
- **Animations**: GSAP (GreenSock)
- **3D**: Three.js, @react-three/fiber (for future expansion)
- **Terminal Emulation**: xterm.js (for future expansion)
- **Package Manager**: pnpm

## Future Enhancements

### Phase 2: Backend Integration
- Move game logic to Node.js backend
- PostgreSQL for persistent storage
- WebSocket for real-time updates

### Phase 3: AI Systems
- Intelligent mentor AI using AI SDK
- Adaptive mission hints
- Dynamic story generation

### Phase 4: Multiplayer & Social
- User accounts with Supabase Auth
- Leaderboards and rankings
- Rival hacker interactions

### Phase 5: Advanced Graphics
- Enhanced Three.js effects
- WebGL shaders
- Particle systems
- 3D environment exploration

## Creator

Built by **Toirova Charos**  
GitHub: [blodriena](https://github.com/blodriena)

## License

This project is open source and available under the MIT License.

---

**Status**: Early Access v1.0  
**Target Audience**: Desktop (1280px+)  
**Gameplay Time**: 10-30 minutes per mission
