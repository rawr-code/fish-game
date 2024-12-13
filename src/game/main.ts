import { defaultGameConfig } from '@config';

const StartGame = (parent: string) => {
  return new Phaser.Game({ ...defaultGameConfig, parent });
};

export default StartGame;
