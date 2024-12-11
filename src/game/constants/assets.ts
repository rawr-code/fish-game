const CONFIG = {
  PATH: 'assets/fish-pack',
  SPRITE: {
    prefix: 'fishTile_',
    suffix: '.png',
  },
} as const;

const SPRITES = {
  FISH: {
    GREEN: '072',
    BLUE: '076',
    RED: '078',
    YELLOW: '080',
    BROWN: '100',
  },
  PLANTS: {
    CORAL: 'fishTile_010',
  },
} as const;

const ASSETS = {
  CONFIG,
  SPRITES,
  ATLAS: {
    PATH: 'atlas',
    KEY: 'fishSpritesheet',
    TEXTURE: 'fishSpritesheet.png',
    FILE: 'fishSpritesheet.xml',
  },
} as const;

export default ASSETS;
