export interface GameConfig {
  canvasID: string;
  width: number;
  height: number;
  backgroundColor: string;
  spawnInterval: number;
  fishSpeed: {
    min: number;
    max: number;
  };
}
