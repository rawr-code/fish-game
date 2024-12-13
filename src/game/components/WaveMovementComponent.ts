import { Component } from './Component';

export class WaveMovementComponent extends Component {
  public readonly type = 'waveMovement';

  constructor(
    public amplitude: number = 50,
    public frequency: number = 0.002,
    public initialY: number = 0,
    public offset: number = Math.random() * Math.PI * 2,
  ) {
    super();
  }
}
