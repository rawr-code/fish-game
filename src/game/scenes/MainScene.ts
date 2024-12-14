import { Entity } from '@entities';
import { GameConfig } from '@types';
import { MovementSystem, PoolingSystem, SpawnSystem } from '@systems';
import { SpriteComponent } from '@components';
import { DEFAULT_GAME_CONFIG } from '@config';
import { generateBackgroundGradient } from '@utils';
import { FISH_TYPES } from '../constants';
import { setupEventListeners } from '../EventBus';

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
    setupEventListeners({
      onUpdateSpawnTime: time => {
        this.spawnSystem.updateSpawnTime(time);
      },
    });

    // Inicializar sistemas
    this.poolingSystem = new PoolingSystem(this, true);

    // Inicializar pools para cada tipo de pez
    FISH_TYPES.forEach(fishType => {
      console.log(`Initializing pool for ${fishType.key}`);
      this.poolingSystem.initializePool(fishType, DEFAULT_GAME_CONFIG.poolSize);
    });

    this.movementSystem = new MovementSystem(this);
    this.spawnSystem = new SpawnSystem(this, this.config, this.poolingSystem);

    //  mostrar el FPS
    this.fpsText = this.add.text(this.scale.width - 10, 10, 'FPS: 0', {
      font: '16px Arial',
      color: '#ffffff',
      align: 'right',
    });

    // Ajustar el origen del texto para que esté alineado a la derecha
    this.fpsText.setOrigin(1, 0);
  }

  update(_time: number, delta: number): void {
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
