import { Scene } from 'phaser';

export const generateBackgroundGradient = (scene: Scene) => {
  const width = scene.cameras.main.width;
  const height = scene.cameras.main.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const gradient = ctx?.createLinearGradient(0, 0, 0, height);

  //   gradient.addColorStop(0, '#87CEEB');
  //   gradient.addColorStop(1, '#4FB3E8');

  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.5, '#ADD8E6');
  gradient.addColorStop(1, '#B0E0E6');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  scene.textures.addCanvas('background', canvas);
  scene.add.image(width / 2, height / 2, 'background');
};
