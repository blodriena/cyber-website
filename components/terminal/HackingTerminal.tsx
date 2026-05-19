'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MatrixRain from '@/components/matrix/MatrixRain'
import { getHackingEngine, HackingCommand } from '@/systems/hacking-engine'
import { getPoliceTracker, PoliceTrace } from '@/systems/police-tracker'

interface HUDAlert {
  id: string
  level: 'info' | 'warning' | 'critical'
  message: string
  timestamp: number
}

interface ThreatState {
  threatening: boolean
  stage: number // 0-4
}

export default function HackingTerminal() {
  const [commandHistory, setCommandHistory] = useState<HackingCommand[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [policeTrace, setPoliceTrace] = useState<PoliceTrace | null>(null)
  const [alerts, setAlerts] = useState<HUDAlert[]>([])
  const [threatState, setThreatState] = useState<ThreatState>({ threatening: false, stage: 0 })
  const [progress, setProgress] = useState(0)
  const [objectives, setObjectives] = useState<string[]>([
    'Scan network for vulnerabilities',
    'Crack administrator password',
    'Exfiltrate confidential data',
    'Wipe security logs',
  ])

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hackingEngine = getHackingEngine()
  const policeTracker = getPoliceTracker()

  useEffect(() => {
    // Initialize mission
    hackingEngine.setMissionObjectives(objectives)

    // Setup event listeners
    hackingEngine.on('command_complete', (cmd: HackingCommand) => {
      setCommandHistory((prev) => [...prev, cmd])
    })

    hackingEngine.on('objective_complete', (data) => {
      setProgress(data.progress)
      addAlert('success', `OBJECTIVE COMPLETE: ${data.objective}`)
    })

    hackingEngine.on('mission_complete', () => {
      addAlert('critical', 'MISSION OBJECTIVE: 100% - BEGIN ESCAPE PROTOCOL')
    })

    // Police tracker listeners
    policeTracker.on('update', (trace: PoliceTrace) => {
      setPoliceTrace(trace)
      updateThreatState(trace)
    })

    policeTracker.on('alert', (data) => {
      addAlert(data.level === 'warning' ? 'warning' : 'critical', data.message)
    })

    policeTracker.on('detected', () => {
      addAlert('critical', 'SYSTEM COMPROMISED - POLICE DETECTED')
      setThreatState({ threatening: true, stage: 4 })
    })

    // Start police tracking
    policeTracker.startTracking()

    return () => {
      hackingEngine.removeAllListeners()
      policeTracker.removeAllListeners()
      policeTracker.stopTracking()
    }
  }, [])

  const updateThreatState = (trace: PoliceTrace) => {
    let stage = 0
    if (trace.distance < 20) stage = 4
    else if (trace.distance < 40) stage = 3
    else if (trace.distance < 60) stage = 2
    else if (trace.distance < 80) stage = 1

    setThreatState({
      threatening: stage > 0,
      stage,
    })
  }

  const addAlert = (level: 'info' | 'warning' | 'critical', message: string) => {
    const alert: HUDAlert = {
      id: `alert-${Date.now()}`,
      level,
      message,
      timestamp: Date.now(),
    }
    setAlerts((prev) => [alert, ...prev].slice(0, 5))
  }

  const handleExecuteCommand = async () => {
    if (!currentInput.trim()) return

    const cmd = await hackingEngine.executeCommand(currentInput)
    setCommandHistory((prev) => [...prev, cmd])
    setCurrentInput('')

    // Scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 0)
  }

  const handleEvadePolice = (action: 'vpn' | 'proxy' | 'spoof') => {
    switch (action) {
      case 'vpn':
        policeTracker.activateVPN()
        addAlert('info', 'VPN activated - Distance increased')
        break
      case 'proxy':
        policeTracker.routeThroughProxy()
        addAlert('info', 'Proxy route activated - Trace weakened')
        break
      case 'spoof':
        policeTracker.spawnFakeSignal()
        addAlert('info', 'Fake signal spawned - Police redirected')
        break
    }
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* CRT scanline overlay */}
      <div className="scanline-effect fixed inset-0 z-10 pointer-events-none opacity-20" />

      {/* Main content */}
      <div className="relative z-20 w-full h-full flex flex-col">
        {/* Top HUD */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-primary/30 bg-background/80 backdrop-blur px-6 py-4 text-xs font-mono"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
            <div>
              <div className="text-muted-foreground">MISSION PROGRESS</div>
              <div className="text-primary font-bold text-lg">{progress.toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">TRACE STATUS</div>
              <div className={`font-bold text-lg ${policeTrace && policeTrace.distance < 40 ? 'text-destructive' : 'text-primary'}`}>
                {policeTrace ? `${policeTrace.distance.toFixed(0)}% DISTANCE` : 'INACTIVE'}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">THREAT LEVEL</div>
              <div className={`font-bold text-lg ${threatState.stage >= 3 ? 'pulse-red' : 'text-primary'}`}>
                {policeTrace ? `${policeTrace.threatLevel.toFixed(0)}%` : 'SAFE'}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">TIME REMAINING</div>
              <div className="text-accent font-bold text-lg">{policeTrace?.timeRemaining}s</div>
            </div>
          </div>
        </motion.div>

        {/* Police alert bar */}
        <AnimatePresence>
          {threatState.stage > 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className={`border-b px-6 py-2 text-xs font-mono font-bold police-alert ${
                threatState.stage >= 3 ? 'bg-destructive/20' : 'bg-yellow-900/20'
              }`}
            >
              <div className="max-w-7xl mx-auto">
                {threatState.stage === 1 && '⚠ POLICE SEARCHING - STAY MOBILE'}
                {threatState.stage === 2 && '⚠ POLICE TRIANGULATING YOUR POSITION'}
                {threatState.stage === 3 && '🚨 CRITICAL: POLICE CLOSING IN'}
                {threatState.stage === 4 && '🚨 SYSTEM COMPROMISED - POLICE DETECTED'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main terminal and HUD grid */}
        <div className="flex-1 overflow-hidden flex gap-4 p-6">
          {/* Main terminal */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Terminal window */}
            <div className="flex-1 flex flex-col bg-background/50 border border-primary/30 rounded-sm terminal-window overflow-hidden">
              {/* Terminal header */}
              <div className="px-4 py-2 border-b border-primary/20 flex items-center justify-between bg-background/80 text-xs font-mono">
                <span className="text-primary glow-text">PHANTOM_PROTOCOL.EXE</span>
                <span className="text-muted-foreground">[SYSTEM: ACTIVE] [ADMIN: TRUE] [DETECTION: CRITICAL]</span>
              </div>

              {/* Command history */}
              <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto px-4 py-3 text-xs font-mono space-y-1 text-primary"
              >
                {commandHistory.map((cmd, idx) => (
                  <motion.div
                    key={cmd.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="space-y-0.5"
                  >
                    <div className="text-accent">$ {cmd.command}</div>
                    {cmd.output.map((line, lineIdx) => (
                      <div
                        key={lineIdx}
                        className={`${
                          line.includes('[✓]') ? 'text-accent' : line.includes('Error') ? 'text-destructive' : 'text-primary'
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>

              {/* Terminal input */}
              <div className="px-4 py-2 border-t border-primary/20 bg-background/80 flex items-center gap-2">
                <span className="text-accent flex-shrink-0">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleExecuteCommand()}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent text-primary font-mono text-xs outline-none"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Right panel - Objectives & Controls */}
          <div className="w-80 flex flex-col gap-4 min-w-0">
            {/* Objectives */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-background/50 border border-primary/30 rounded-sm p-4 overflow-y-auto"
            >
              <div className="text-xs font-mono text-accent font-bold mb-3">MISSION OBJECTIVES</div>
              <div className="space-y-2">
                {objectives.map((obj, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-2 border rounded-sm transition-all ${
                      idx < commandHistory.length
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-primary/30 text-primary'
                    }`}
                  >
                    {idx < commandHistory.length ? '✓' : `${idx + 1}.`} {obj}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Evasion controls */}
            {threatState.threatening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background/50 border border-destructive/50 rounded-sm p-3 space-y-2"
              >
                <div className="text-xs font-mono text-destructive font-bold">EVASION PROTOCOL</div>
                <button
                  onClick={() => handleEvadePolice('vpn')}
                  className="w-full px-3 py-1.5 text-xs bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary rounded transition-all cursor-pointer"
                >
                  ACTIVATE VPN
                </button>
                <button
                  onClick={() => handleEvadePolice('proxy')}
                  className="w-full px-3 py-1.5 text-xs bg-accent/20 hover:bg-accent/40 border border-accent/50 text-accent rounded transition-all cursor-pointer"
                >
                  ROUTE PROXY
                </button>
                <button
                  onClick={() => handleEvadePolice('spoof')}
                  className="w-full px-3 py-1.5 text-xs bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-600/50 text-yellow-500 rounded transition-all cursor-pointer"
                >
                  SPAWN FAKE SIGNAL
                </button>
              </motion.div>
            )}

            {/* Alerts */}
            <div className="bg-background/50 border border-primary/30 rounded-sm p-4 max-h-32 overflow-y-auto">
              <div className="text-xs font-mono text-accent font-bold mb-2">ALERTS</div>
              <div className="space-y-1">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-xs font-mono p-1 rounded ${
                      alert.level === 'critical' ? 'text-destructive' : alert.level === 'warning' ? 'text-yellow-500' : 'text-primary'
                    }`}
                  >
                    [{alert.level.toUpperCase()}] {alert.message}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
