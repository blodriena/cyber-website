import { TerminalCommand, TerminalHistory, TerminalState } from '@/lib/types';

/**
 * Terminal System - Command parser and execution engine
 * Pure business logic, no React dependencies
 * Will be migrated to backend in Phase 2
 */

export class TerminalEngine {
  private commandRegistry: Map<string, TerminalCommand> = new Map();
  private history: TerminalHistory[] = [];
  private currentDirectory: string = '/home/user';
  private isProcessing: boolean = false;
  private executionListeners: ((line: TerminalHistory) => void)[] = [];

  constructor() {
    this.registerDefaultCommands();
  }

  /**
   * Register a command
   */
  public registerCommand(command: TerminalCommand): void {
    this.commandRegistry.set(command.name, command);
  }

  /**
   * Get a command
   */
  public getCommand(name: string): TerminalCommand | undefined {
    return this.commandRegistry.get(name.toLowerCase());
  }

  /**
   * Get all commands
   */
  public getAllCommands(): TerminalCommand[] {
    return Array.from(this.commandRegistry.values());
  }

  /**
   * Get commands by category
   */
  public getCommandsByCategory(category: string): TerminalCommand[] {
    return Array.from(this.commandRegistry.values()).filter((c) => c.category === category);
  }

  /**
   * Execute a command string
   */
  public async executeCommand(input: string): Promise<string> {
    this.isProcessing = true;

    const trimmed = input.trim();
    if (!trimmed) {
      this.isProcessing = false;
      return '';
    }

    const [commandName, ...args] = trimmed.split(' ');
    const command = this.getCommand(commandName);

    let output: string;
    let status: 'success' | 'error' | 'pending' = 'success';

    if (!command) {
      output = `command not found: ${commandName}`;
      status = 'error';
    } else {
      try {
        output = await Promise.resolve(command.execute(args));
      } catch (error) {
        output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        status = 'error';
      }
    }

    // Add to history
    const historyEntry: TerminalHistory = {
      timestamp: Date.now(),
      command: trimmed,
      output,
      status,
    };

    this.history.push(historyEntry);

    // Limit history to last 100 commands
    if (this.history.length > 100) {
      this.history.shift();
    }

    this.isProcessing = false;

    // Notify listeners
    this.executionListeners.forEach((listener) => listener(historyEntry));

    return output;
  }

  /**
   * Get terminal history
   */
  public getHistory(): TerminalHistory[] {
    return [...this.history];
  }

  /**
   * Get last N history entries
   */
  public getRecentHistory(count: number = 10): TerminalHistory[] {
    return this.history.slice(-count);
  }

  /**
   * Clear history
   */
  public clearHistory(): void {
    this.history = [];
  }

  /**
   * Subscribe to command execution
   */
  public onCommandExecute(listener: (line: TerminalHistory) => void): () => void {
    this.executionListeners.push(listener);
    return () => {
      this.executionListeners = this.executionListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current directory
   */
  public getCurrentDirectory(): string {
    return this.currentDirectory;
  }

  /**
   * Change directory
   */
  public changeDirectory(path: string): void {
    // Simple path handling
    if (path === '/') {
      this.currentDirectory = '/';
    } else if (path === '~') {
      this.currentDirectory = '/home/user';
    } else if (path === '..') {
      const parts = this.currentDirectory.split('/').filter((p) => p);
      parts.pop();
      this.currentDirectory = '/' + parts.join('/');
    } else if (path.startsWith('/')) {
      this.currentDirectory = path;
    } else {
      this.currentDirectory = `${this.currentDirectory}/${path}`;
    }
  }

  /**
   * Check if engine is processing
   */
  public getProcessingStatus(): boolean {
    return this.isProcessing;
  }

  /**
   * Register default terminal commands
   */
  private registerDefaultCommands(): void {
    // HELP command
    this.registerCommand({
      name: 'help',
      description: 'Display available commands',
      usage: 'help [command]',
      category: 'help',
      execute: (args) => {
        if (args.length === 0) {
          const categories = ['system', 'data', 'network', 'mission', 'help'];
          let help = 'Available command categories:\n';
          categories.forEach((cat) => {
            const cmds = this.getCommandsByCategory(cat);
            help += `\n  ${cat.toUpperCase()}:\n`;
            cmds.forEach((cmd) => {
              help += `    ${cmd.name.padEnd(12)} - ${cmd.description}\n`;
            });
          });
          return help;
        } else {
          const cmd = this.getCommand(args[0]);
          if (!cmd) return `No manual entry for ${args[0]}`;
          return `${cmd.name}\n  ${cmd.description}\n  Usage: ${cmd.usage}`;
        }
      },
    });

    // CLEAR command
    this.registerCommand({
      name: 'clear',
      description: 'Clear terminal screen',
      usage: 'clear',
      category: 'system',
      execute: () => {
        this.clearHistory();
        return '';
      },
    });

    // ECHO command
    this.registerCommand({
      name: 'echo',
      description: 'Echo text to terminal',
      usage: 'echo [text]',
      category: 'system',
      execute: (args) => {
        return args.join(' ');
      },
    });

    // STATUS command
    this.registerCommand({
      name: 'status',
      description: 'Display system status',
      usage: 'status',
      category: 'system',
      execute: () => {
        return `PHANTOM PROTOCOL v1.0
> Terminal Session Active
> Commands Executed: ${this.history.length}
> Current Directory: ${this.currentDirectory}
> Status: ONLINE`;
      },
    });

    // VERSION command
    this.registerCommand({
      name: 'version',
      description: 'Display system version',
      usage: 'version',
      category: 'system',
      execute: () => {
        return 'PHANTOM PROTOCOL v1.0\nBuild: 2025.Q2\nStatus: OPERATIONAL';
      },
    });
  }
}

// Singleton instance
let terminalEngine: TerminalEngine | null = null;

export const getTerminalEngine = (): TerminalEngine => {
  if (!terminalEngine) {
    terminalEngine = new TerminalEngine();
  }
  return terminalEngine;
};
