import { generateBackgroundGradient } from '@utils';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create(): void {
    generateBackgroundGradient(this);
  }

  update(): void {}
}

export default MainScene;
