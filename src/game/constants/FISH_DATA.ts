export interface FishType {
  key: string;
  sprite: string;
  scale: number;
  speed: {
    min: number;
    max: number;
  };
}

export const FISH_TYPES: FishType[] = [
  {
    key: 'blue',
    sprite: 'fishTile_077.png',
    scale: 1,
    speed: { min: 2, max: 3.5 },
  },
  {
    key: 'red',
    sprite: 'fishTile_079.png',
    scale: 1,
    speed: { min: 2, max: 3.5 },
  },
  {
    key: 'green',
    sprite: 'fishTile_073.png',
    scale: 1,
    speed: { min: 2, max: 3.5 },
  },
  {
    key: 'brown',
    sprite: 'fishTile_101.png',
    scale: 1,
    speed: { min: 2, max: 3.5 },
  },
];
