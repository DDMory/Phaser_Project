import ASSETS from '../assets.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, knightId) {
    super(scene, x, y, ASSETS.spritesheet.knight.key, knightId);
    scene.add.existing(this);

    this.scene = scene;
    this.health = 20;
    this.strength = 5;

    this.isAttacking = false;
    this.isDefending = false;
    this.isHealing = false;

    this.originalX = x;
    this.originalY = y;

    this.play('idle_knight');
  }

  attack = (target, onCompleteCallback) => {
    if (this.isAttacking) return;
    this.isAttacking = true;

    this.scene.tweens.add({
      targets: this,
      x: target.x - 80,
      duration: 400,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        target.takeHit(this.strength);
        this.play('attack_knight');

        this.once('animationcomplete-attack_knight', () => {
          this.scene.tweens.add({
            targets: this,
            x: this.originalX,
            duration: 400,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              this.isAttacking = false;
              this.play('idle_knight');

              if (onCompleteCallback) onCompleteCallback();
            },
          });
        });
      },
    });
  };

  defense = (onCompleteCallback) => {
    if (this.isDefending) return;
    this.isDefending = true;

    this.play('walking_knight');
    this.scene.tweens.add({
      targets: this,
      x: this.x - 100,
      duration: 300,
      ease: 'Sine.easeInOut',
      yoyo: true,
      onComplete: () => {
        this.isDefending = false;
        this.play('idle_knight');

        if (onCompleteCallback) onCompleteCallback();
      },
    });
  };

  heal = (onCompleteCallback) => {
    if (this.isHealing) return;
    this.isHealing = true;

    const meatSprite = this.scene.add.sprite(
      this.originalX,
      this.originalY - 100,
      'meat'
    );
    meatSprite.play('meat');

    this.scene.tweens.add({
      targets: meatSprite,
      y: this.originalY,
      duration: 600,
      ease: 'Linear',
      onComplete: () => {
        if (this.health < 20) this.health += 5;
        else this.health = 20;

        meatSprite.destroy();
        this.isHealing = false;
        this.showText('+5', 0x00ff00);

        if (onCompleteCallback) onCompleteCallback();
      },
    });
  };

  takeHit = (damage) => {
    this.health -= damage;
    this.showText(`-${damage}`, 0xff0000);

    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.5 },
      duration: 100,
      yoyo: true,
    });

    if (this.health <= 0) {
      this.health = 0;
      this.destroy();
    }
  };

  showText = (text, color) => {
    const damageText = this.scene.add
      .text(this.x, this.y - 100, text, {
        fontSize: '50px',
        color: Phaser.Display.Color.ValueToColor(color).rgba,
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 50,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.easeOut',
      onComplete: () => damageText.destroy(),
    });
  };
}
