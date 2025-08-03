export class StoryScene extends Phaser.Scene {
  constructor() {
    super('StoryScene');
  }

  create() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const loadingText = this.add.text(
      gameWidth / 2, 
      gameHeight / 2, 
      'Gerando sua jornada...', 
      { fontSize: '32px', fill: '#cccccc' }
    ).setOrigin(0.5);

    const webhookUrl = 'https://dougla55ilva.app.n8n.cloud/webhook/phaser-project';

    // ✅ CORREÇÃO: Adiciona o objeto de opções para especificar o método POST
    fetch(webhookUrl, { method: 'POST' })
      .then(response => {
          if (!response.ok) {
              // Se a resposta não for OK, lança um erro para ser apanhado pelo .catch()
              throw new Error('Erro de rede ou servidor: ' + response.status);
          }
          return response.json();
      })
      .then(data => {
        loadingText.destroy();
        
        // O 'data' já deve ser o objeto { history: "..." }
        const story = data.history || "Uma jornada inesperada o aguarda...";
        
        this.displayStory(story);
      })
      .catch(error => {
        console.error('Erro ao buscar a história:', error);
        loadingText.destroy();
        
        // A história default é exibida se o .catch() for ativado
        const defaultStory = "Nobre guerreiro abadonado pelos deuses, sobreviva e prove não precisar de suas benções...";
        this.displayStory(defaultStory);
      });
  }

  displayStory(storyText) {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const storyDisplay = this.add.text(
      gameWidth / 2, 
      gameHeight / 2 - 50, 
      '',
      { 
        fontSize: '28px', 
        fill: '#ffffff', 
        wordWrap: { width: gameWidth - 100 },
        align: 'center'
      }
    ).setOrigin(0.5);

    this.typewriteText(storyDisplay, storyText, () => {
      const continueButton = this.add.text(
        gameWidth / 2,
        gameHeight - 100,
        'Continuar',
        { fontSize: '42px', fill: '#00FF00', fontStyle: 'bold' }
      )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.scene.start('MainMenu'))
        .on('pointerover', () => continueButton.setFill('#FFFF00'))
        .on('pointerout', () => continueButton.setFill('#00FF00'));
    });
  }

  typewriteText(textObject, text, onComplete) {
    const length = text.length;
    let i = 0;
    this.time.addEvent({
      callback: () => {
        textObject.text += text[i];
        i++;
        if (i === length && onComplete) {
          onComplete();
        }
      },
      repeat: length - 1,
      delay: 50,
    });
  }
}
