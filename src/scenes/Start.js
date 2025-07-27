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
  }

  create() {
    this.adicionarObjetos();

    // ✅ O 'while' foi removido. Os listeners são adicionados apenas uma vez.
    this.action_attack.on('pointerdown', () => {
      if (this.onAction) {
        return;
      }

      /*
      this.onAction = true;
      this.disableAllActions();
      this.player.attack(this.enemy, () => {
        this.onAction = false;
        this.enableAllActions();
      });*/

      this.enemy.attack(this.player);
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
    this.enemy = new Enemy(this, 1280 / 2 + 320, 720 / 2, 0);

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
}
