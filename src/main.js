import { Preloader } from './scenes/Preloader.js';
import { MainMenu } from './scenes/MainMenu.js';
import { Start } from './scenes/Start.js';
import { GameOver } from './scenes/GameOver.js';
import {StoryScene} from './scenes/Story.js';

const config = {
  type: Phaser.AUTO,
  title: 'Batalha de Turnos',
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#000000',
  pixelArt: false,
  scene: [
    Preloader, 
    MainMenu,
    StoryScene, 
    Start, 
    GameOver
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
