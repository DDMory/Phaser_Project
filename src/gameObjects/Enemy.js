export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, enemyID, spriteKey) {
    super(scene, x, y, spriteKey, enemyID);
    scene.add.existing(this);

    this.spriteKey = spriteKey;
    this.scene = scene;

    this.health = 10;
    this.maxHealth = 10;
    this.strength = 3;

    this.isAttacking = false;
    this.isDefending = false;
    this.isHealing = false;

    this.flipX = true;
    this.originalX = x;
    this.originalY = y;

    this.play('idle_' + this.spriteKey);
  }

  attack = (target, onCompleteCallback) => {
    if (this.isAttacking) return;
    this.isAttacking = true;

    const criticalChance = 0.25;
    const criticalMultiplier = 1.5;
    let finalDamage = this.strength;
    let isCritical = Math.random() < criticalChance;

    if (isCritical) {
      finalDamage = this.strength * criticalMultiplier;
    }

    this.scene.tweens.add({
      targets: this,
      x: target.x + 80,
      duration: 400,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        if (target.isDefending) {
          target.defense();
          target.showText('Defendido!', '#00BFFF');
          target.isDefending = false;
        } else {
          if (isCritical) {
            this.scene.cameras.main.shake(250, 0.015);
          }
          target.takeHit(finalDamage);
        }

        const attackAnim = 'attack_' + this.spriteKey;
        this.play(attackAnim);

        this.once('animationcomplete-' + attackAnim, () => {
          this.scene.tweens.add({
            targets: this,
            x: this.originalX,
            duration: 400,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              this.isAttacking = false;
              this.play('idle_' + this.spriteKey);
              if (onCompleteCallback) onCompleteCallback();
            },
          });
        });
      },
    });
  };

  takeHit = (damage) => {
    const dodgeChance = 0.45;
    if (Math.random() < dodgeChance) {
      this.defense();
      this.showText('Esquivou!', '#ffd700');
      return;
    }

    this.health -= damage;
    this.showText(`-${damage}`, '#ff0000');

    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.5 },
      duration: 100,
      yoyo: true,
    });

    if (this.health <= 0) {
      this.health = 0;
      this.scene.events.emit('enemy-defeated', 150);
      this.destroy();
    }
  };

  defense = (onCompleteCallback) => {
    if (this.isDefending) {
        if(onCompleteCallback) onCompleteCallback();
        return;
    }
    this.isDefending = true;

    this.play('walking_' + this.spriteKey);
    this.scene.tweens.add({
      targets: this,
      x: this.x + 100,
      duration: 300,
      ease: 'Sine.easeInOut',
      yoyo: true,
      onComplete: () => {
        this.isDefending = false;
        this.play('idle_' + this.spriteKey);
        if (onCompleteCallback) onCompleteCallback();
      },
    });
  };

  heal = (onCompleteCallback) => {
    if (this.isHealing) return;
    this.isHealing = true;

    const meatSprite = this.scene.add.sprite(this.originalX, this.originalY - 100, 'meat').play('meat');
    this.scene.tweens.add({
      targets: meatSprite,
      y: this.originalY,
      duration: 600,
      ease: 'Linear',
      onComplete: () => {
        this.health = Math.min(this.maxHealth, this.health + 5);
        meatSprite.destroy();
        this.isHealing = false;
        this.showText('+5', '#00ff00');
        if (onCompleteCallback) onCompleteCallback();
      },
    });
  };

  showText = (text, color) => {
    const damageText = this.scene.add.text(this.x, this.y - 100, text, {
      fontSize: '24px',
      fill: color,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(10);

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
