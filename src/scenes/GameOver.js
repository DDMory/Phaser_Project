export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.7).setOrigin(0);

    this.add.text(
      gameWidth / 2, 
      gameHeight / 4,
      'Você foi derrotado!',
      { 
        fontSize: '64px', 
        fill: '#ff4d4d',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);

    const quitButton = this.add.text(
      gameWidth / 2, 
      gameHeight / 2 + 100, 
      'Desistir', 
      { fontSize: '42px', fill: '#cccccc', fontStyle: 'bold' }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MainMenu');
      })
      .on('pointerover', () => quitButton.setFill('#ff4d4d'))
      .on('pointerout', () => quitButton.setFill('#cccccc')); 

    const retryButton = this.add.text(
      gameWidth / 2, 
      gameHeight / 2, 
      'Tentar Novamente', 
      { fontSize: '42px', fill: '#ffffff', fontStyle: 'bold' }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('Start');
      })
      .on('pointerover', () => retryButton.setFill('#FFFF00'))
      .on('pointerout', () => retryButton.setFill('#ffffff'));
  }
}
