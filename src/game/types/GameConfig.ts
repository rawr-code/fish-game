export interface GameConfig {
  canvasID: string;
  width: number;
  height: number;
  backgroundColor: string;
  spawnInterval: number;
  debugSprites: boolean;
  fishSpeed: {
    min: number;
    max: number;
  };
}
