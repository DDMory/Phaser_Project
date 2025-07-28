import { Player } from '../gameObjects/Player.js';
import { Enemy } from '../gameObjects/Enemy.js';

export class Start extends Phaser.Scene {
  constructor() {
    super('Start');

    // Propriedades da cena, resetadas a cada reinício
    this.player;
    this.enemy;
    this.action_attack;
    this.action_defense;
    this.action_heal;
    
    // Controle de estado do jogo
    this.onAction = false;
    this.currentTurn = 'PLAYER';
    
    // Sistema de Pontuação
    this.score = 0;
    this.scoreText;

    // Elementos do diálogo
    this.choiceDialogElements;
  }

  init() {
    this.onAction = false;
    this.currentTurn = 'PLAYER';
    this.score = 0;
  }

  create() {
    // --- Configuração Inicial ---
    this.score = 0; // Garante que a pontuação zere ao reiniciar
    this.currentTurn = 'PLAYER'; // Garante que o turno comece com o jogador
    
    this.adicionarObjetos();
     // Cria o primeiro inimigo

    // --- Ouvintes de Eventos ---
    this.events.on('enemy-defeated', this.updateScore, this);
    this.events.on('enemy-defeated', this.showChoiceDialog, this);
  }

  shutdown() {
    this.events.off('enemy-defeated', this.updateScore, this);
    this.events.off('enemy-defeated', this.showChoiceDialog, this);
  }

  update() {
    // Verifica constantemente se o jogador foi derrotado
    if (this.player && !this.player.active) {
      this.scene.start('GameOver');
    }
  }

  // --- Métodos de Gerenciamento de Jogo ---

  adicionarObjetos() {
    this.player = new Player(this, 1280 / 2 - 320, 720 / 2, 0, 'purple_knight');
    this.spawnNewEnemy();
    
    this.scoreText = this.add.text(16, 16, 'Pontos: 0', { fontSize: '32px', fill: '#FFF' });

    this.action_attack = this.add.text(1280 / 2 - 500, 720 - 220, 'Attack!!!').setInteractive();
    this.action_defense = this.add.text(1280 / 2, 720 - 220, 'Defese!!!').setInteractive();
    this.action_heal = this.add.text(1280 / 2 + 500, 720 - 220, 'Heal!!!').setInteractive();

    this.action_attack.on('pointerdown', () => {
      if (this.currentTurn !== 'PLAYER' || this.onAction) return;
      this.onAction = true;
      this.disableAllActions();
      this.player.attack(this.enemy, () => this.passTurnToEnemy());
    });

    this.action_defense.on('pointerdown', () => {
      if (this.currentTurn !== 'PLAYER' || this.onAction) return;
      this.onAction = true;
      this.player.isDefending = true;
      this.disableAllActions();
      this.passTurnToEnemy();
    });

    this.action_heal.on('pointerdown', () => {
      if (this.currentTurn !== 'PLAYER' || this.onAction) return;
      this.onAction = true;
      this.disableAllActions();
      this.player.heal(() => this.passTurnToEnemy());
    });
  }

  spawnNewEnemy() {
    if (this.enemy) {
        this.enemy.destroy();
    }
    const enemyKey = Math.random() < 0.5 ? 'torch' : 'pawn_red';
    this.enemy = new Enemy(this, 1280 / 2 + 320, 720 / 2, 0, enemyKey);
  }

  passTurnToEnemy() {
    this.currentTurn = 'ENEMY';
    this.time.delayedCall(500, this.handleEnemyTurn, [], this);
  }

  handleEnemyTurn() {
    if (!this.player.active || !this.enemy.active) {
        this.onAction = false;
        this.enableAllActions();
        return;
    }
    
    const canHeal = this.enemy.health < this.enemy.maxHealth;
    const actionPercent = Math.random();

    if (actionPercent <= 0.75 || !canHeal) {
      this.enemy.attack(this.player, () => {
        this.currentTurn = 'PLAYER';
        this.onAction = false;
        this.enableAllActions();
      });
    } else {
      this.enemy.heal(() => {
        this.currentTurn = 'PLAYER';
        this.onAction = false;
        this.enableAllActions();
      });
    }
  }
  
  // --- Métodos de UI e Eventos ---

  updateScore(points) {
    this.score += points;
    this.scoreText.setText('Pontos: ' + this.score);
  }

  showChoiceDialog() {
    this.disableAllActions();
    this.time.delayedCall(500, () => {
      const dialogBackground = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 600, 200, 0x000000, 0.8).setStrokeStyle(2, 0xffffff);
      const questionText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 40, 'Inimigo derrotado! O que deseja fazer?', { fontSize: '24px', fill: '#FFF' }).setOrigin(0.5);
      
      const nextButton = this.add.text(this.scale.width / 2 - 150, this.scale.height / 2 + 40, 'Próximo Inimigo', { fontSize: '28px', fill: '#00FF00' }).setOrigin(0.5).setInteractive()
        .on('pointerdown', () => {
          this.currentTurn = 'PLAYER';
          this.onAction = false;
          this.destroyChoiceDialog();
          this.spawnNewEnemy();
          this.enableAllActions();
        });
      
      const restButton = this.add.text(this.scale.width / 2 + 150, this.scale.height / 2 + 40, 'Descansar (Curar)', { fontSize: '28px', fill: '#FFFF00' }).setOrigin(0.5).setInteractive()
        .on('pointerdown', () => {
          this.currentTurn = 'PLAYER';
          this.onAction = false;
          this.destroyChoiceDialog();
          this.player.heal(() => {
            this.spawnNewEnemy();
            this.enableAllActions();
          });
        });
        
      this.choiceDialogElements = this.add.group([dialogBackground, questionText, nextButton, restButton]);
    });
  }

  destroyChoiceDialog() {
    if (this.choiceDialogElements) {
      this.choiceDialogElements.clear(true, true);
    }
  }

  disableAllActions() {
    this.action_attack.disableInteractive().setColor('#555');
    this.action_defense.disableInteractive().setColor('#555');
    this.action_heal.disableInteractive().setColor('#555');
  }

  enableAllActions() {
    this.action_attack.setInteractive().setColor('#FFF');
    this.action_defense.setInteractive().setColor('#FFF');
    this.action_heal.setInteractive().setColor('#FFF');
  }
}
