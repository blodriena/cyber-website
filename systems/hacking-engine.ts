import { EventEmitter } from 'events'

export interface HackingCommand {
  id: string
  command: string
  output: string[]
  status: 'pending' | 'executing' | 'success' | 'failed'
  timestamp: number
  executionTime: number
}

export interface HackingSequence {
  objectives: string[]
  currentObjective: number
  completedObjectives: string[]
  totalProgress: number
}

class HackingEngine extends EventEmitter {
  private sequence: HackingSequence = {
    objectives: [],
    currentObjective: 0,
    completedObjectives: [],
    totalProgress: 0,
  }

  private commandHistory: HackingCommand[] = []
  private isExecuting = false

  constructor() {
    super()
  }

  setMissionObjectives(objectives: string[]): void {
    this.sequence.objectives = objectives
    this.sequence.currentObjective = 0
    this.sequence.completedObjectives = []
    this.sequence.totalProgress = 0
  }

  async executeCommand(command: string): Promise<HackingCommand> {
    const id = `cmd-${Date.now()}`
    const cmd: HackingCommand = {
      id,
      command,
      output: [],
      status: 'executing',
      timestamp: Date.now(),
      executionTime: 0,
    }

    this.commandHistory.push(cmd)
    this.emit('command', cmd)

    // Simulate command execution with realistic output
    const startTime = Date.now()
    const output = await this.simulateCommandExecution(command)
    const executionTime = Date.now() - startTime

    cmd.output = output
    cmd.executionTime = executionTime
    cmd.status = output.some(line => line.includes('Error') || line.includes('failed')) ? 'failed' : 'success'

    this.emit('command_complete', cmd)

    // Check if command completes an objective
    this.checkObjectiveCompletion(command)

    return cmd
  }

