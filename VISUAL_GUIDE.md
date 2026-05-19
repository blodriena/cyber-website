# PHANTOM PROTOCOL - Visual Journey

## Navigation Map

```
┌─────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                 │
│            Boot Sequence with GSAP Animations       │
│         Creator: Toirova Charos (GitHub Link)       │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴──────────┐
        │                   │
        ▼                   ▼
   ┌─────────────┐  ┌──────────────┐
   │  MISSIONS   │  │   ABOUT      │
   │  (/mission) │  │  (/about)    │
   └──────┬──────┘  └──────────────┘
          │
          ▼
   ┌─────────────────────────────────┐
   │   SELECT MISSION                │
   │  - 18+ missions across 5 types  │
   │  - Filter by category           │
   │  - View threat levels           │
   │  - Check objectives             │
   └──────┬──────────────────────────┘
          │
          ▼ START MISSION
   ┌─────────────────────────────────────────┐
   │    TERMINAL PAGE (/terminal)            │
   │                                         │
   │ ┌─────────────────────────────────────┐ │
   │ │                                     │ │ 
   │ │   MAIN TERMINAL (Interactive)       │ │
   │ │  - Type 'help' for commands         │ │
   │ │  - Type 'mission' for details       │ │
   │ │  - Type 'hack' to infiltrate        │ │
   │ │  - Type 'extract' to steal data     │ │
   │ │                                     │ │
   │ └─────────────────────────────────────┘ │
   │                    │  SIDEBAR (right)    │
   │                    ├─ Threat Level (HUD) │
   │                    ├─ Mission Info       │
   │                    ├─ Time Tracker       │
   │                    └─ Command Help       │
   └──────┬─────────────────────────────────┘
          │
          │ Mission Success / Failure
          ▼
   ┌──────────────────┐
   │   PROFILE PAGE   │
   │  (/profile)      │
   │                  │
   │  - Player Stats  │
   │  - XP & Rank     │
   │  - Mission Log   │
   │  - Achievements  │
   └──────────────────┘
```

## System Interaction Diagram

```
┌──────────────────────────────────────────────────────┐
│              React Components Layer                  │
│    (Terminal, MissionCard, ProfileWidget, etc)       │
└────────────┬─────────────────────────────────────────┘
             │
      ┌──────┴──────────┐
      │                 │
      ▼                 ▼
┌──────────────┐   ┌──────────────┐
│ useGameState │   │ usePlayerStats
│ Hook         │   │ Hook
└──────┬───────┘   └──────┬───────┘
       │                  │
       └──────────┬───────┘
                  │
         ┌────────▼────────┐
         │   Game Systems  │
         │   (Pure Logic)  │
         └─────────────────┘
              │
    ┌─────────┼─────────┬─────────┬──────────────┐
    │         │         │         │              │
    ▼         ▼         ▼         ▼              ▼
┌─────┐ ┌──────┐ ┌────────┐ ┌───────┐ ┌──────────┐
│State│ │Thread│ │Terminal│ │ Story │ │ Mission  │
│Mgr  │ │System│ │System  │ │Engine │ │ Engine   │
└─────┘ └──────┘ └────────┘ └───────┘ └──────────┘
    │
    ▼
┌──────────────────┐
│ localStorage     │
│ PHANTOM_...STATE │
└──────────────────┘
```

## Game Flow: Mission Sequence

```
1. BOOT SEQUENCE
   [PHANTOM PROTOCOL v1.0 ...]
   > Initializing secure environment...
   > Loading neural network framework
   [ANIMATION: Glitch text → Fade in landing]

2. LANDING PAGE
   Hero heading: "PHANTOM PROTOCOL"
   Tagline: "Welcome, operative..."
   Buttons: [BEGIN OPERATION] [LEARN MORE]
   Creator badge: "Built by Toirova Charos"

3. MISSION HUB
   - View 18+ available missions
   - Filter by category (reconnaissance, infiltration, etc)
   - See threat level and rewards
   - Click to view mission details modal
   - Select "START MISSION"

4. TERMINAL GAMEPLAY
   Left: Main Terminal Interface
   Right Sidebar:
     ├─ THREAT INDICATOR (0-100%, color changing)
     ├─ MISSION INFO (Objectives, briefing)
     ├─ QUICK STATS
     └─ COMMANDS HELP

5. COMMAND EXECUTION
   User types: hack firewall_001
   Terminal executes with delay
   Shows success/failure result
   Updates threat level

6. CONSEQUENCES
   - High threat → Mission compromise
   - Low threat → Higher success rate
   - Story flags trigger new content
   - Mission result recorded

7. PROFILE UPDATE
   - XP awarded
   - Rank progression checked
   - Mission recorded in history
   - Stats updated on profile page
```

## Threat Level Escalation

```
THREAT LEVEL: 0% ──────────────────────────────────→ 100%

STATUS:  CLEAR │ CAUTION │ WARNING │ CRITICAL │ COMPROMISED
         0-25% │ 26-60%  │ 61-85%  │ 86-100%  │ 100%
COLOR:   GREEN │ YELLOW  │ ORANGE  │ RED      │ FLASHING
EFFECT:  None  │ Alert   │ Glitch  │ Severe   │ Mission Failed
              │ Sound   │ Screen  │ Glitch   │

Actions that raise threat:
  • Unauthorized access attempt → +10%
  • Failed infiltration → +15%
  • Detected by security → +25%

Actions that lower threat:
  • Successful bypass → -5%
  • Cover tracks → -8%
```

## Story Progression (3-Act Structure)

```
PROLOGUE: Introduction
├─ Meeting with Cipher
├─ Accept or decline operation
└─ Set story direction

ACT 1: The Beginning
├─ First mission assignment
├─ Introduction to rival Echo
├─ Establish stakes and relationships
└─ Unlock intermediate missions

ACT 2: Rising Tension
├─ Echo becomes rival/threat
├─ Consequences of past choices appear
├─ Story branches based on decisions
└─ Multiple path options

ACT 3: The Convergence
├─ Final mission: "The Citadel"
├─ All previous choices matter
├─ Multiple endings based on:
│   ├─ Success rate
│   ├─ Relationships (Echo, Cipher, etc)
│   ├─ Story flags collected
│   └─ Final mission outcome
└─ Credits with creator attribution
```

## Mission Categories & Icons

```
🔍 RECONNAISSANCE
   Gather intel, surveil networks
   Low to medium threat
   Medium to hard difficulty

🎯 INFILTRATION
   Break into secure systems
   Medium to high threat
   Hard difficulty

📦 EXTRACTION
   Steal data and escape
   High threat
   Hard to extreme difficulty

🛡️  DEFENSE
   Protect allied networks
   Medium threat
   Medium difficulty

💣 SABOTAGE
   Disable enemy infrastructure
   Very high threat
   Hard to extreme difficulty
```

## Player Progression Path

```
Level 1  [Recruit]      New player, tutorial missions
Level 5  [Operative]    Unlocked intermediate missions
Level 10 [Specialist]   Access harder missions
Level 15 [Veteran]      Expert-only missions available
Level 20 [Commander]    Lead complex operations
Level 25 [Legend]       Master all systems

XP Requirements (per level):
Level 1-5:   1,000 XP each
Level 6-10:  3,000 XP each
Level 11-15: 7,000 XP each
Level 16+:   15,000 XP each
```

---

**Design Philosophy**: Every interaction is deliberate. From boot sequence animations to threat indicators—every visual element reinforces the cinematic hacker experience.
