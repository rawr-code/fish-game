import {
  EGameEventType,
  SpeechCommand,
  SPEECH_COMMANDS_MAP,
  COLOR_MAPPING,
  EFishColor,
  convertTextNumberToDigit,
} from '@types';
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

    this.recognition.onspeechstart = () => {
      console.log('Speech started');
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

      //   console.group('🎤 Speech Recognition Result');
      //   console.log('Texto reconocido:', event.results[last][0].transcript);
      //   console.log('Confianza:', event.results[last][0].confidence);
      //   console.groupEnd();

      this.processCommand(command);
    };
  }

  private processCommand(command: string) {
    // Log del comando original
    // console.log('Comando original:', command);

    // Convertir números en texto a dígitos
    const normalizedCommand = this.normalizeCommand(command);
    const commandWithDigits = convertTextNumberToDigit(normalizedCommand);

    // console.log('Comando normalizado con dígitos:', commandWithDigits);

    // Intentar procesar como comando de conteo
    if (this.processCountCommand(commandWithDigits)) {
      return;
    }

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

  private normalizeCommand(command: string): string {
    return command
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .trim();
  }

  private processCountCommand(command: string): boolean {
    // Expresión regular más flexible que acepta diferentes formatos
    const patterns = [
      /(?:hay|veo|cuento|contar)?\s*(\d+)\s+(\w+)/i, // Para "hay 3 rojos" o "3 rojos"
      /(?:hay|veo|cuento|contar)?\s*(\d+)\s+(?:peces?\s+)?(\w+)/i, // Para "hay 3 peces rojos"
    ];

    for (const pattern of patterns) {
      const match = command.match(pattern);
      if (match) {
        const number = parseInt(match[1]);
        const colorWord = match[2].toLowerCase();

        // console.log('Match encontrado:', {
        //   número: number,
        //   colorPalabra: colorWord,
        // });

        const color = COLOR_MAPPING[colorWord];
        if (color) {
          this.countFishByColor(color, number);
          return true;
        }
      }
    }

    // Si no se encontró match con los patrones anteriores,
    // intentar con el parser más flexible
    return this.tryFlexibleParsing(command);
  }

  private tryFlexibleParsing(command: string): boolean {
    // Buscar cualquier número en el comando
    const numberMatch = command.match(/\d+/);
    if (!numberMatch) return false;

    const number = parseInt(numberMatch[0]);

    // Buscar cualquier color en el comando
    for (const [colorWord, color] of Object.entries(COLOR_MAPPING)) {
      if (command.includes(colorWord)) {
        // console.log('Match flexible encontrado:', {
        //   número: number,
        //   color: colorWord,
        // });

        this.countFishByColor(color, number);
        return true;
      }
    }

    return false;
  }

  private countFishByColor(color: EFishColor, expectedCount: number) {
    // Emitir evento para contar peces
    this.eventSystem.emit({
      type: EGameEventType.COUNT_FISH,
      payload: { color, expectedCount },
    });
  }
}
