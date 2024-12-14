import { Entity } from '@entities';
import { GameConfig } from '@types';
import { MovementSystem, PoolingSystem, SpawnSystem } from '@systems';
import { SpriteComponent } from '@components';
import { DEFAULT_GAME_CONFIG } from '@config';
import { generateBackgroundGradient } from '@utils';
import { FISH_TYPES } from '../constants';

class MainScene extends Phaser.Scene {
  private entities: Entity[] = [];
  private movementSystem: MovementSystem;
  private spawnSystem: SpawnSystem;
  private poolingSystem: PoolingSystem;
  private config: GameConfig;
  private fpsText: Phaser.GameObjects.Text;

  constructor(config: GameConfig = DEFAULT_GAME_CONFIG) {
    super({ key: 'MainScene' });
    this.config = config;
  }

  create(): void {
    generateBackgroundGradient(this);

    // Inicializar sistemas
    this.poolingSystem = new PoolingSystem(this, true);

    // Inicializar pools para cada tipo de pez
    FISH_TYPES.forEach(fishType => {
      console.log(`Initializing pool for ${fishType.key}`);
      this.poolingSystem.initializePool(fishType, DEFAULT_GAME_CONFIG.poolSize);
    });

    this.movementSystem = new MovementSystem(this);
    this.spawnSystem = new SpawnSystem(this, this.config, this.poolingSystem);

    // Configurar input
    // this.input.on('gameobjectdown', this.handleFishClick, this);

    //  mostrar el FPS
    this.fpsText = this.add.text(this.scale.width - 10, 10, 'FPS: 0', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'right',
    });

    // Ajustar el origen del texto para que esté alineado a la derecha
    this.fpsText.setOrigin(1, 0);
  }

  update(time: number, delta: number): void {
    // Actualizar FPS actual
    const fps = Math.floor(this.game.loop.actualFps); // Obtener el FPS actual
    this.fpsText.setText(`FPS: ${fps}`);

    this.movementSystem.update(this.entities, delta);
    this.spawnSystem.update(this.entities, delta);
    this.poolingSystem.update(this.entities);

    // Limpiar entidades fuera de pantalla
    this.cleanupEntities();
  }

  destroy(): void {
    this.poolingSystem.clear();
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
