import { MovementComponent, PositionComponent } from '@components';
import { Entity } from '@entities';
import { ISystem } from '@types';

class MovementSystem implements ISystem {
  private entities: Entity[] = [];

  addEntity(entity: Entity): void {
    if (entity.hasComponent('position') && entity.hasComponent('movement')) {
      this.entities.push(entity);
    }
  }

  update(deltaTime: number): void {
    this.entities.forEach(entity => {
      const position = entity.getComponent<PositionComponent>('position');
      const movement = entity.getComponent<MovementComponent>('movement');

      if (position && movement) {
        position.x += movement.velocityX * (deltaTime / 1000);
        position.y += movement.velocityY * (deltaTime / 1000);
      }
    });
  }
}

export default MovementSystem;
