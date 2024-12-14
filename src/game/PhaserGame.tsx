import { forwardRef, useLayoutEffect, useRef } from 'react';
import { DEFAULT_GAME_CONFIG } from '@config';

import StartGame from './main';

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  function PhaserGame(_, ref) {
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() => {
      if (game.current === null) {
        game.current = StartGame(DEFAULT_GAME_CONFIG.canvasID);

        if (typeof ref === 'function') {
          ref({ game: game.current, scene: null });
        } else if (ref) {
          ref.current = { game: game.current, scene: null };
        }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true);
          if (game.current !== null) {
            game.current = null;
          }
        }
      };
    }, [ref]);

    return (
      <div
        id={DEFAULT_GAME_CONFIG.canvasID}
        style={{
          display: 'flex',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      />
    );
  },
);
