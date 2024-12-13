import { Scene } from 'phaser';
import { frameConfig } from '@config';

class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    const x = frameConfig.width / 2;
    const padding = 10;

    // Mostrar barra de carga
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0xb0e0e6, 0.7);
    progressBox.fillRect(x / 2, 270, 420, 50);

    // Eventos de carga
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xb0e0e6, 1);
      progressBar.fillRect(x / 2 + padding, 280, 400 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });

    this.load.multiatlas(
      'assets',
      'assets/fish-pack/fish-pack.json',
      'assets/fish-pack',
    );
  }

  create(): void {
    this.scene.start('MainScene');
  }
}

export default PreloadScene;
