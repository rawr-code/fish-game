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
  private isInteractive: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: keyof typeof ASSETS.SPRITES.FISH,
    isInteractive: boolean = true,
  ) {
    super();
    this.scene = scene;
    this.isInteractive = isInteractive;

    const sprite = scene.add.sprite(
      x,
      y,
      ASSETS.ATLAS.KEY,
      getSpritePath(ASSETS.SPRITES.FISH[type]),
    );

    // Si es interactivo, configurar eventos de click
    if (this.isInteractive) {
      sprite.setInteractive();
      this.setupInteractions(sprite);
    }

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
    const extraBounds = 100;

    const bounds = {
      minX: 0 - extraBounds,
      maxX: (this.scene.game.config.width as number) + extraBounds,
      minY: 0 - extraBounds,
      maxY: (this.scene.game.config.height as number) + extraBounds,
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

  private setupInteractions(sprite: Phaser.GameObjects.Sprite): void {
    sprite.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: sprite,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true,
      });

      this.emitBubbles();
    });

    sprite.on('pointerover', () => {
      sprite.setTintFill(0xd9d9d9);
      sprite.setAlpha(0.75);
    });

    sprite.on('pointerout', () => {
      sprite.clearTint();
      sprite.setAlpha(1);
    });
  }

  private emitBubbles(): void {
    const position = this.getComponent<PositionComponent>('position');
    // Crear un emisor de partículas simple para las burbujas
    const lifespan = 1000;
    const particles = this.scene.add.particles(
      position?.x,
      position?.y,
      'bubble',
      {
        speed: 100,
        scale: { start: 0.2, end: 0 },
        blendMode: Phaser.BlendModes.ADD,
        lifespan,
        quantity: 5,
      },
    );

    this.scene.time.delayedCall(lifespan, () => particles.destroy());
  }
}

export default Fish;
