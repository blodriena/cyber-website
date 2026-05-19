import { StoryNode, StoryChoice, StoryState, Character, StoryAct } from '@/lib/types';

/**
 * Story Engine - Manages branching narrative and story progression
 * Pure business logic, no React dependencies
 */

export class StoryEngine {
  private storyNodes: Map<string, StoryNode> = new Map();
  private characters: Map<string, Character> = new Map();
  private currentState: StoryState;
  private storyListeners: ((state: StoryState) => void)[] = [];

  constructor() {
    this.currentState = {
      currentAct: 'prologue',
      currentNode: 'opening_1',
      visitedNodes: ['opening_1'],
      storyFlags: new Set(),
      endings: [],
    };

    this.initializeCharacters();
    this.initializeStory();
  }

  /**
   * Get current story state
   */
  public getState(): StoryState {
    return { ...this.currentState };
  }

  /**
   * Get current node
   */
  public getCurrentNode(): StoryNode | undefined {
    return this.storyNodes.get(this.currentState.currentNode);
  }

  /**
   * Move to next story node
   */
  public moveToNode(nodeId: string): StoryNode | undefined {
    const node = this.storyNodes.get(nodeId);
    if (!node) return undefined;

    this.currentState.currentNode = nodeId;
    this.currentState.visitedNodes.push(nodeId);
    this.currentState.currentAct = node.act;

    // Add node's flags to story state
    node.flags.forEach((flag) => this.currentState.storyFlags.add(flag));

    this.notifyListeners();
    return node;
  }

  /**
   * Make a choice at current node
   */
  public makeChoice(choiceId: string): StoryNode | undefined {
    const currentNode = this.getCurrentNode();
    if (!currentNode || !currentNode.choices) return undefined;

    const choice = currentNode.choices.find((c) => c.id === choiceId);
    if (!choice) return undefined;

    // Trigger choice flags if any
    if (choice.triggerFlags) {
      choice.triggerFlags.forEach((flag) => this.currentState.storyFlags.add(flag));
    }

    // Move to next node
    return this.moveToNode(choice.nextNodeId);
  }

  /**
   * Add a story flag
   */
  public addFlag(flag: string): void {
    this.currentState.storyFlags.add(flag);
    this.notifyListeners();
  }

  /**
   * Check if flag is set
   */
  public hasFlag(flag: string): boolean {
    return this.currentState.storyFlags.has(flag);
  }

  /**
   * Add ending
   */
  public addEnding(ending: string): void {
    if (!this.currentState.endings.includes(ending)) {
      this.currentState.endings.push(ending);
    }
    this.notifyListeners();
  }

  /**
   * Get all endings
   */
  public getEndings(): string[] {
    return [...this.currentState.endings];
  }

  /**
   * Get character
   */
  public getCharacter(id: string): Character | undefined {
    return this.characters.get(id);
  }

  /**
   * Get all characters
   */
  public getAllCharacters(): Character[] {
    return Array.from(this.characters.values());
  }

