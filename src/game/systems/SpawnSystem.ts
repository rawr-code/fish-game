import { Scene } from 'phaser';
import { Entity } from '@entities';
import { GameConfig } from '@types';
import {
  MovementComponent,
  SpriteComponent,
  WaveMovementComponent,
} from '@components';
import { ASSETS, FISH_TYPES, FishType } from '@constants';

import { System } from './System';

export class SpawnSystem extends System {
  private spawnTimer: number = 0;
  private readonly config: GameConfig;

  constructor(scene: Scene, config: GameConfig) {
    super(scene);
    this.config = config;
  }

  update(entities: Entity[], delta: number): void {
    this.spawnTimer += delta;

    if (this.spawnTimer >= this.config.spawnInterval) {
      this.spawnFish(entities);
      this.spawnTimer = 0;
    }
  }

  private spawnFish(entities: Entity[]): void {
    const fishType = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
    const direction = Math.random() > 0.5 ? 'right' : 'left';
    const y = Math.random() * (this.config.height - 200) + 100;
    const x = direction === 'right' ? -100 : this.config.width + 100;

    const fish = new Entity();

    // Crear sprite
    const sprite = this.scene.add.sprite(
      x,
      y,
      ASSETS.ATLAS.KEY,
      fishType.sprite,
    );

    // Mejorar la calidad del renderizado
    sprite.setOrigin(0.5);
    sprite.setScale(fishType.scale);
    sprite.setDepth(1);

    // Optimizar la textura
    sprite.texture.setFilter(Phaser.Textures.LINEAR);

    // Asegurarse de que el sprite esté alineado con los píxeles
    sprite.x = Math.round(sprite.x);
    sprite.y = Math.round(sprite.y);

    // Hacer el sprite interactivo
    sprite.setInteractive({ useHandCursor: true, pixelPerfect: true });

    // Configurar eventos de interacción
    this.setupInteractiveEvents(sprite, fishType);

    // Bounding box y punto central para debug
    if (this.config.debugSprites) {
      // Crear un objeto graphics para dibujar
      const debugGraphics = this.scene.add.graphics();

      // Actualizar el debug en el update loop
      this.scene.events.on('update', () => {
        // Limpiar graphics previos
        debugGraphics.clear();

        // Configurar estilo
        debugGraphics.lineStyle(2, 0xff0000); // Línea roja de 2px

        // Dibujar bounding box
        debugGraphics.strokeRect(
          sprite.x - sprite.width / 2,
          sprite.y - sprite.height / 2,
          sprite.width,
          sprite.height,
        );

        // Dibujar punto central
        debugGraphics.fillStyle(0x00ff00);
        debugGraphics.fillCircle(sprite.x, sprite.y, 4);
      });
    }

    // Generar valores aleatorios para el movimiento ondulante
    const amplitude =
      Math.random() * (fishType.amplitude.max - fishType.amplitude.min) +
      fishType.amplitude.min;

    const frequency =
      Math.random() * (fishType.frequency.max - fishType.frequency.min) +
      fishType.frequency.min;

    const speed =
      Math.random() * (fishType.speed.max - fishType.speed.min) +
      fishType.speed.min;

    fish.addComponent(new SpriteComponent(sprite));
    fish.addComponent(new MovementComponent(speed, direction));
    fish.addComponent(new WaveMovementComponent(amplitude, frequency, y));

    entities.push(fish);
  }

  private setupInteractiveEvents(
    sprite: Phaser.GameObjects.Sprite,
    fishType: FishType,
  ): void {
    const originalScale = sprite.scale;

    // Efecto hover
    sprite.on('pointerover', () => {
      if (fishType.animations?.hover) {
        this.scene.tweens.add({
          targets: sprite,
          scaleX: originalScale * fishType.animations.hover.scale,
          scaleY: originalScale * fishType.animations.hover.scale,
          duration: fishType.animations.hover.duration,
          ease: 'Quad.easeOut',
        });
      }
      sprite.setTint(0xffffff);
      this.scene.game.canvas.style.cursor = 'pointer';
    });

    sprite.on('pointerout', () => {
      if (fishType.animations?.hover) {
        this.scene.tweens.add({
          targets: sprite,
          scaleX: originalScale,
          scaleY: originalScale,
          duration: fishType.animations.hover.duration,
          ease: 'Quad.easeOut',
        });
      }
      sprite.clearTint();
      this.scene.game.canvas.style.cursor = 'default';
    });

    // Efecto click
    sprite.on('pointerdown', () => {
      if (fishType.animations?.click) {
        this.scene.tweens.add({
          targets: sprite,
          scaleX: originalScale * fishType.animations.click.scale,
          scaleY: originalScale * fishType.animations.click.scale,
          duration: fishType.animations.click.duration,
          yoyo: true,
          ease: 'Bounce.easeOut',
          onComplete: () => {
            // Opcional: Añadir efectos de partículas
            // this.createClickParticles(sprite.x, sprite.y, fishType);
          },
        });
      }
    });
  }

  private createClickParticles(x: number, y: number, fishType: FishType): void {
    const particles = this.scene.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: fishType.tint || 0xffffff,
      quantity: 8,
      lifespan: 500,
      blendMode: 'ADD',
    });

    this.scene.time.delayedCall(500, () => {
      particles.destroy();
    });
  }
}
