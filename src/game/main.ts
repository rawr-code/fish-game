import { GameConfig } from '@config';

const StartGame = (parent: string) => {
  return new Phaser.Game({ ...GameConfig, parent });
};

export default StartGame;
