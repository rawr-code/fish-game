import { MainScene, PreloadScene } from '@scenes';
import { GameConfig } from '@types';

export const DEFAULT_GAME_CONFIG: GameConfig = {
  canvasID: 'game-container',
  width: 918,
  height: 515,
  backgroundColor: '#4bb3fd',
  spawnInterval: 500,
  debugSprites: false,
};

export const defaultGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: DEFAULT_GAME_CONFIG.width,
  height: DEFAULT_GAME_CONFIG.height,
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [PreloadScene, MainScene],
  backgroundColor: DEFAULT_GAME_CONFIG.backgroundColor,
};
