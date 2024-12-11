import { IComponent } from '@types';

class PositionComponent implements IComponent {
  readonly type = 'position';

  constructor(
    public x: number,
    public y: number,
  ) {}
}

export default PositionComponent;
