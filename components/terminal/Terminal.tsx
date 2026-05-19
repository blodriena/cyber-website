'use client'

import React, { useEffect, useRef, useState } from 'react'
import { getTerminalEngine } from '@/systems/terminal-system'
import { getStateManager } from '@/systems/state-manager'
import { getMissionEngine } from '@/systems/mission-engine'
import { TerminalHistory } from '@/lib/types'
import gsap from 'gsap'

interface TerminalProps {
  autoFocus?: boolean
}

export function Terminal({ autoFocus = true }: TerminalProps) {
  const [history, setHistory] = useState<TerminalHistory[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const terminalEngine = getTerminalEngine()
  const stateManager = getStateManager()

  // Initialize terminal and register mission commands
  useEffect(() => {
    const initializeTerminal = async () => {
      // Register mission commands
      const missionEngine = getMissionEngine()
      const state = stateManager.getState()
      const currentMission = state.currentMission

      if (currentMission) {
        // Add mission-specific commands
        terminalEngine.registerCommand({
          name: 'mission',
          description: 'Display current mission information',
          usage: 'mission [status|objectives|abort]',
          category: 'mission',
          execute: (args) => {
            if (args[0] === 'status') {
              return `Mission: ${currentMission.title}
Briefing: ${currentMission.briefing}
Threat Level: ${currentMission.threatLevel}%
Status: ACTIVE`
            } else if (args[0] === 'objectives') {
              const objs = currentMission.objectives
                .map((obj, idx) => `[${obj.isCompleted ? 'X' : ' '}] ${idx + 1}. ${obj.description}`)
                .join('\n')
              return `OBJECTIVES:\n${objs}`
            } else if (args[0] === 'abort') {
              return 'Mission abort not authorized without command clearance'
            } else {
              return `mission status\nmission objectives\nmission abort`
            }
          },
        })

        // Add hack command
        terminalEngine.registerCommand({
          name: 'hack',
          description: 'Attempt to infiltrate target systems',
          usage: 'hack <target>',
          category: 'mission',
          execute: async (args) => {
            if (args.length === 0) {
              return 'Usage: hack <target>\nExample: hack firewall_001'
            }

            const target = args[0]
            // Simulate hacking attempt
            await new Promise((r) => setTimeout(r, 1500))

            // Random success based on difficulty
            const success = Math.random() > 0.3
            if (success) {
              return `[SUCCESS] Target ${target} compromised
Access level: ROOT
Connection established: ${new Date().toISOString()}`
            } else {
              return `[ALERT] Target ${target} security protocol triggered
Intrusion detected
Disconnecting...`
            }
          },
        })

        // Add extract command
        terminalEngine.registerCommand({
          name: 'extract',
          description: 'Extract data from compromised system',
          usage: 'extract <file_path>',
          category: 'mission',
          execute: async (args) => {
            if (args.length === 0) {
              return 'Usage: extract <file_path>'
            }

            // Simulate extraction
            await new Promise((r) => setTimeout(r, 1000))
            return `[EXTRACTING] ${args.join(' ')}
Size: ${Math.floor(Math.random() * 500) + 100}MB
Status: ████████████░░░░░░░░ 65%
Estimated time: ${Math.floor(Math.random() * 30) + 10}s`
          },
        })
      }

      // Initial boot message
      const bootMessage: TerminalHistory = {
        timestamp: Date.now(),
        command: '',
        output: `PHANTOM PROTOCOL TERMINAL v1.0
Connected: ${new Date().toLocaleString()}
Type 'help' for available commands
Type 'mission' for mission details`,
        status: 'success',
      }

      setHistory([bootMessage])
    }

    initializeTerminal()
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Focus input on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Subscribe to terminal execution
  useEffect(() => {
    const unsubscribe = terminalEngine.onCommandExecute((line) => {
      setHistory((prev) => [...prev, line])
    })

    return unsubscribe
  }, [terminalEngine])

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentInput.trim() || isProcessing) return

    setIsProcessing(true)

    // Add command to history
    const commandEntry: TerminalHistory = {
      timestamp: Date.now(),
      command: currentInput,
      output: '',
      status: 'pending',
    }

    setHistory((prev) => [...prev, commandEntry])
    setCurrentInput('')

    // Execute command
    const output = await terminalEngine.executeCommand(currentInput)

    setIsProcessing(false)
  }

  return (
    <div
      ref={terminalRef}
      className="w-full h-full flex flex-col glassmorphism rounded border border-neon-cyan/20"
    >
      {/* Terminal header */}
      <div className="border-b border-neon-cyan/20 px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-mono text-neon-cyan">
          [TERMINAL] {terminalEngine.getCurrentDirectory()}
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <div className="text-xs text-muted-foreground">ONLINE</div>
        </div>
      </div>

      {/* Terminal output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 scrollbar-thin scrollbar-track-background scrollbar-thumb-neon-cyan/20 hover:scrollbar-thumb-neon-cyan/40"
      >
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            {entry.command && (
              <div className="text-neon-cyan">
                <span className="text-muted-foreground">{'>'} </span>
                {entry.command}
              </div>
            )}
            <div className={`whitespace-pre-wrap text-xs ${
              entry.status === 'error' ? 'text-destructive' : 
              entry.status === 'pending' ? 'text-yellow-500' : 
              'text-muted-foreground'
            }`}>
              {entry.output}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="text-accent animate-pulse">
            [PROCESSING...]
          </div>
        )}
      </div>

      {/* Terminal input */}
      <div className="border-t border-neon-cyan/20 px-4 py-3">
        <form onSubmit={handleExecute} className="flex items-center gap-2">
          <span className="text-neon-cyan">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground font-mono text-sm"
            placeholder="Enter command..."
            autoComplete="off"
          />
        </form>
      </div>

      {/* Scanline overlay */}
      <div className="scanline-overlay absolute inset-0 pointer-events-none rounded" />
    </div>
  )
}
