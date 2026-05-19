import { AudioTrack, AudioMix } from '@/lib/types';

/**
 * Audio Engine - Manages game audio and sound effects
 * Pure business logic, no Web Audio API directly
 */

export class AudioEngine {
  private tracks: Map<string, AudioTrack> = new Map();
  private currentMix: AudioMix = {
    ambient: 0.7,
    sfx: 0.8,
    dialogue: 0.85,
    alert: 0.9,
    music: 0.6,
  };

  constructor() {
    this.initializeAudioTracks();
  }

  /**
   * Get audio track
   */
  public getTrack(id: string): AudioTrack | undefined {
    return this.tracks.get(id);
  }

  /**
   * Get all tracks
   */
  public getAllTracks(): AudioTrack[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Get tracks by category
   */
  public getTracksByCategory(category: string): AudioTrack[] {
    return Array.from(this.tracks.values()).filter((t) => t.category === category);
  }

  /**
   * Get current mix levels
   */
  public getMix(): AudioMix {
    return { ...this.currentMix };
  }

  /**
   * Update mix levels
   */
  public setMixLevel(category: keyof AudioMix, level: number): void {
    this.currentMix[category] = Math.max(0, Math.min(1, level));
  }

  /**
   * Play track (logic only, actual playback in React component)
   */
  public playTrack(id: string): AudioTrack | null {
    const track = this.tracks.get(id);
    if (track) {
      track.isPlaying = true;
      return track;
    }
    return null;
  }

  /**
   * Stop track
   */
  public stopTrack(id: string): void {
    const track = this.tracks.get(id);
    if (track) {
      track.isPlaying = false;
    }
  }

  /**
   * Initialize audio tracks
   */
  private initializeAudioTracks(): void {
    // Ambient tracks
    this.tracks.set('ambient_base', {
      id: 'ambient_base',
      name: 'Ambient Base Layer',
      category: 'ambient',
      src: '/audio/ambient_base.mp3',
      volume: 0.7,
      loop: true,
      isPlaying: false,
    });

    // SFX tracks
    this.tracks.set('sfx_alert', {
      id: 'sfx_alert',
      name: 'Alert Sound',
      category: 'sfx',
      src: '/audio/alert.wav',
      volume: 0.8,
      loop: false,
      isPlaying: false,
    });

    this.tracks.set('sfx_glitch', {
      id: 'sfx_glitch',
      name: 'Glitch Sound',
      category: 'sfx',
      src: '/audio/glitch.wav',
      volume: 0.6,
      loop: false,
      isPlaying: false,
    });

    // Music track
    this.tracks.set('music_main', {
      id: 'music_main',
      name: 'Main Theme',
      category: 'music',
      src: '/audio/main_theme.mp3',
      volume: 0.6,
      loop: true,
      isPlaying: false,
    });
  }
}

// Singleton
let audioEngine: AudioEngine | null = null;

export const getAudioEngine = (): AudioEngine => {
  if (!audioEngine) {
    audioEngine = new AudioEngine();
  }
  return audioEngine;
};