  /**
   * Subscribe to story changes
   */
  public onStateChange(listener: (state: StoryState) => void): () => void {
    this.storyListeners.push(listener);
    return () => {
      this.storyListeners = this.storyListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get story progress percentage
   */
  public getProgressPercentage(): number {
    const totalNodes = this.storyNodes.size;
    const visitedNodes = this.currentState.visitedNodes.length;
    return Math.round((visitedNodes / totalNodes) * 100);
  }

  /**
   * Reset story
   */
  public reset(): void {
    this.currentState = {
      currentAct: 'prologue',
      currentNode: 'opening_1',
      visitedNodes: ['opening_1'],
      storyFlags: new Set(),
      endings: [],
    };
    this.notifyListeners();
  }

  /**
   * Notify listeners of state changes
   */
  private notifyListeners(): void {
    this.storyListeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Initialize characters
   */
  private initializeCharacters(): void {
    const characters: Character[] = [
      {
        id: 'phantom_mentor',
        name: 'Cipher',
        handle: 'CYP43R',
        role: 'Your Mentor',
        description: 'Experienced hacker who recruited you into the operation. Cryptic and always watching.',
        isAlly: true,
      },
      {
        id: 'rival_hacker',
        name: 'Echo',
        handle: 'ECH0',
        role: 'Rival Operative',
        description: 'Competitive hacker with unknown allegiances. Faster, more reckless, more dangerous.',
        isAlly: false,
      },
      {
        id: 'agency_chief',
        name: 'Director Voss',
        handle: 'VOSS_D1R',
        role: 'Agency Director',
        description: 'Cold intelligence operative. Orchestrates missions behind the scenes.',
        isAlly: true,
      },
      {
        id: 'inside_contact',
        name: 'Nova',
        handle: 'N0V4_x',
        role: 'Inside Contact',
        description: 'Insider at target facilities. Provides intel and access. Morally ambiguous.',
        isAlly: true,
      },
    ];

    characters.forEach((char) => this.characters.set(char.id, char));
  }

  /**
   * Initialize story nodes
   */
  private initializeStory(): void {
    // PROLOGUE
    this.createNode('opening_1', 'prologue', 'phantom_mentor', 'The city is a circuit board. Every light a pathway. Every shadow a vulnerability.', [
      {
        id: 'choice_1a',
        text: 'I understand. When do we start?',
        nextNodeId: 'opening_2',
        triggerFlags: ['accepted_mission'],
      },
      {
        id: 'choice_1b',
        text: 'This is insane. I am not a hacker.',
        nextNodeId: 'opening_3',
        triggerFlags: ['hesitant'],
      },
    ]);

    this.createNode('opening_2', 'prologue', 'phantom_mentor', 'I knew you would. You have the temperament for this work. Cold. Precise. Adaptable.', [], [
      'accepted_mission',
      'mission_briefing',
    ]);

    this.createNode('opening_3', 'prologue', 'phantom_mentor', 'Too late. You already know too much. The only way out is through. And the only way through... is in.', [
      {
        id: 'choice_3a',
        text: 'Fine. I will do this.',
        nextNodeId: 'opening_2',
        triggerFlags: ['reluctant_recruit'],
      },
    ]);

    // ACT 1: The Beginning
    this.createNode('act1_1', 'act1', 'agency_chief', 'Your first target is isolated. The network security is outdated. This is a test of your competency.', [
      {
        id: 'choice_act1_1a',
        text: 'I am ready.',
        nextNodeId: 'act1_2',
      },
      {
        id: 'choice_act1_1b',
        text: 'What if I fail?',
        nextNodeId: 'act1_3',
      },
    ]);

    this.createNode('act1_2', 'act1', 'agency_chief', 'Good. Then retrieve the data and exfiltrate. Clean. Professional. Like you have done it a hundred times before.', [], [
      'first_mission_accepted',
    ]);

    this.createNode('act1_3', 'act1', 'agency_chief', 'Failure is not an option. Failure means prison. Or worse. The target has no backup. Neither do you.', [
      {
        id: 'choice_act1_3a',
        text: 'I understand.',
        nextNodeId: 'act1_2',
      },
    ]);

    // ACT 2: Rising Tension
    this.createNode(
      'act2_1',
      'act2',
      'rival_hacker',
      'You are good. But I am better. And I am coming for your contracts. And your reputation. And everything you have built.',
      [
        {
          id: 'choice_act2_1a',
          text: 'Bring it on.',
          nextNodeId: 'act2_2',
          triggerFlags: ['rivalry_declared'],
        },
        {
          id: 'choice_act2_1b',
          text: 'I do not want a war.',
          nextNodeId: 'act2_3',
          triggerFlags: ['rivalry_declined'],
        },
      ],
    );

    this.createNode('act2_2', 'act2', 'rival_hacker', 'Excellent. Then the game begins. May the best hacker win. Or may we both burn trying.', []);

    this.createNode('act2_3', 'act2', 'rival_hacker', 'Too late. War was never optional. It simply was not your decision to make.', [
      {
        id: 'choice_act2_3a',
        text: 'Then I will end this.',
        nextNodeId: 'act2_2',
      },
    ]);

    // ACT 3: The Convergence
    this.createNode(
      'act3_1',
      'act3',
      'phantom_mentor',
      'Everything you have done has led here. The final contract. The one that changes everything. Or ends everything.',
      [
        {
          id: 'choice_act3_1a',
          text: 'What is the target?',
          nextNodeId: 'act3_2',
        },
      ],
    );

    this.createNode('act3_2', 'act3', 'phantom_mentor', 'The Citadel. The nexus of every major government network. Impenetrable. Impossible. Legendary.', [
      {
        id: 'choice_act3_2a',
        text: 'I will do it.',
        nextNodeId: 'act3_3',
        triggerFlags: ['citadel_mission_accepted'],
      },
    ]);

    this.createNode('act3_3', 'act3', 'agency_chief', 'Success means freedom. Failure means a bullet in the dark. Good luck, operative.', []);
  }

  /**
   * Helper to create and register a story node
   */
  private createNode(
    id: string,
    act: StoryAct,
    characterId: string,
    dialogue: string,
    choices: Array<{ id: string; text: string; nextNodeId: string; triggerFlags?: string[] }> = [],
    flags: string[] = [],
  ): StoryNode {
    const node: StoryNode = {
      id,
      act,
      character: characterId,
      dialogue,
      choices: choices.length > 0 ? choices : undefined,
      flags,
    };

    this.storyNodes.set(id, node);
    return node;
  }
}

// Singleton instance
let storyEngine: StoryEngine | null = null;

export const getStoryEngine = (): StoryEngine => {
  if (!storyEngine) {
    storyEngine = new StoryEngine();
  }
  return storyEngine;
};
