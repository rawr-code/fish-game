import { Fish } from '@entities';
import { MovementSystem } from '@systems';
import { generateBackgroundGradient } from '@utils';
import { ASSETS } from '../constants';

class MainScene extends Phaser.Scene {
  private fishes: Fish[] = [];
  private movementSystem: MovementSystem;

  constructor() {
    super({ key: 'MainScene' });
    this.movementSystem = new MovementSystem();
  }

  create(): void {
    generateBackgroundGradient(this);

    for (let i = 0; i < 16; i++) {
      const types = Object.keys(ASSETS.SPRITES.FISH);

      const fish = new Fish(
        this,
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 500),
        types[Phaser.Math.Between(0, types.length - 1)] as
          | 'GREEN'
          | 'BLUE'
          | 'RED'
          | 'YELLOW'
          | 'BROWN',
      );
      this.fishes.push(fish);
      this.movementSystem.addEntity(fish);
    }
  }

  update(_time: number, delta: number): void {
    // Actualizar el sistema de movimiento
    this.movementSystem.update(delta);

    // Actualizar cada pez individualmente
    this.fishes.forEach(fish => fish.update(delta));
  }
}

export default MainScene;
