import { DEFAULT_GAME_CONFIG } from '@config';

export interface PoolStats {
  totalPools: number;
  totalActiveEntities: number;
  poolsInfo: {
    [key: string]: {
      active: number;
      total: number;
    };
  };
}

const COLORS = {
  background: 0x000000,
  border: 0x00ff00,
  title: '#00ff00',
  text: '#ffffff',
  warning: '#ffff00',
  critical: '#ff0000',
};

const STYLES = {
  title: {
    fontSize: '16px',
    color: COLORS.title,
    fontFamily: 'monospace',
    backgroundColor: '#00000000',
  },
  text: {
    fontSize: '12px',
    color: COLORS.text,
    fontFamily: 'monospace',
    backgroundColor: '#00000000',
  },
};

export class PoolDebugUI {
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private texts: Phaser.GameObjects.Text[] = [];
  private scene: Phaser.Scene;
  private isVisible: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Crear el contenedor en una posición fija
    this.container = scene.add.container(10, 10);

    // Crear el fondo con posición relativa al contenedor
    this.background = scene.add.rectangle(100, 75, 200, 150, 0x000000, 0.7);

    // Título
    const title = scene.add.text(20, 10, 'Pool Debug', {
      fontSize: '16px',
      color: '#00ff00',
      fontFamily: 'monospace',
      backgroundColor: '#00000000',
    });

    // Añadir elementos al contenedor
    this.container.add([this.background, title]);

    // Asegurar que esté por encima de todo
    this.container.setDepth(9999);

    // // Añadir un borde al debug panel para mejor visibilidad
    // const border = scene.add.rectangle(100, 75, 200, 230);
    // border.setStrokeStyle(1, 0x00ff00);
    // this.container.add(border);
  }

  update(stats: PoolStats): void {
    // Limpiar textos anteriores
    this.texts.forEach(text => text.destroy());
    this.texts = [];

    let yPosition = 40;

    // Estadísticas generales
    this.addDebugText(`Total Pools: ${stats.totalPools}`, yPosition);
    yPosition += 20;
    this.addDebugText(`Total Active: ${stats.totalActiveEntities}`, yPosition);
    yPosition += 20;

    // Estadísticas por tipo
    Object.entries(stats.poolsInfo).forEach(([key, info]) => {
      this.addDebugText(`${key}: ${info.active}/${info.total}`, yPosition);
      yPosition += 20;
    });

    // Ajustar el tamaño del fondo basado en el contenido
    const height = yPosition + 30;
    const width = 250;
    this.background.setSize(width, height);
    this.background.setPosition(width / 2, height / 2);

    // Añadir indicadores de estado
    if (stats.totalActiveEntities > DEFAULT_GAME_CONFIG.maxPoolSize) {
      this.background.setSize(width, height + 20);
      this.background.setPosition(width / 2, (height + 20) / 2);

      this.addDebugText(`WARNING: High entity count!`, yPosition, {
        ...STYLES.text,
        color: COLORS.warning,
      });
      yPosition += 20;
    }

    // Mostrar tasa de reciclaje
    const recycleRate = (
      (stats.totalActiveEntities /
        Object.values(stats.poolsInfo).reduce(
          (acc, curr) => acc + curr.total,
          0,
        )) *
      100
    ).toFixed(1);

    this.addDebugText(`Recycle Rate: ${recycleRate}%`, yPosition);
  }

  private addDebugText(
    content: string,
    yPosition: number,
    style = STYLES.text,
  ): void {
    const text = this.scene.add.text(20, yPosition, content, style);

    // Añadir un efecto hover
    text.setInteractive();
    text.on('pointerover', () => {
      text.setColor('#ffff00');
    });
    text.on('pointerout', () => {
      text.setColor(style.color);
    });

    this.container.add(text);
    this.texts.push(text);
  }

  show(): void {
    this.container.setVisible(true);
    this.isVisible = true;
  }

  hide(): void {
    this.container.setVisible(false);
    this.isVisible = false;
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
