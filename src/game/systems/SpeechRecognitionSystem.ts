import { EGameEventType, SpeechCommand, SPEECH_COMMANDS_MAP } from '@types';
import { EventSystem } from './EventSystem';

export class SpeechRecognitionSystem {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private eventSystem: EventSystem;

  constructor(eventSystem: EventSystem) {
    this.eventSystem = eventSystem;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.recognition = new (window.webkitSpeechRecognition ||
      window.SpeechRecognition)();
    this.setupRecognition();
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'es-ES';

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Speech recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');
      // Reiniciar si se detuvo inesperadamente
      if (this.isListening) {
        this.recognition?.start();
      }
    };

    this.recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onresult = event => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();

      this.processCommand(command);
    };
  }

  private processCommand(command: string) {
    // Buscar el comando en el mapa de comandos
    for (const [speechCommand, variants] of Object.entries(
      SPEECH_COMMANDS_MAP,
    )) {
      if (variants.some(variant => command.includes(variant))) {
        this.executeCommand(speechCommand as SpeechCommand);
        break;
      }
    }
  }

  private executeCommand(command: SpeechCommand) {
    switch (command) {
      case SpeechCommand.SPEED_UP:
        this.eventSystem.emit({
          type: EGameEventType.UPDATE_SPAWN_TIME,
          payload: 10,
        });
        break;
      case SpeechCommand.SLOW_DOWN:
        this.eventSystem.emit({
          type: EGameEventType.UPDATE_SPAWN_TIME,
          payload: 1000,
        });
        break;
      case SpeechCommand.PAUSE:
        this.eventSystem.emit({
          type: EGameEventType.TOGGLE_PAUSE,
          payload: true,
        });
        break;

      case SpeechCommand.RESUME:
        this.eventSystem.emit({
          type: EGameEventType.TOGGLE_PAUSE,
          payload: false,
        });
        break;
    }
  }

  public start() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  public toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
}
