// Game configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 50,
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

let game = null;
let score = 0;
let scoreText;
let lastSliceTime = 0;
let fruits;
let bombs;
let cursors;
let slashSound, bombSound, bgMusic;

function preload() {
    this.load.image('background', 'assets/background/bg.png');
    this.load.image('apple', 'assets/fruits/apple.png');
    this.load.image('banana', 'assets/fruits/banana.png');
    this.load.image('orange', 'assets/fruits/orange.png');
    this.load.image('watermelon', 'assets/fruits/watermelon.png');
    this.load.image('strawberry', 'assets/fruits/strawberry.png');
    this.load.image('bomb', 'assets/fruits/bomb.png');

    // Juice splashes
    this.load.image('splash_red', 'assets/splashes/red.png');
    this.load.image('splash_yellow', 'assets/splashes/yellow.png');
    this.load.image('splash_green', 'assets/splashes/green.png');

    // Sounds
    this.load.audio('bgMusic', 'assets/sounds/bg.mp3');
    this.load.audio('slice', 'assets/sounds/slice.wav');
    this.load.audio('bomb', 'assets/sounds/bomb.wav');
}

function create() {
    // Background
    this.add.image(config.width / 2, config.height / 2, 'background').setDisplaySize(config.width, config.height);

    // Score text
    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Groups
    fruits = this.physics.add.group();
    bombs = this.physics.add.group();

    // Spawn fruits and bombs
    this.time.addEvent({
        delay: 1000,
        callback: spawnObjects,
        callbackScope: this,
        loop: true
    });

    // Sounds
    slashSound = this.sound.add('slice');
    bombSound = this.sound.add('bomb');
    bgMusic = this.sound.add('bgMusic', { loop: true });
    bgMusic.play();

    // Input
    this.input.on('pointermove', (pointer) => {
        let objects = fruits.getChildren();
        objects.forEach((fruit) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(pointer, fruit.getBounds())) {
                sliceFruit(this, fruit);
            }
        });

        let bombObjects = bombs.getChildren();
        bombObjects.forEach((bomb) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(pointer, bomb.getBounds())) {
                hitBomb(this);
            }
        });
    });
}

function update() {}

function spawnObjects() {
    const x = Phaser.Math.Between(50, config.width - 50);
    const isBomb = Phaser.Math.Between(1, 6) === 1; // 1 in 6 chance for bomb
    if (isBomb) {
        let bomb = bombs.create(x, config.height, 'bomb').setScale(0.7);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), -600);
    } else {
        const fruitTypes = ['apple', 'banana', 'orange', 'watermelon', 'strawberry'];
        const fruit = fruits.create(x, config.height, Phaser.Utils.Array.GetRandom(fruitTypes));
        fruit.setVelocity(Phaser.Math.Between(-100, 100), -600);
    }
}

function sliceFruit(scene, fruit) {
    const now = scene.time.now;
    fruit.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
    slashSound.play();

    if (now - lastSliceTime < 500) {
        score += 5; // Combo bonus
    }
    lastSliceTime = now;
}

function hitBomb(scene) {
    bombSound.play();
    scene.scene.pause();
    showGameOver();
}

function showGameOver() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-over').style.display = 'flex';
    document.getElementById('final-score').innerText = 'Score: ' + score;
}

// Handle UI Buttons
document.getElementById('play-btn').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Insert Interstitial Ad Code Here
    if (!game) game = new Phaser.Game(config);
});

document.getElementById('replay-btn').addEventListener('click', () => {
    window.location.reload();
});

document.getElementById('home-btn').addEventListener('click', () => {
    window.location.reload();
});
      
