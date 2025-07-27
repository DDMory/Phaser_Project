export class Preloader extends Phaser.Scene
{

    constructor(){
        super('Preloader');
    }
   
    preload(){
        this.load.spritesheet('purple_knight', '../../assets/Warrior_Purple.png', { frameWidth: 192, frameHeight: 192 }),
        this.load.spritesheet('meat','../../assets/M_Spawn.png', {frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('torch', '../../assets/Torch_Yellow.png', {frameWidth: 192, frameHeight: 192 })
    }

    create() {

        //Animações
            //Player
        this.anims.create({
            key: 'idle_knight',
            frames: this.anims.generateFrameNames('purple_knight', {start:0 ,end: 5}),
            yoyo: true,
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'attack_knight',
            frames: this.anims.generateFrameNames('purple_knight', {start:12 ,end: 17}),
            framerate: 20
        })

        this.anims.create({
            key: 'walking_knight',
            frames: this.anims.generateFrameNames('purple_knight', {start:6 ,end: 11}),
            yoyo: true,
            framerate: 10
        })

            //Torch
        this.anims.create({
            key: 'idle_torch',
            frames: this.anims.generateFrameNames('torch', {start: 0, end: 6}),
            yoyo:false,
            frameRate: 8,
            repeat: -1,
        })

        this.anims.create({
            key: 'walking_torch',
            frames: this.anims.generateFrameNames('torch',{start: 7, end: 12}),
            yoyo: true,
            framerate: 10
        })
        
        this.anims.create({
            key: 'attack_torch',
            frames: this.anims.generateFrameNames('torch', {start: 14, end: 19}),
            yoyo:false,
            frameRate: 8,
        })

            //Meat
        this.anims.create({
            key: 'meat',
            frames: this.anims.generateFrameNames('meat', {start:0 ,end: 6}),
            frameRate: 14
            
        })

        //Trocar de cena
        this.scene.start('Start')
    }

}