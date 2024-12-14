export enum SpeechCommand {
  SPEED_UP = 'SPEED_UP',
  SLOW_DOWN = 'SLOW_DOWN',
  PAUSE = 'PAUSE',
  RESUME = 'RESUME',
}

// Mapeo de comandos de voz a sus variantes
export const SPEECH_COMMANDS_MAP: Record<SpeechCommand, string[]> = {
  [SpeechCommand.SPEED_UP]: ['más rápido', 'acelerar', 'velocidad alta'],
  [SpeechCommand.SLOW_DOWN]: ['más lento', 'desacelerar', 'velocidad baja'],
  [SpeechCommand.PAUSE]: ['pausa', 'pausar', 'detener', 'stop'],
  [SpeechCommand.RESUME]: ['continuar', 'reanudar', 'seguir', 'play'],
};
