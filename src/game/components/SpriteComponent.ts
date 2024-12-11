import { IComponent } from '@types';

class SpriteComponent implements IComponent {
  readonly type = 'sprite';

  constructor(public sprite: Phaser.GameObjects.Sprite) {}
}

export default SpriteComponent;
