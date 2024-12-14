export enum SpeechCommand {
  SPEED_UP = 'SPEED_UP',
  SLOW_DOWN = 'SLOW_DOWN',
  PAUSE = 'PAUSE',
  RESUME = 'RESUME',
  COUNT_FISH = 'COUNT_FISH',
}

export enum EFishColor {
  BLUE = 'blue',
  RED = 'red',
  GREEN = 'green',
  BROWN = 'brown',
}

// Interfaz para el resultado del conteo
export interface IFishCountResult {
  color: EFishColor;
  count: number;
  expected: number;
  correct: boolean;
}

// Mapeo de palabras en español a colores
export const COLOR_MAPPING: Record<string, EFishColor> = {
  azul: EFishColor.BLUE,
  azules: EFishColor.BLUE,
  rojo: EFishColor.RED,
  rojos: EFishColor.RED,
  verde: EFishColor.GREEN,
  verdes: EFishColor.GREEN,
  marrón: EFishColor.BROWN,
  marron: EFishColor.BROWN,
  marrones: EFishColor.BROWN,
  café: EFishColor.BROWN,
  cafe: EFishColor.BROWN,
  cafes: EFishColor.BROWN,
  cafés: EFishColor.BROWN,
  // Añadir más variaciones si es necesario
};

// Mapeo de comandos de voz a sus variantes
export const SPEECH_COMMANDS_MAP: Record<SpeechCommand, string[]> = {
  [SpeechCommand.SPEED_UP]: ['más rápido', 'acelerar', 'velocidad alta'],
  [SpeechCommand.SLOW_DOWN]: ['más lento', 'desacelerar', 'velocidad baja'],
  [SpeechCommand.PAUSE]: ['pausa', 'pausar', 'detener', 'stop'],
  [SpeechCommand.RESUME]: ['continuar', 'reanudar', 'seguir', 'play'],
  [SpeechCommand.COUNT_FISH]: ['hay', 'veo', 'contar', 'cuento'],
};

export const NUMBER_MAPPING: Record<string, number> = {
  cero: 0,
  un: 1,
  uno: 1,
  una: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,

  // medidas
  único: 1,
  única: 1,
  par: 2,
  triple: 3,
  cuádruple: 4,
  cuadruple: 4,
  'media docena': 6,
  docena: 12,
};

export const convertTextNumberToDigit = (text: string): string => {
  // Primero intentamos encontrar números escritos como texto
  const words = text.toLowerCase().split(' ');
  return words
    .map(word => {
      const number = NUMBER_MAPPING[word];
      return number !== undefined ? number.toString() : word;
    })
    .join(' ');
};
