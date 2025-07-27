export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');

    this.youLost;
  }

  create() {
    this.youLost = this.add.text(
      1280 / 2 - 500,
      720 - 220,
      'YOU LOST, LOSER!!!'
    );
  }
}
