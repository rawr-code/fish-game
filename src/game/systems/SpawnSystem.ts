import { Scene } from 'phaser';
import { Entity } from '@entities';
import { GameConfig } from '@types';
import { FISH_TYPES } from '@constants';

import { System } from './System';
import { PoolingSystem } from './PoolingSystem';

export class SpawnSystem extends System {
  private spawnTimer: number = 0;
  private readonly config: GameConfig;
  private poolingSystem: PoolingSystem;

  constructor(scene: Scene, config: GameConfig, poolingSystem: PoolingSystem) {
    super(scene);
    this.config = config;
    this.poolingSystem = poolingSystem;
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

    // Usar el poolingSystem para obtener una entidad
    const fish = this.poolingSystem.acquireEntity(fishType, x, y, direction);

    // Es crucial añadir la entidad al array de entities
    if (fish) {
      entities.push(fish);
    }
  }
}
