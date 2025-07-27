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
  }

  create() {
    this.adicionarObjetos();

    // ✅ O 'while' foi removido. Os listeners são adicionados apenas uma vez.
    this.action_attack.on('pointerdown', () => {
      if (this.currentTurn !== 'PLAYER' || this.onAction) {
        return;
      }


      this.onAction = true;
      this.disableAllActions();
      
      this.player.attack(this.enemy, () => {
        this.currentTurn = 'ENEMY';
        this.time.delayedCall(500, this.handleEnemyTurn, [], this);
      });
    });

    this.action_defense.on('pointerdown', () => {
      if (this.onAction) return;
      this.onAction = true;
      this.disableAllActions();
      this.player.defense(() => {
        this.onAction = false;
        this.enableAllActions();
      });
    });

    this.action_heal.on('pointerdown', () => {
      if (this.onAction) return;
      this.onAction = true;
      this.disableAllActions();
      this.player.heal(() => {
        this.onAction = false;
        this.enableAllActions();
      });
    });
  }

  update() {
    if (this.player && !this.player.active) {
      this.scene.start('GameOver');
    }
  }

  adicionarObjetos() {
    this.player = new Player(this, 1280 / 2 - 320, 720 / 2, 0);

    //seletor de inimigo
    var enemyKey = Math.floor(Math.random() * 2);

    if(enemyKey ==  1)
      this.enemy = new Enemy(this, 1280 / 2 + 320, 720 / 2, 0, 'torch');
    if(enemyKey ==  0)
      this.enemy = new Enemy(this, 1280 / 2 + 320, 720 / 2, 0, 'pawn_red');

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
}
