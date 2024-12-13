export interface FishType {
  key: string;
  sprite: string;
  scale: number;
  speed: { min: number; max: number };
  amplitude: { min: number; max: number }; // Para el movimiento ondulante
  frequency: { min: number; max: number }; // Frecuencia del movimiento ondulante
  points?: number; // Puntos que da cada pez (si implementas sistema de puntos)
  tint?: number; // Color tint opcional
  animations?: {
    hover?: {
      scale: number;
      duration: number;
    };
    click?: {
      scale: number;
      duration: number;
    };
  };
}

export const FISH_TYPES: FishType[] = [
  {
    key: 'blue',
    sprite: 'fishTile_077.png',
    scale: 0.8,
    speed: { min: 2.5, max: 4 },
    amplitude: { min: 15, max: 30 },
    frequency: { min: 0.001, max: 0.003 },
    points: 10,
    animations: {
      hover: {
        scale: 1.1,
        duration: 200,
      },
      click: {
        scale: 1.2,
        duration: 100,
      },
    },
  },
  {
    key: 'red',
    sprite: 'fishTile_079.png',
    scale: 0.9,
    speed: { min: 3, max: 4.5 },
    amplitude: { min: 20, max: 35 },
    frequency: { min: 0.002, max: 0.004 },
    points: 15,
    animations: {
      hover: {
        scale: 1.15,
        duration: 200,
      },
      click: {
        scale: 1.25,
        duration: 100,
      },
    },
  },
  {
    key: 'green',
    sprite: 'fishTile_073.png',
    scale: 0.75,
    speed: { min: 2, max: 3.5 },
    amplitude: { min: 10, max: 25 },
    frequency: { min: 0.001, max: 0.002 },
    points: 20,
    animations: {
      hover: {
        scale: 1.1,
        duration: 200,
      },
      click: {
        scale: 1.2,
        duration: 100,
      },
    },
  },
  {
    key: 'brown',
    sprite: 'fishTile_101.png',
    scale: 0.85,
    speed: { min: 1.5, max: 3 },
    amplitude: { min: 25, max: 40 },
    frequency: { min: 0.002, max: 0.003 },
    points: 25,
    animations: {
      hover: {
        scale: 1.12,
        duration: 200,
      },
      click: {
        scale: 1.22,
        duration: 100,
      },
    },
  },
];
