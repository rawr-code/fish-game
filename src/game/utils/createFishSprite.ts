import { Scene } from 'phaser';
import { Assets, FishType } from '@constants';

const setupInteractiveEvents = (
  scene: Scene,
  sprite: Phaser.GameObjects.Sprite,
  fishType: FishType,
): void => {
  const originalScale = sprite.scale;

  // Efecto hover
  sprite.on('pointerover', () => {
    if (fishType.animations?.hover) {
      scene.tweens.add({
        targets: sprite,
        scaleX: originalScale * fishType.animations.hover.scale,
        scaleY: originalScale * fishType.animations.hover.scale,
        duration: fishType.animations.hover.duration,
        ease: 'Quad.easeOut',
      });
    }
    sprite.setTint(0xffffff);
    scene.game.canvas.style.cursor = 'pointer';
  });

  sprite.on('pointerout', () => {
    if (fishType.animations?.hover) {
      scene.tweens.add({
        targets: sprite,
        scaleX: originalScale,
        scaleY: originalScale,
        duration: fishType.animations.hover.duration,
        ease: 'Quad.easeOut',
      });
    }
    sprite.clearTint();
    scene.game.canvas.style.cursor = 'default';
  });

  // Efecto click
  sprite.on('pointerdown', () => {
    if (fishType.animations?.click) {
      scene.tweens.add({
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
};

// const createClickParticles = (
//   scene: Scene,
//   x: number,
//   y: number,
//   fishType: FishType,
// ): void => {
//   const particles = scene.add.particles(x, y, 'particle', {
//     speed: { min: 50, max: 100 },
//     scale: { start: 0.4, end: 0 },
//     alpha: { start: 0.6, end: 0 },
//     tint: fishType.tint || 0xffffff,
//     quantity: 8,
//     lifespan: 500,
//     blendMode: 'ADD',
//   });

//   scene.time.delayedCall(500, () => {
//     particles.destroy();
//   });
// };

interface ICreateSpriteProps {
  scene: Scene;
  x: number;
  y: number;
  name: string;
  scale: number;
  fishType: FishType;
  isInteractive?: boolean;
  debug?: boolean;
}
export const createFishSprite = ({
  scene,
  x,
  y,
  name,
  scale,
  fishType,
  isInteractive = true,
  debug = false,
}: ICreateSpriteProps) => {
  const sprite = scene.add.sprite(x, y, Assets.ATLAS.KEY, name);

  sprite.setOrigin(0.5);
  sprite.setScale(scale);
  sprite.setDepth(1);

  // Optimizar la textura
  sprite.texture.setFilter(Phaser.Textures.LINEAR);

  // Asegurarse de que el sprite esté alineado con los píxeles
  sprite.x = Math.round(sprite.x);
  sprite.y = Math.round(sprite.y);

  if (isInteractive) {
    // Hacer el sprite interactivo
    sprite.setInteractive({ useHandCursor: true, pixelPerfect: true });

    // Configurar eventos de interacción
    setupInteractiveEvents(scene, sprite, fishType);
  }

  // Bounding box y punto central para debug
  if (debug) {
    // Crear un objeto graphics para dibujar
    const debugGraphics = scene.add.graphics();

    // Actualizar el debug en el update loop
    scene.events.on('update', () => {
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

  return sprite;
};
