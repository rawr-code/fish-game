import { Entity } from '@entities';

import { Component } from './Component';
import { SpriteComponent } from './SpriteComponent';
import { WaveMovementComponent } from './WaveMovementComponent';

export class MovementComponent extends Component {
  public readonly type = 'movement';

  constructor(
    public speed: number,
    public direction: 'left' | 'right',
  ) {
    super();
  }

  update(entities: Entity[], delta: number): void {
    entities.forEach(entity => {
      if (entity.hasComponents(['movement', 'sprite'])) {
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
      }
    });
  }
}
