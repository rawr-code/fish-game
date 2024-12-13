import { Scene } from 'phaser';
import { Entity } from '@entities';
import { GameConfig } from '@types';
import {
  MovementComponent,
  SpriteComponent,
  WaveMovementComponent,
} from '@components';
import { ASSETS, FISH_TYPES } from '@constants';

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
    this.setupInteractiveEvents(sprite);

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

    // Añadir componentes
    const speed =
      Math.random() * (fishType.speed.max - fishType.speed.min) +
      fishType.speed.min;

    fish.addComponent(new SpriteComponent(sprite));
    fish.addComponent(new MovementComponent(speed, direction));
    fish.addComponent(
      new WaveMovementComponent(
        20 + Math.random() * 30, // amplitude
        0.002 + Math.random() * 0.002, // frequency
        y, // initialY
      ),
    );

    entities.push(fish);
  }

  private setupInteractiveEvents(sprite: Phaser.GameObjects.Sprite): void {
    // Efecto hover
    sprite.on('pointerover', () => {
      sprite.setTint(0xffffff);
      this.scene.game.canvas.style.cursor = 'pointer';
    });

    sprite.on('pointerout', () => {
      sprite.clearTint();
      this.scene.game.canvas.style.cursor = 'default';
    });

    // Efecto click
    sprite.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: sprite,
        scaleX: sprite.scaleX * 1.2,
        scaleY: sprite.scaleY * 1.2,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // Opcional: Añadir algún efecto adicional al completar
          console.log('Click animation complete');
        },
      });
    });
  }
}
