const CONFIG = {
  PATH: 'assets/fish-pack',
  SPRITE: {
    prefix: 'fishTile_',
    suffix: '.png',
  },
} as const;

const SPRITES = {
  FISH: {
    GREEN: '073',
    BLUE: '077',
    RED: '079',
    YELLOW: '081',
    BROWN: '101',
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
