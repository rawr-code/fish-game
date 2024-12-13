import { Entity } from '@entities';
import {
  MovementComponent,
  SpriteComponent,
  WaveMovementComponent,
} from '@components';
import { System } from './System';

export class MovementSystem extends System {
  update(entities: Entity[], delta: number): void {
    entities.forEach(entity => {
      if (entity.hasComponent('movement') && entity.hasComponent('sprite')) {
        const movement = entity.getComponent<MovementComponent>('movement');
        const spriteComponent = entity.getComponent<SpriteComponent>('sprite');
        const waveMovement =
          entity.getComponent<WaveMovementComponent>('waveMovement');

        if (!movement || !spriteComponent) return;

        const { sprite } = spriteComponent;
        const { direction, speed } = movement;

        // Movimiento horizontal
        const distance = speed * (delta / 16.666667);
        if (direction === 'right') {
          sprite.x += distance;
          sprite.setFlipX(false);
        } else {
          sprite.x -= distance;
          sprite.setFlipX(true);
        }

        // Movimiento ondulante
        if (waveMovement) {
          const { amplitude, frequency, initialY, offset } = waveMovement;
          sprite.y =
            initialY + Math.sin(sprite.x * frequency + offset) * amplitude;
        }

        // Redondear las posiciones para evitar el antialiasing no deseado
        sprite.x = Math.round(sprite.x);
        sprite.y = Math.round(sprite.y);
      }
    });
  }
}
