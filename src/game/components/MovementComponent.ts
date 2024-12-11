import { IComponent } from '@types';

class MovementComponent implements IComponent {
  readonly type = 'movement';

  constructor(
    public velocityX: number = 0,
    public velocityY: number = 0,
    public speed: number = 100,
  ) {}
}

export default MovementComponent;
