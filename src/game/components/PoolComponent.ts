export class PoolComponent {
  public readonly type = 'pool';

  public active: boolean;
  public fishType: string;

  constructor(fishType: string) {
    this.active = false;
    this.fishType = fishType;
  }
}
