import { Scene } from 'phaser';
import { ASSETS } from '@constants';

const loadAtlas = (scene: Scene) => {
  scene.load.atlasXML(
    ASSETS.ATLAS.KEY,
    [ASSETS.CONFIG.PATH, ASSETS.ATLAS.PATH, ASSETS.ATLAS.TEXTURE].join('/'),
    [ASSETS.CONFIG.PATH, ASSETS.ATLAS.PATH, ASSETS.ATLAS.FILE].join('/'),
  );
};

export default loadAtlas;
