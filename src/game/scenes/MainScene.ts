import { Entity } from '@entities';
import { EFishColor, GameConfig } from '@types';
import { MovementSystem, PoolingSystem, SpawnSystem } from '@systems';
import { PoolComponent, SpriteComponent } from '@components';
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
  private isProcessingVoiceCommand: boolean = false;

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
      countVisibleFish: (color, expectedCount) => {
        this.processVoiceCommand(color, expectedCount);
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

    if (this.isPaused || this.isProcessingVoiceCommand) {
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

  private getVisibleFishByColor(color: EFishColor) {
    const fishOfColor = Array.from(this.entities.values()).filter(entity => {
      const poolComponent = entity.getComponent<PoolComponent>('pool');
      if (!poolComponent) return false;

      return poolComponent.fishType === color;
    });

    return fishOfColor;
  }

  // Método opcional para resaltar visualmente los peces encontrados
  private highlightFoundFish(entities: Entity[]) {
    return new Promise<void>(resolve => {
      // Guardar el tint original de cada pez
      const originalTints = new Map<string, number>();

      entities.forEach(entity => {
        const fish = entity.getComponent<SpriteComponent>('sprite');

        if (!fish) return;

        originalTints.set(entity.id, fish.sprite.tint);
        // Aplicar un efecto de brillo
        fish.sprite.setTint(0xfffff);

        // Crear un efecto de partículas o resplandor alrededor del pez
        this.createHighlightEffect(entity);
      });

      // Restaurar el tint original después de un tiempo
      this.time.delayedCall(1000, () => {
        entities.forEach(entity => {
          const fish = entity.getComponent<SpriteComponent>('sprite');

          if (!fish) return;

          const originalTint = originalTints.get(entity.id);
          if (originalTint) {
            fish.sprite.setTint(originalTint);
          }
        });
        resolve();
      });
    });
  }

  private createHighlightEffect(entity: Entity) {
    const fish = entity.getComponent<SpriteComponent>('sprite');

    if (!fish) return;

    // Crear un círculo de resplandor alrededor del pez
    const highlight = this.add.circle(
      fish.sprite.x,
      fish.sprite.y,
      fish.sprite.width / 1.5,
      0xffffff,
      0.3,
    );
    highlight.setDepth(fish.sprite.depth - 1);

    // Animar el resplandor
    this.tweens.add({
      targets: highlight,
      scale: 1.5,
      alpha: 0,
      duration: 500,
      repeat: 1,
      ease: 'Power2',
      onComplete: () => {
        highlight.destroy();
      },
    });
  }

  private async processVoiceCommand(color: EFishColor, expectedCount: number) {
    if (this.isProcessingVoiceCommand) {
      return; // Evitar procesamiento simultáneo de comandos
    }

    try {
      this.isProcessingVoiceCommand = true;

      // Tomar una "snapshot" de los peces actuales
      const snapshot = this.getVisibleFishByColor(color);
      const actualCount = snapshot.length;

      console.log({
        color,
        expectedCount,
        actualCount,
      });

      // Mostrar el resultado y resaltar los peces
      if (actualCount === expectedCount) {
        await this.highlightFoundFish(snapshot);
      }
    } finally {
      // Asegurarnos de que siempre se restaure el estado
      this.isProcessingVoiceCommand = false;
    }
  }
}

export default MainScene;
