export class StoryScene extends Phaser.Scene {
    constructor() {
      super('StoryScene');
    }
  
    create() {
      const gameWidth = this.scale.width;
      const gameHeight = this.scale.height;
  
      // 1. Exibe uma mensagem de "Carregando..." enquanto busca a história
      const loadingText = this.add.text(
        gameWidth / 2, 
        gameHeight / 2, 
        'Gerando sua jornada...', 
        { fontSize: '32px', fill: '#cccccc' }
      ).setOrigin(0.5);
  
      // 2. Chama a URL do seu webhook n8n
      //    !! SUBSTITUA PELA SUA URL DE PRODUÇÃO DO N8N !!
      const webhookUrl = 'http://200.130.152.78:5678/webhook/jogos_ddouglas';

      fetch(webhookUrl)
        .then(response => response.json())
        .then(data => {
          // Sucesso! A história foi recebida.
          loadingText.destroy(); // Remove o texto de "Carregando"
          
          // Supondo que o n8n retorna um JSON como { "story": "texto da história" }
          const story = data.history || "Uma jornada inesperada o aguarda...";
          
          this.displayStory(story);
        })
        .catch(error => {
          // Erro! Não foi possível conectar ao n8n.
          console.error('Erro ao buscar a história:', error);
          loadingText.destroy();
          
          // Mostra uma história padrão e continua o jogo
          const defaultStory = "Nobre guerreiro abadonado pelos deuses, sobreviva e prove não precisar de suas benções...";
          this.displayStory(defaultStory);
        });
    }
  
    displayStory(storyText) {
      const gameWidth = this.scale.width;
      const gameHeight = this.scale.height;
  
      // Cria o objeto de texto que vai receber a história
      const storyDisplay = this.add.text(
        gameWidth / 2, 
        gameHeight / 2 - 50, 
        '', // Começa vazio
        { 
          fontSize: '28px', 
          fill: '#ffffff', 
          wordWrap: { width: gameWidth - 100 }, // Quebra de linha automática
          align: 'center'
        }
      ).setOrigin(0.5);
  
      // Efeito de máquina de escrever
      this.typewriteText(storyDisplay, storyText, () => {
        // Este callback é chamado quando o texto termina de ser escrito
        // Cria um botão "Continuar" para ir ao menu principal
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
  
    // Função para o efeito de "máquina de escrever"
    typewriteText(textObject, text, onComplete) {
      const length = text.length;
      let i = 0;
      this.time.addEvent({
        callback: () => {
          textObject.text += text[i];
          i++;
          if (i === length && onComplete) {
            onComplete(); // Chama o callback quando terminar
          }
        },
        repeat: length - 1,
        delay: 50, // Velocidade da digitação (em milissegundos)
      });
    }
  }
  