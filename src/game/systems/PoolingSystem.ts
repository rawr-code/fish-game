import { Entity } from '@entities';
import { System } from './System';
import { FISH_TYPES, FishType } from '@constants';
import {
  SpriteComponent,
  MovementComponent,
  WaveMovementComponent,
  PoolComponent,
} from '@components';
import { createFishSprite } from '@utils';
import { PoolDebugUI, PoolStats } from '../debug/PoolDebugUI';

export class PoolingSystem extends System {
  private inactivePools: Map<string, Entity[]> = new Map();
  private activeEntities: Map<string, Entity[]> = new Map();
  private debugUI?: PoolDebugUI;
  private isDebugMode: boolean = false;

  constructor(scene: Phaser.Scene, debug: boolean = false) {
    super(scene);
    this.isDebugMode = debug;

    if (debug) {
      this.debugUI = new PoolDebugUI(scene);
      this.debugUI.show();

      // Añadir toggle con tecla D
      this.scene.input.keyboard?.on('keydown-D', () => {
        this.debugUI?.toggle();
      });

      // Inicializar los maps de entidades activas
      FISH_TYPES.forEach(type => {
        this.activeEntities.set(type.key, []);
      });
    }
  }

  initializePool(fishType: FishType, initialSize: number = 10): void {
    const pool: Entity[] = [];

    for (let i = 0; i < initialSize; i++) {
      const entity = this.createEntity(fishType);
      pool.push(entity);
    }

    this.inactivePools.set(fishType.key, pool);
  }

  acquireEntity(
    fishType: FishType,
    x: number,
    y: number,
    direction: 'left' | 'right',
  ): Entity {
    const pool = this.inactivePools.get(fishType.key);
    let entity: Entity;

    if (!pool || pool.length === 0) {
      entity = this.createEntity(fishType);
    } else {
      entity = pool.pop()!;
    }

    this.activateEntity(entity, fishType, x, y, direction);

    // Actualizar el registro de entidades activas
    let activePool = this.activeEntities.get(fishType.key);
    if (!activePool) {
      activePool = [];
      this.activeEntities.set(fishType.key, activePool);
    }
    activePool.push(entity);

    return entity;
  }

  releaseEntity(entity: Entity): void {
    const poolComponent = entity.getComponent<PoolComponent>('pool');
    if (!poolComponent) return;

    const fishType = poolComponent.fishType;

    // Desactivar la entidad
    const spriteComponent = entity.getComponent<SpriteComponent>('sprite');
    if (spriteComponent) {
      spriteComponent.sprite.setVisible(false);
      spriteComponent.sprite.setActive(false);
    }

    poolComponent.active = false;

    // Mover a la pool inactiva
    let inactivePool = this.inactivePools.get(fishType);
    if (!inactivePool) {
      inactivePool = [];
      this.inactivePools.set(fishType, inactivePool);
    }
    inactivePool.push(entity);

    // Remover de la pool activa
    const activePool = this.activeEntities.get(fishType);
    if (activePool) {
      const index = activePool.indexOf(entity);
      if (index > -1) {
        activePool.splice(index, 1);
      }
    }
  }

  update(entities: Entity[]): void {
    // Verificar entidades fuera de pantalla
    const entitiesToRelease: Entity[] = [];

    entities.forEach(entity => {
      const spriteComponent = entity.getComponent<SpriteComponent>('sprite');
      const poolComponent = entity.getComponent<PoolComponent>('pool');

      if (spriteComponent && poolComponent) {
        const { sprite } = spriteComponent;

        // Ajustar rango de detección más estricto
        const isOutOfBounds =
          sprite.x < -100 || sprite.x > +this.scene.game.config.width + 100;

        if (isOutOfBounds) {
          entitiesToRelease.push(entity);
        }
      }
    });

    // Liberar entidades
    entitiesToRelease.forEach(entity => {
      this.releaseEntity(entity);

      // Eliminar de la lista de entidades
      const index = entities.indexOf(entity);
      if (index > -1) {
        entities.splice(index, 1);
      }
    });

    if (this.isDebugMode && this.debugUI) {
      this.updateDebugStats();
    }
  }

  private createEntity(fishType: FishType): Entity {
    const entity = new Entity();

    // Crear sprite
    const sprite = createFishSprite({
      scene: this.scene,
      x: 0,
      y: 0,
      name: fishType.sprite,
      scale: fishType.scale,
      fishType,
    });

    sprite.setVisible(false);

    // Añadir componentes
    entity.addComponent(new SpriteComponent(sprite));
    entity.addComponent(new MovementComponent(0, 'right'));
    entity.addComponent(new WaveMovementComponent(0, 0, 0));
    entity.addComponent(new PoolComponent(fishType.key));

    return entity;
  }

  private activateEntity(
    entity: Entity,
    fishType: FishType,
    x: number,
    y: number,
    direction: 'left' | 'right',
  ): void {
    const spriteComponent = entity.getComponent<SpriteComponent>('sprite');
    const movementComponent =
      entity.getComponent<MovementComponent>('movement');
    const waveComponent =
      entity.getComponent<WaveMovementComponent>('waveMovement');
    const poolComponent = entity.getComponent<PoolComponent>('pool');

    if (spriteComponent) {
      const { sprite } = spriteComponent;
      sprite.setPosition(x, y);
      sprite.setVisible(true);
      sprite.setActive(true);
    }

    if (movementComponent) {
      movementComponent.speed =
        Math.random() * (fishType.speed.max - fishType.speed.min) +
        fishType.speed.min;
      movementComponent.direction = direction;
    }

    if (waveComponent) {
      waveComponent.amplitude = 20 + Math.random() * 30;
      waveComponent.frequency = 0.002 + Math.random() * 0.002;
      waveComponent.initialY = y;
    }

    if (poolComponent) {
      poolComponent.active = true;
    }
  }

  clear(): void {
    this.inactivePools.forEach(pool => {
      pool.forEach(entity => {
        const spriteComponent = entity.getComponent<SpriteComponent>('sprite');
        if (spriteComponent) {
          spriteComponent.sprite.destroy();
        }
      });
    });
    this.inactivePools.clear();
    this.activeEntities = new Map();
  }

  private updateDebugStats(): void {
    if (!this.debugUI) return;

    const stats: PoolStats = {
      totalPools: this.inactivePools.size,
      totalActiveEntities: Array.from(this.activeEntities.values()).reduce(
        (sum, pool) => sum + pool.length,
        0,
      ),
      poolsInfo: {},
    };

    // Calcular stats para cada tipo de pez
    FISH_TYPES.forEach(fishType => {
      const activePool = this.activeEntities.get(fishType.key) || [];
      const inactivePool = this.inactivePools.get(fishType.key) || [];

      stats.poolsInfo[fishType.key] = {
        active: activePool.length,
        total: activePool.length + inactivePool.length,
      };
    });

    // console.log('Current Pool Stats:', stats); // Debug log
    this.debugUI.update(stats);
  }

  // Método para cambiar el modo debug en tiempo de ejecución
  setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
    if (enabled && !this.debugUI) {
      this.debugUI = new PoolDebugUI(this.scene);
      this.debugUI.show();
    } else if (!enabled && this.debugUI) {
      this.debugUI.hide();
    }
  }
}
