import { MainScene, PreloadScene } from '@scenes';
import frameConfig from './frameConfig';

const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: frameConfig.width,
  height: frameConfig.height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [PreloadScene, MainScene],
  backgroundColor: '#4488AA',
};

export default GameConfig;
