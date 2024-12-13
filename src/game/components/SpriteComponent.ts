import { Component } from './Component';

export class SpriteComponent extends Component {
  public readonly type = 'sprite';

  constructor(public sprite: Phaser.GameObjects.Sprite) {
    super();
  }
}
