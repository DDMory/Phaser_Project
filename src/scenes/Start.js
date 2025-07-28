import { Player } from '../gameObjects/Player.js';
import { Enemy } from '../gameObjects/Enemy.js';

export class Start extends Phaser.Scene {
  constructor() {
    super('Start');

    this.player;
    this.enemy;
    this.action_attack;
    this.action_defense;
    this.action_heal;
    this.onAction = false;
    this.currentTurn = 'PLAYER';
    this.defenseSelected = false;
    this.score = 0;
    this.scoreText
  }

  create() {
    //Geração 
    this.createScenario();
    this.summomCharacters();
    this.generateUI();
   
    //Eventos/Gatilhos
    this.events.on('enemy-defeated', this.updateScore, this);
    this.events.on('enemy-defeated', this.choiceDialog, this);
  }

  //metodo update
  update() {

    //verificar se o player morreu
    if (this.player && !this.player.active) {
      this.scene.start('GameOver');
    }
  }

  //geração de elementos visuais
  generateUI(){
    
    this.scoreText = this.add.text(16, 16, 'Pontos: 0', {
      fontSize: '72px',
      fill: '#ffffff',
      fontFamily: 'Brush Script ', 
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
  
      }
    );

    this.action_attack.on('pointerdown', () => {
      if (this.currentTurn !== 'PLAYER' || this.onAction) return;
      this.onAction = true;
      this.disableAllActions();
      
      this.player.attack(this.enemy, () => {
        this.currentTurn = 'ENEMY';
        this.time.delayedCall(500, this.handleEnemyTurn, [], this);
      });
    });

    this.action_defense.on('pointerdown', () => {
      if (this.currentTurn !== 'PLAYER' || this.onAction) return;
      
      this.onAction = true;
      this.defenseSelected = true;
      this.player.isDefending = true;
      this.disableAllActions();
      this.passTurnToEnemy();
    
    });

    this.action_heal.on('pointerdown', () => {
      if (this.currentTurn !== 'PLAYER' || this.onAction) return;

      this.onAction = true;
      this.disableAllActions();

      this.player.heal(() => {
        this.passTurnToEnemy();
      });
    });
  }

  //geração do cenario
  createScenario(){
    const map = this.make.tilemap({key: "map"})
    const tileset = map.addTilesetImage("water", "tiles");
    const belowLayer = map.createLayer("camada_agua", tileset, 0, 0);
  }
  
  //atualizar pontuação
  updateScore(points) {
    this.score += points;
    this.scoreText.setText('Pontos: ' + this.score);
  }

  //Inocar os personagens no começo de tudo
  summomCharacters() {
    this.player = new Player(this, 1280 / 2 - 320, 720 / 2, 0);
    this.spawnNewEnemy()

    this.action_attack = this.add
      .text(1280 / 2 - 500, 720 - 220, 'Attack!!!')
      .setInteractive();
    this.action_defense = this.add
      .text(1280 / 2, 720 - 220, 'Defese!!!')
      .setInteractive();
    this.action_heal = this.add
      .text(1280 / 2 + 500, 720 - 220, 'Heal!!!')
      .setInteractive();
  }

  //desativas botões
  disableAllActions() {
    this.action_attack.disableInteractive().setColor('#555');
    this.action_defense.disableInteractive().setColor('#555');
    this.action_heal.disableInteractive().setColor('#555');
  }

  //ativar botões
  enableAllActions() {
    this.action_attack.setInteractive().setColor('#FFF');
    this.action_defense.setInteractive().setColor('#FFF');
    this.action_heal.setInteractive().setColor('#FFF');
  }

  //passar turno para inimigo
  passTurnToEnemy() {
    this.currentTurn = 'ENEMY';
    this.time.delayedCall(500, this.handleEnemyTurn, [], this);
  }

  //IA do inimigo - pode curar ou atacar
  handleEnemyTurn() {
    if (this.player.active && this.enemy.active) {
      
      var actionPercent = Math.random();
      if(actionPercent <= 0.65){
        this.enemy.attack(this.player, () => {
          
          this.currentTurn = 'PLAYER'; 
          this.onAction = false;       
          this.enableAllActions();  

        });
      }else if(actionPercent > 0.65 && this.enemy.health < Math.floor(this.enemy.health / 0.35)){
        this.enemy.heal();

        this.currentTurn = 'PLAYER'; 
        this.onAction = false;       
        this.enableAllActions();     
      }
    } else {
      this.onAction = false;
      this.enableAllActions();
    }
  }
  
  //Dialogo 1: roxima luta ou descansar ?
  choiceDialog() {
    this.disableAllActions();
  
    this.time.delayedCall(500, () => {
  
      const dialogBackground = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 600, 200, 0x000000, 0.8).setStrokeStyle(2, 0xffffff);
  
      const questionText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 40, 'Inimigo derrotado! O que deseja fazer?', { fontSize: '24px', fill: '#FFF' }).setOrigin(0.5);
  
      const nextButton = this.add.text(this.scale.width / 2 - 150, this.scale.height / 2 + 40, 'Próximo Inimigo', { fontSize: '28px', fill: '#00FF00' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.currentTurn = 'PLAYER';
          this.onAction = false;
          
          this.spawnNewEnemy();       
          this.enableAllActions();   
          this.destroyChoiceDialog(); 
        });
  
      
      const restButton = this.add.text(this.scale.width / 2 + 150, this.scale.height / 2 + 40, 'Descansar (Curar)', { fontSize: '28px', fill: '#FFFF00' })
        .setOrigin(0.5)
        .setInteractive()
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
  
  //Destruir o Dialogo 1
  destroyChoiceDialog() {
    if (this.choiceDialogElements) {
      this.choiceDialogElements.clear(true, true);
    }
  }

  //sumonar novo inimigo
  spawnNewEnemy() {
    const enemyKey = Math.random() < 0.5 ? 'torch' : 'pawn_red';
    this.enemy = new Enemy(this, 1280 / 2 + 320, 720 / 2, 0, enemyKey);
  }
  
}
