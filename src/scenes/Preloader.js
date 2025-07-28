export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
   
    preload() {
        // Carrega todos os spritesheets
        this.load.spritesheet('purple_knight', '../../assets/Warrior_Purple.png', { frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('meat','../../assets/M_Spawn.png', {frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('torch', '../../assets/Torch_Yellow.png', {frameWidth: 192, frameHeight: 192 });
        this.load.spritesheet('pawn_red', '../../assets/Pawn_Red.png', {frameWidth: 192, frameHeight: 192 });
    }
    
    create() {
        // --- Animações do Jogador ---
        this.anims.create({
            key: 'idle_purple_knight',
            frames: this.anims.generateFrameNames('purple_knight', {start:0 ,end: 5}),
            frameRate: 8,
            repeat: -1,
            yoyo: true
        });
        this.anims.create({
            key: 'attack_purple_knight',
            frames: this.anims.generateFrameNames('purple_knight', {start:12 ,end: 17}),
            frameRate: 12
        });
        this.anims.create({
            key: 'walking_purple_knight',
            frames: this.anims.generateFrameNames('purple_knight', {start:6 ,end: 11}),
            frameRate: 10,
            yoyo: true
        });

        // --- Animações do Inimigo 'torch' ---
        this.anims.create({
            key: 'idle_torch',
            frames: this.anims.generateFrameNames('torch', {start: 0, end: 6}),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: 'walking_torch',
            frames: this.anims.generateFrameNames('torch',{start: 7, end: 12}),
            frameRate: 10,
            yoyo: true
        });
        this.anims.create({
            key: 'attack_torch',
            frames: this.anims.generateFrameNames('torch', {start: 14, end: 19}),
            frameRate: 8,
        });

        // --- Animações do Inimigo 'pawn_red' ---
        this.anims.create({
            key: 'idle_pawn_red',
            frames: this.anims.generateFrameNames('pawn_red', {start: 0, end: 5}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walking_pawn_red',
            frames: this.anims.generateFrameNames('pawn_red', {start: 6, end: 11}),
            frameRate: 10,
            yoyo: true
        });
        this.anims.create({
            key: 'attack_pawn_red',
            frames: this.anims.generateFrameNames('pawn_red', {start: 12, end: 17}),
            frameRate: 12
        });

        // --- Animação do Item de Cura ---
        this.anims.create({
            key: 'meat',
            frames: this.anims.generateFrameNames('meat', {start:0 ,end: 6}),
            frameRate: 14
        });

        // Inicia o Menu Principal após carregar tudo
        this.scene.start('MainMenu');
    }
}
