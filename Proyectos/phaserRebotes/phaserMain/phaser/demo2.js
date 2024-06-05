

var w = 800;
var h = 400;
var jugador;
var fondo;
var bala;

var cursors;
var menu;

var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48);
    juego.load.image('menu', 'assets/game/menu.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
}

function create() {
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 0; // No gravedad para permitir movimiento libre
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    jugador = juego.add.sprite(w / 2, h / 2, 'mono');

    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true; // Evitar que el jugador salga de los limites del mundo NO MOVER JONATAHN!!!
    var corre = jugador.animations.add('corre', [8, 9, 10, 11]); 
    jugador.animations.play('corre', 10, true); 

    // Añadir la bala en la esquina suprioir derecha
    bala = juego.add.sprite(0, 0, 'bala');
    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true; // Evitar que la bala salga de los límites del mundo
    bala.body.bounce.set(1); // Hacer que la bala rebote
    bala.body.velocity.set(150, 150); // Establecer la velocidad inicial de la bala

    
    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    
    cursors = juego.input.keyboard.createCursorKeys();
}

function pausa() {
    juego.paused = true;
    menu = juego.add.sprite(w / 2, h / 2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event) {
    if (juego.paused) {
        var menu_x1 = w / 2 - 270 / 2, menu_x2 = w / 2 + 270 / 2,
            menu_y1 = h / 2 - 180 / 2, menu_y2 = h / 2 + 180 / 2;

        var mouse_x = event.x,
            mouse_y = event.y;

        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            menu.destroy();
            juego.paused = false;
        }
    }
}

function update() {
    fondo.tilePosition.x -= 1; // Mover el fondo para crear efecto de desplazamiento

    // Resetear velocidad del jugador
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;

    // Movimiento del jugador con teclas de dirección
    if (cursors.left.isDown) {
        jugador.body.velocity.x = -300; // Mover a la izquierda
    } else if (cursors.right.isDown) {
        jugador.body.velocity.x = 300; // Mover a la derecha
    }

    if (cursors.up.isDown) {
        jugador.body.velocity.y = -300; // Mover hacia arriba
    } else if (cursors.down.isDown) {
        jugador.body.velocity.y = 300; // Mover hacia abajo
    }

    
    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);

    
    var dx = bala.x - jugador.x;
    var dy = bala.y - jugador.y;
    var distancia = Math.sqrt(dx * dx + dy * dy); // Frmula de distancia euclifiana, verfica las coordenadas x,y

    // Determinar el cuadrante en el que se encuentra la bala respecto al jugador
    var cuadrante = '';
    if (dx >= 0 && dy >= 0) {
        cuadrante = '+x+y';
    } else if (dx >= 0 && dy < 0) {
        cuadrante = '+x-y';
    } else if (dx < 0 && dy >= 0) {
        cuadrante = '-x+y';
    } else {
        cuadrante = '-x-y';
    }

    // Mostar en consola la disancia y el cuadrante
    console.log('Distancia: ' + distancia.toFixed(2) + ', Cuadrante: ' + cuadrante);
}

function colisionH() {
    pausa(); // Pausar el juego en caso de colisión
}

function render() {
    // Opcionalmente, renderizar el estado del juego o información adicional
}