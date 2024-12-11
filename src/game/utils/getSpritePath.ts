import { ASSETS } from '@constants';

const getSpritePath = (spriteKey: string) => {
  return `${ASSETS.CONFIG.SPRITE.prefix}${spriteKey}${ASSETS.CONFIG.SPRITE.suffix}`;
};

export default getSpritePath;