  private async simulateCommandExecution(command: string): Promise<string[]> {
    const output: string[] = []

    // Normalize command
    const cmd = command.toLowerCase().trim()

    if (cmd.includes('scan network')) {
      output.push('$ scan_network --deep')
      output.push('Initiating deep network scan...')
      output.push('...')
      output.push('Found 247 active nodes')
      output.push('Analyzing firewall patterns...')
      output.push('└─ Primary firewall: AIX-7.2 (Enterprise Grade)')
      output.push('└─ Intrusion detection: ACTIVE')
      output.push('└─ Honeypot detected: YES')
      output.push('[✓] Scan complete - 2.3s')
    } else if (cmd.includes('crack password') || cmd.includes('brute force')) {
      output.push('$ crack_password --dict=/wordlists/enterprise.txt --threads=32')
      output.push('Loading 2.4M password dictionary...')
      output.push('Attempting login combinations...')
      output.push('Progress: [████░░░░░░] 45%')
      output.push('[WARNING] Rate limiting detected!')
      output.push('└─ Adjusting thread speed...')
      output.push('Progress: [██████░░░░] 62%')
      output.push('[✓] Access granted! Username: admin | Pass: ***')
      output.push('[✓] Credentials obtained - 12.8s')
    } else if (cmd.includes('exfiltrate data') || cmd.includes('extract files')) {
      output.push('$ exfiltrate --target=/secure/vault --compress=true --encrypt=aes256')
      output.push('Connecting to secure vault...')
      output.push('Authentication: SUCCESSFUL')
      output.push('Listing files...')
      output.push('  financial_records_2024.db (2.3GB)')
      output.push('  employee_personal_data.csv (450MB)')
      output.push('  trade_secrets_archive.zip (8.7GB)')
      output.push('Compressing & encrypting payload...')
      output.push('[████████████████████] 100%')
      output.push('[✓] Data exfiltrated successfully - 18.5s')
      output.push('Total: 11.45 GB transferred')
    } else if (cmd.includes('wipe logs')) {
      output.push('$ wipe_security_logs --target=all_servers --permanent=true')
      output.push('Connecting to log servers...')
      output.push('Identified 52 log files')
      output.push('Purging audit trails...')
      output.push('├─ Security logs: WIPED')
      output.push('├─ Access logs: WIPED')
      output.push('├─ Network logs: WIPED')
      output.push('└─ Firewall logs: WIPED')
      output.push('[✓] All traces removed - 4.2s')
    } else if (cmd.includes('plant backdoor') || cmd.includes('install rootkit')) {
      output.push('$ install_rootkit --silent --persist=true --name=system_service')
      output.push('Analyzing system architecture...')
      output.push('Creating kernel-level persistence mechanism...')
      output.push('Modifying boot sequences...')
      output.push('Injecting into system services...')
      output.push('[✓] Rootkit installed - 7.8s')
      output.push('├─ Auto-restart on reboot: ENABLED')
      output.push('├─ Detection rate: <0.1%')
      output.push('└─ Undetectable to standard AV: CONFIRMED')
    } else if (cmd.includes('transfer funds') || cmd.includes('wire money')) {
      output.push('$ transfer_funds --amount=1000000000 --recipient=swiss_account --speed=max')
      output.push('Accessing financial systems...')
      output.push('Authentication: ADMIN')
      output.push('Initiating wire transfer: $1,000,000,000')
      output.push('Processing international routing...')
      output.push('[████████████████████] 100% - CONFIRMED')
      output.push('[✓] Transfer complete - 3.1s')
      output.push('└─ Destination: UBS Zurich Account #X7K9L2P')
    } else if (cmd.includes('help') || cmd.includes('?')) {
      output.push('PHANTOM PROTOCOL - Hacking Console')
      output.push('')
      output.push('Available commands:')
      output.push('  scan network        - Identify target systems')
      output.push('  crack password      - Brute force authentication')
      output.push('  exfiltrate data     - Steal confidential files')
      output.push('  wipe logs           - Remove audit trails')
      output.push('  plant backdoor      - Install persistent access')
      output.push('  transfer funds      - Execute financial theft')
      output.push('  activate vpn        - Hide your location')
      output.push('  use proxy           - Route through anonymous network')
      output.push('')
    } else {
      output.push(`$ ${command}`)
      output.push('Command not recognized. Type "help" for available commands.')
      return output
    }

    return output
  }

  private checkObjectiveCompletion(command: string): void {
    const lowerCmd = command.toLowerCase()
    if (this.sequence.currentObjective < this.sequence.objectives.length) {
      const currentObj = this.sequence.objectives[this.sequence.currentObjective]

      if (
        (currentObj.includes('scan') && lowerCmd.includes('scan')) ||
        (currentObj.includes('crack') && lowerCmd.includes('crack')) ||
        (currentObj.includes('steal') && lowerCmd.includes('exfiltrate')) ||
        (currentObj.includes('wipe') && lowerCmd.includes('wipe'))
      ) {
        this.completeObjective()
      }
    }
  }

  completeObjective(): void {
    if (this.sequence.currentObjective < this.sequence.objectives.length) {
      const obj = this.sequence.objectives[this.sequence.currentObjective]
      this.sequence.completedObjectives.push(obj)
      this.sequence.totalProgress = (this.sequence.completedObjectives.length / this.sequence.objectives.length) * 100

      this.emit('objective_complete', {
        objective: obj,
        progress: this.sequence.totalProgress,
      })

      this.sequence.currentObjective++

      if (this.sequence.totalProgress === 100) {
        this.emit('mission_complete')
      }
    }
  }

  getCommandHistory(): HackingCommand[] {
    return [...this.commandHistory]
  }

  getSequence(): HackingSequence {
    return { ...this.sequence }
  }

  reset(): void {
    this.commandHistory = []
    this.sequence = {
      objectives: [],
      currentObjective: 0,
      completedObjectives: [],
      totalProgress: 0,
    }
  }
}

let instance: HackingEngine | null = null

export function getHackingEngine(): HackingEngine {
  if (!instance) {
    instance = new HackingEngine()
  }
  return instance
}
