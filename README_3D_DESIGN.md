# PHANTOM PROTOCOL - 3D Immersive Hacker Simulation

> A premium, interactive cyberpunk hacker simulation with stunning 3D visuals, immediate visual impact, and theatrical design.

## Overview

PHANTOM PROTOCOL is a fully immersive hacker simulation experience built with cutting-edge web technologies. Every element is designed for maximum visual impact with bold typography, 3D rotating meshes, vibrant neon colors, and smooth interactive animations.

## Key Features

### 3D Visual Experience
- **Rotating 3D Mesh** - Animated geometric core with rotating tori rings in magenta and cyan
- **Wireframe Overlays** - Transparent wireframe rendering for technical depth
- **Multiple Light Sources** - Point lights from multiple angles for dramatic lighting
- **Continuous Animation** - Smooth orbital motion and pulsing effects

### Aesthetic Design
- **Premium Cyberpunk** - Bold magenta primary color with cyan accent
- **Ultra-Dark Theme** - Deep black backgrounds for maximum contrast
- **Large Bold Typography** - Oversized headlines (8xl-9xl) for immediate impact
- **Gradient Text** - Magenta-to-cyan gradients on key headings
- **Interactive Depth** - Hover effects, scale transforms, and glowing shadows

### Immersive Gameplay
- **18+ Unique Missions** - Reconnaissance, infiltration, extraction, defense, sabotage
- **Dynamic Threat System** - Real-time threat level indicators with color gradients
- **Mission Categories** - Filterable by type with instant visual feedback
- **Mission Details Modal** - Rich modal with objectives, rewards, and threat analysis
- **Player Progression** - 6 ranks from recruit to legend

## Technology Stack

### Frontend
- **Next.js 16** - App Router with modern React features
- **React 19** - Latest React with hooks and experimental features
- **Three.js** - 3D graphics rendering
- **@react-three/fiber** - React bindings for Three.js
- **Framer Motion** - Premium animation library
- **Tailwind CSS v4** - Utility-first styling with design tokens

### Architecture
- **Modular Systems** - Pure TypeScript game logic (backend-ready)
- **Component-Driven** - Reusable React components with Framer Motion
- **Type-Safe** - Full TypeScript coverage with interfaces

## File Structure

```
/app                          # Page routes
  /mission                    # Mission hub page
  /terminal                   # Terminal gameplay page
  /profile                    # Player profile page
  /about                      # About/credits page
  page.tsx                    # Landing page with 3D hero

/components
  /3d                         # 3D rendering components
    RotatingMesh.tsx          # Three.js rotating mesh & rings

/systems                      # Core game systems (pure TypeScript)
  state-manager.ts            # Global game state
  mission-engine.ts           # Mission logic & progression
  threat-system.ts            # Threat/pressure mechanics
  terminal-system.ts          # Terminal commands & gameplay
  story-engine.ts             # Narrative & branching
  profile-system.ts           # Player stats & progression
  audio-engine.ts             # Audio management

/lib
  types.ts                    # TypeScript interfaces & types
  constants.ts                # Game constants & data
  utils.ts                    # Utility functions

/hooks
  useGameState.ts             # Game state React hook

/styles
  globals.css                 # Global styles, animations, themes
```

## Color System

### Primary Colors
- **Primary (Magenta)**: `oklch(0.68 0.24 300)` - Main action color
- **Accent (Cyan)**: `oklch(0.68 0.25 264)` - Secondary highlights
- **Background (Black)**: `oklch(0.06 0 0)` - Ultra-dark base
- **Foreground (White)**: `oklch(0.95 0.001 0)` - Bright text

### Threat Levels
- **Low**: Green accent
- **Medium**: Yellow
- **High**: Orange
- **Critical**: Red destructive

## Design Principles

1. **Everything Visible** - No hidden content behind delays or modals (except mission details which explicitly opens)
2. **Immediate Impact** - Large typography, bold colors, dramatic lighting
3. **Interactive Depth** - Every element responds to hover/click with scale, glow, or color changes
4. **Premium Feel** - Smooth animations, refined spacing, professional typography
5. **Cyberpunk Theater** - Blend of sci-fi aesthetics with theatrical presentation

## Running the Project

### Development
```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to see the landing page with 3D hero animation.

### Build
```bash
pnpm build
pnpm start
```

## Deployment

Deploy to Vercel with a single command:

```bash
vercel deploy
```

The project is optimized for Vercel deployment with automatic environment configuration.

## Future Enhancements

- AI-powered mission hints and hints
- Multiplayer rival hacker interactions
- Backend persistence with Supabase
- Advanced 3D effects and environments
- Mobile-optimized version
- International localization

## Creator

Built by **Toirova Charos**

- GitHub: [@blodriena](https://github.com/blodriena)
- PHANTOM PROTOCOL v1.0

---

Experience the digital underworld. Master the systems. Become a legend.
