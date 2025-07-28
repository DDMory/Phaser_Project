export class MainMenu extends Phaser.Scene {
    constructor() {
      super('MainMenu');
    }
  
    create() {
      const gameWidth = this.scale.width;
      const gameHeight = this.scale.height;
  
      // Título do Jogo
      this.add.text(
        gameWidth / 2,
        gameHeight / 3,
        'Meu Jogo de Batalha',
        {
          fontSize: '72px',
          fill: '#ffffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 6
        }
      ).setOrigin(0.5);
  
      // Botão para "Jogar"
      const playButton = this.add.text(
        gameWidth / 2,
        gameHeight / 2 + 50,
        'Jogar',
        {
          fontSize: '54px',
          fill: '#00FF00',
          fontStyle: 'bold'
        }
      )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          // Ação: Inicia a cena de batalha
          this.scene.start('Start');
        })
        .on('pointerover', () => playButton.setFill('#FFFF00'))
        .on('pointerout', () => playButton.setFill('#00FF00'));
    }
  }
  