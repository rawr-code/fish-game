import { Entity } from '@entities';
import { GameConfig } from '@types';
import { MovementSystem, SpawnSystem } from '@systems';
import { SpriteComponent } from '@components';
import { DEFAULT_GAME_CONFIG } from '@config';
import { generateBackgroundGradient } from '@utils';

// import { ASSETS } from '@constants';

class MainScene extends Phaser.Scene {
  private entities: Entity[] = [];
  private movementSystem: MovementSystem;
  private spawnSystem: SpawnSystem;
  private config: GameConfig;

  constructor(config: GameConfig = DEFAULT_GAME_CONFIG) {
    super({ key: 'MainScene' });
    this.config = config;
  }

  create(): void {
    generateBackgroundGradient(this);

    // Inicializar sistemas
    this.movementSystem = new MovementSystem(this);
    this.spawnSystem = new SpawnSystem(this, this.config);

    // Configurar input
    // this.input.on('gameobjectdown', this.handleFishClick, this);
  }

  update(time: number, delta: number): void {
    this.movementSystem.update(this.entities, delta);
    this.spawnSystem.update(this.entities, delta);

    // Limpiar entidades fuera de pantalla
    this.cleanupEntities();
  }

  private handleFishClick(
    pointer: Phaser.Input.Pointer,
    gameObject: Phaser.GameObjects.GameObject,
  ): void {
    // Encontrar la entidad clickeada
    const clickedEntity = this.entities.find(entity => {
      const spriteComponent = entity.getComponent<SpriteComponent>('sprite');
      return spriteComponent?.sprite === gameObject;
    });

    if (clickedEntity) {
      const sprite =
        clickedEntity.getComponent<SpriteComponent>('sprite')?.sprite;
      if (sprite) {
        // Efecto de click
        this.tweens.add({
          targets: sprite,
          scaleX: sprite.scaleX * 1.2,
          scaleY: sprite.scaleY * 1.2,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            // Puedes añadir aquí lógica adicional cuando se completa el click
            console.log('Fish clicked!', clickedEntity.id);
          },
        });

        // Opcional: Añadir efecto de partículas o sonido
        this.addClickEffect(pointer.x, pointer.y);
      }
    }
  }

  private addClickEffect(x: number, y: number): void {
    // Efecto visual simple al hacer click
    const particles = this.add.particles(x, y, 'particle', {
      speed: 100,
      scale: { start: 0.5, end: 0 },
      quantity: 5,
      lifespan: 300,
      blendMode: 'ADD',
    });

    // Auto destruir el emisor después de un momento
    this.time.delayedCall(300, () => {
      particles.destroy();
    });
  }

  private cleanupEntities(): void {
    this.entities = this.entities.filter(entity => {
      const spriteComponent = entity.getComponent<SpriteComponent>('sprite');
      if (!spriteComponent) return false;

      const { sprite } = spriteComponent;
      if (sprite.x < -100 || sprite.x > this.config.width + 100) {
        sprite.destroy();
        return false;
      }
      return true;
    });
  }
}

export default MainScene;
