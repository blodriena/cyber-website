# PHANTOM PROTOCOL - Matrix Hacking Experience

## Overview
PHANTOM PROTOCOL is a **realistic, immersive Matrix-style hacker simulator** with actual coding processes, police tracking mechanics, and movie-level tension. It's designed to make players *feel like real hackers under pressure*.

## Core Experience

### 1. Visual Design
- **Matrix Rain Background**: Constantly falling Japanese characters and binary digits in authentic Matrix green
- **CRT Monitor Feel**: Scanline overlays, authentic font (JetBrains Mono), glitch effects
- **Color Palette**: Pure blacks (#030303), Matrix green (#25a15e), Cyan accents (#55efff), Alert reds
- **Terminal Aesthetic**: Authentic Linux terminal with $ prompts, realistic command output

### 2. Real Hacking Process

Each command executes with **realistic output simulation**:

#### Available Commands:
```
scan network        - Deep network analysis showing firewalls, intrusion detection
crack password      - Brute force authentication with progress, warnings, success
exfiltrate data     - Steal files: financial records, employee data, trade secrets
wipe logs           - Remove security/audit trails across all servers
plant backdoor      - Install rootkit with persistence mechanisms
transfer funds      - Execute billion-dollar financial theft
activate vpn        - Hide location from police trace
use proxy           - Route through anonymous networks
spawn fake signal    - Redirect police to false location
```

Each command returns:
- Real hacker jargon and technical output
- Progress indicators and completion times
- Realistic security warnings
- Success/failure statuses with detailed results

### 3. Police Tracking System

**Parallel threat that escalates during hacking:**

#### Trace Mechanics:
- **Distance**: 0-100% (100% = safe, 0% = caught)
- **Threat Level**: 0-100% based on distance
- **Status Progression**:
  - 0-25%: Police searching
  - 25-50%: Triangulating position
  - 50-75%: Closing in (CRITICAL alerts)
  - 75-100%: Detected (system compromised)

#### Real-Time Tracking:
- Police trace **automatically decreases** as you perform hacking tasks
- Countdown timer (180 seconds default)
- Visual warnings escalate as threat increases
- Screen effects intensify (red flashes, CRT flicker)

### 4. Evasion Mechanics

While hacking, you can interrupt to handle police threats:

- **Activate VPN**: +15% distance, -10% scan progress
- **Route Proxy**: +25% distance, -20% scan progress
- **Spawn Fake Signal**: +10% distance, -5% scan progress

**Gameplay Balance**: Evasion helps but costs mission progress - you must balance speed vs safety

### 5. Mission Objectives

Example mission with 4-step objective progression:
1. Scan network for vulnerabilities ✓
2. Crack administrator password ✓
3. Exfiltrate confidential data ✓
4. Wipe security logs ✓

**Progress System**: Mission progress bar fills as objectives complete (25%, 50%, 75%, 100%)

### 6. Movie-Like Tension Elements

#### HUD Display (Real-Time):
```
MISSION PROGRESS: 75%
TRACE STATUS: 82% DISTANCE
THREAT LEVEL: 6%
TIME REMAINING: 131s
```

#### Alert System:
- Real-time alerts on completion
- Police tracking notifications
- Critical threat warnings
- System compromise alerts

#### Audio Readiness (Framework):
- Dystopian ambient background
- Police siren sounds when threat escalates
- Typing/hacking sound effects
- Success/failure chimes

### 7. Terminal Commands - Real Output Examples

```bash
$ scan network --deep
Initiating deep network scan...
Found 247 active nodes
Analyzing firewall patterns...
├─ Primary firewall: AIX-7.2 (Enterprise Grade)
├─ Intrusion detection: ACTIVE
└─ Honeypot detected: YES
[✓] Scan complete - 2.3s
```

```bash
$ crack password --dict=/wordlists/enterprise.txt --threads=32
Loading 2.4M password dictionary...
Attempting login combinations...
Progress: [████░░░░░░] 45%
[WARNING] Rate limiting detected!
Progress: [██████░░░░] 62%
[✓] Access granted! Username: admin | Pass: ***
[✓] Credentials obtained - 12.8s
```

```bash
$ exfiltrate --target=/secure/vault --compress=true --encrypt=aes256
Connecting to secure vault...
Authentication: SUCCESSFUL
Listing files...
  financial_records_2024.db (2.3GB)
  employee_personal_data.csv (450MB)
  trade_secrets_archive.zip (8.7GB)
Compressing & encrypting payload...
[████████████████████] 100%
[✓] Data exfiltrated successfully - 18.5s
Total: 11.45 GB transferred
```

## Technical Architecture

### Systems:
1. **HackingEngine** (`/systems/hacking-engine.ts`)
   - Command parser and executor
   - Mission objective tracking
   - Real output generation

2. **PoliceTracker** (`/systems/police-tracker.ts`)
   - Location triangulation simulation
   - Threat level calculation
   - Evasion handling

3. **MatrixRain** (`/components/matrix/MatrixRain.tsx`)
   - Canvas-based digital rain animation
   - 60fps falling characters
   - Opacity trails for depth

4. **HackingTerminal** (`/components/terminal/HackingTerminal.tsx`)
   - Main UI component
   - HUD elements
   - Command input/output
   - Threat visualization

## Game Flow

1. **Player launches terminal** → Matrix rain activates, police tracking begins
2. **Player enters commands** → Real hacker output displayed, objectives tracked
3. **Police threat escalates** → HUD shows declining distance, alerts appear
4. **Player must evade** → Can interrupt hacking to handle police threat
5. **Resume mission** → Continue hacking with new police threat level
6. **Complete objectives** → Mission progress increases
7. **Escape or get caught** → Time runs out (escape) or distance reaches 0 (caught)

## Realism Features

✓ Authentic terminal commands and output
✓ Real hacker terminology and workflow
✓ Parallel threat system (not scripted)
✓ Player agency in evasion decisions
✓ Tension-building mechanics (time, threats, escaping)
✓ Movie-like cinematic progression
✓ No fantasy elements - all grounded in real hacking concepts
✓ Consequences for choices (speed vs. safety)

## Visual Progression

### Threat Level Visual Effects:
- **0-25% Threat**: Green UI, calm
- **25-50% Threat**: Yellow/Orange warnings
- **50-75% Threat**: Red flashes, CRT flicker increases
- **75-100% Threat**: Critical red alert, police siren overlay

## Future Enhancements

- Dynamic mission generation
- Backend integration for persistence
- Multiplayer competitive hacking
- Advanced encryption minigames
- Corporate/government missions
- Real-time leaderboards
- Mission difficulty scaling
- AI security responses

## Command Structure

The terminal accepts natural language hacking commands that feel like real exploitation:

- `scan network` - Information gathering
- `crack password` - Authentication breach
- `exfiltrate data` - Data theft
- `wipe logs` - Cover your tracks
- `plant backdoor` - Persistent access
- `transfer funds` - Financial crime
- `activate vpn` - Evasion tactic
- `use proxy` - Anonymization
- `spawn fake signal` - Misdirection

Each command is context-aware and provides realistic feedback on success/failure.

## Immersion Checklist

- [x] Authentic Matrix aesthetic (green-on-black, rain effect)
- [x] Real hacking commands with realistic output
- [x] Parallel police threat system
- [x] Time pressure mechanics
- [x] Evasion mechanics that matter
- [x] Real consequences for actions
- [x] CRT monitor visual effects
- [x] Cinematic tension building
- [x] Mission-based progression
- [x] Actor-level details (firewall names, actual file sizes)

## Tips for Maximum Immersion

1. **Use full-screen mode** - Maximize the terminal feel
2. **Adjust brightness** - Make the green really pop against the black
3. **Use headphones** - Sound design (when implemented) adds major immersion
4. **Type commands manually** - Don't just copy/paste
5. **Watch the threat level** - Make evasion decisions strategically
6. **Try different command sequences** - Some paths are harder than others
