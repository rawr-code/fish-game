import { Scene } from 'phaser';
import { Entity } from '@entities';

export abstract class System {
  constructor(protected scene: Scene) {}
  abstract update(entities: Entity[], delta: number): void;
}
