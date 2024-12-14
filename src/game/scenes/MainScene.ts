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
  private isPaused: boolean = false;
  private pauseText: Phaser.GameObjects.Text;

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
      onTogglePause: isPaused => {
        this.handlePause(isPaused);
      },
    });

    this.pauseText = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, 'PAUSA', {
        fontSize: '64px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setVisible(false);

    // Inicializar sistemas
    this.poolingSystem = new PoolingSystem(this, true);

    // Inicializar pools para cada tipo de pez
    FISH_TYPES.forEach(fishType => {
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

    if (this.isPaused) {
      return; // No actualizar nada si el juego está pausado
    }

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

  private handlePause(shouldPause: boolean) {
    this.isPaused = shouldPause;

    // Pausar/reanudar todos los timers
    if (shouldPause) {
      if (this.spawnSystem) {
        this.spawnSystem.updateSpawnTime(0);
      }
    } else {
      if (this.spawnSystem) {
        this.spawnSystem.updateSpawnTime(DEFAULT_GAME_CONFIG.spawnInterval);
      }
    }

    // Mostrar/ocultar texto de pausa
    if (this.pauseText) {
      this.pauseText.setVisible(shouldPause);
    }

    // Efecto visual de oscurecimiento durante la pausa
    if (shouldPause) {
      this.add
        .rectangle(
          0,
          0,
          this.cameras.main.width,
          this.cameras.main.height,
          0x000000,
          0.3,
        )
        .setOrigin(0)
        .setDepth(999)
        .setName('pauseOverlay');
    } else {
      const overlay = this.children.getByName('pauseOverlay');
      if (overlay) {
        overlay.destroy();
      }
    }
  }
}

export default MainScene;
