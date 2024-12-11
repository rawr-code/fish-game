import {
  MovementComponent,
  PositionComponent,
  SpriteComponent,
} from '@components';
import { getSpritePath } from '@utils';

import { ASSETS } from '@constants';

import Entity from './Entity';

class Fish extends Entity {
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: keyof typeof ASSETS.SPRITES.FISH,
  ) {
    super();
    this.scene = scene;

    const sprite = scene.add.sprite(
      x,
      y,
      ASSETS.ATLAS.KEY,
      getSpritePath(ASSETS.SPRITES.FISH[type]),
    );

    // Añadir componentes básicos
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(
      new MovementComponent(
        Phaser.Math.Between(-50, 50), // velocidad X inicial aleatoria
        Phaser.Math.Between(-30, 30), // velocidad Y inicial aleatoria
      ),
    );
    this.addComponent(new SpriteComponent(sprite));

    // Voltear el sprite según la dirección inicial
    const movement = this.getComponent<MovementComponent>('movement');
    if (movement && movement.velocityX < 0) {
      sprite.setFlipX(true);
    }
  }

  // Método para actualizar el movimiento del pez
  update(deltaTime: number): void {
    const position = this.getComponent<PositionComponent>('position');
    const movement = this.getComponent<MovementComponent>('movement');
    const sprite = this.getComponent<SpriteComponent>('sprite')?.sprite;

    if (position && movement && sprite) {
      // Actualizar posición
      position.x += movement.velocityX * (deltaTime / 1000);
      position.y += movement.velocityY * (deltaTime / 1000);

      // Mantener dentro de los límites de la pantalla
      this.keepInBounds(position);

      // Actualizar sprite
      sprite.x = position.x;
      sprite.y = position.y;

      // Actualizar dirección del sprite
      if (movement.velocityX !== 0) {
        sprite.setFlipX(movement.velocityX < 0);
      }
    }
  }

  private keepInBounds(position: PositionComponent): void {
    const bounds = {
      minX: 0,
      maxX: this.scene.game.config.width as number,
      minY: 0,
      maxY: this.scene.game.config.height as number,
    };

    // Si el pez sale de los límites, invertir su dirección
    const movement = this.getComponent<MovementComponent>('movement');

    if (movement) {
      if (position.x <= bounds.minX || position.x >= bounds.maxX) {
        movement.velocityX *= -1;
      }

      if (position.y <= bounds.minY || position.y >= bounds.maxY) {
        movement.velocityY *= -1;
      }
    }

    // Mantener dentro de los límites
    position.x = Phaser.Math.Clamp(position.x, bounds.minX, bounds.maxX);
    position.y = Phaser.Math.Clamp(position.y, bounds.minY, bounds.maxY);
  }
}

export default Fish;
