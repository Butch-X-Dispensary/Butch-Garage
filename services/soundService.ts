
class SoundService {
  private sounds: Record<string, HTMLAudioElement> = {};

  constructor() {
    const soundUrls = {
      hover: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3',
      action: 'https://assets.mixkit.co/sfx/preview/mixkit-futuristic-robotic-interface-2442.mp3',
      success: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-confirmation-914.mp3',
      error: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
      modalOpen: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-positive-notification-266.mp3',
      modalClose: 'https://assets.mixkit.co/sfx/preview/mixkit-selection-click-1109.mp3',
    };

    Object.entries(soundUrls).forEach(([key, url]) => {
      this.sounds[key] = new Audio(url);
      this.sounds[key].volume = 0.2; // Keep it subtle and executive
    });
  }

  play(sound: 'hover' | 'action' | 'success' | 'error' | 'modalOpen' | 'modalClose') {
    const audio = this.sounds[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay policy might block sounds until user interaction
        // Silently fail as sound is non-critical
      });
    }
  }
}

export const sounds = new SoundService();
