# Reporte del Código

El siguiente código es un juego desarrollado con el framework Phaser, que permite crear juegos en 2D. A continuación, se presenta una explicación detallada de cada parte del código:

## Variables Globales

```javascript
var w=800;
var h=400;
var jugador;
var fondo;

var bala, balaD=false, nave;
var bala2, balaD2=false, nave2;
var bala3, balaD3=false, nave3;

var salto;
var avanza;
var menu;

var velocidadBala;
var despBala;
var velocidadBala2;
var despBala2;
var velocidadBala3;
var despBalaHorizontal3;
var despBalaVertical3;
var despBala3;
var estatusAire;
var estatuSuelo;
var estatusDerecha;
var estatusIzquierda;

var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;

var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});
```

- `w` y `h`: Definen el ancho y alto del juego.
- `jugador`, `fondo`, `bala`, `nave`, `bala2`, `nave2`, `bala3`, `nave3`: Sprites para el jugador, el fondo, y varios objetos del juego (balas y naves).
- `balaD`, `balaD2`, `balaD3`: Variables booleanas para controlar el estado de disparo de cada bala.
- `salto`, `avanza`: Teclas para saltar y avanzar.
- `menu`: Sprite para el menú de pausa.
- `velocidadBala`, `despBala`, `velocidadBala2`, `despBala2`, `velocidadBala3`, `despBalaHorizontal3`, `despBalaVertical3`, `despBala3`: Variables para la velocidad y desplazamiento de las balas.
- `estatusAire`, `estatuSuelo`, `estatusDerecha`, `estatusIzquierda`: Variables para el estado del jugador.
- `nnNetwork`, `nnEntrenamiento`, `nnSalida`, `datosEntrenamiento`: Variables relacionadas con la red neuronal.
- `modoAuto`, `eCompleto`: Variables para el modo automático y el estado de entrenamiento de la red neuronal.
- `juego`: Instancia del juego Phaser.

## Función `preload`

```javascript
function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');
}
```

Carga los recursos necesarios para el juego, como imágenes y spritesheets.

## Función `create`

```javascript
function create() {
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w-100, h-70, 'nave');
    bala = juego.add.sprite(w-100, h, 'bala');
    nave2 = juego.add.sprite(w-800, h-400, 'nave');
    bala2 = juego.add.sprite(w-760, h-380, 'bala');
    nave3 = juego.add.sprite(w-100, h-400, 'nave');
    bala3 = juego.add.sprite(w-100, h-370, 'bala');
    jugador = juego.add.sprite(50, h, 'mono');

    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre',[8,9,10,11]);
    jugador.animations.play('corre', 10, true);

    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;
    juego.physics.enable(nave);
    nave.body.collideWorldBounds = true;
    juego.physics.enable(bala2);
    bala2.body.collideWorldBounds = true;
    juego.physics.enable(bala3);
    bala3.body.collideWorldBounds = true;

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    avanza = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    nnNetwork =  new synaptic.Architect.Perceptron(6, 5, 5, 5, 4);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}
```

Configura el sistema de física, añade los sprites al juego y establece sus propiedades físicas. También inicializa la red neuronal.

## Funciones de Entrenamiento y Datos

### `enRedNeural`

```javascript
function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
}
```

Entrena la red neuronal con los datos de entrenamiento.

### `datosDeEntrenamiento`

```javascript
function datosDeEntrenamiento(param_entrada){
    nnSalida = nnNetwork.activate(param_entrada);
    var aire = Math.round(nnSalida[0] * 100);
    var piso = Math.round(nnSalida[1] * 100);
    var derecha = Math.round(nnSalida[2] * 100);
    var izquierda = Math.round(nnSalida[3] * 100);
    return nnSalida[2] >= nnSalida[3];
}
```

Procesa los datos de entrada para determinar el movimiento del jugador utilizando la red neuronal.

### `EntrenamientoSalto`

```javascript
function EntrenamientoSalto(param_entrada){
    nnSalida = nnNetwork.activate(param_entrada);
    var aire = Math.round(nnSalida[0] * 100);
    var piso = Math.round(nnSalida[1] * 100);
    return nnSalida[0] >= nnSalida[1];
}
```

Procesa los datos de entrada para determinar si el jugador debe saltar utilizando la red neuronal.

## Funciones de Pausa

### `pausa`

```javascript
function pausa(){
    juego.paused = true;
    menu = juego.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}
```

Pausa el juego y muestra el menú de pausa.

### `mPausa`

```javascript
function mPausa(event){
    if(juego.paused){
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x,
            mouse_y = event.y;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1+90){
                eCompleto = false;
                datosEntrenamiento = [];
                modoAuto = false;
            }else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1+90 && mouse_y <= menu_y2) {
                if(!eCompleto) {
                    enRedNeural();
                    eCompleto = true;
                }
                modoAuto = true;
            }

            resetVariables();
            resetVariables2();
            resetVariables3();
            resetPlayer();
            juego.paused = false;
            menu.destroy();
        }
    }
}
```

Maneja los clics del mouse para reanudar el juego o seleccionar opciones del menú de pausa.

## Funciones de Reinicio

### `resetVariables`

```javascript
function resetVariables(){
    bala.body.velocity.x = 0;
    bala.position.x = w-100;
    balaD=false;
}
```

Reinicia la posición y velocidad de la primera bala.

### `resetVariables2`

```javascript
function resetVariables2(){
    bala2.body.velocity.y = -270;
    bala2.position.y = h-400;
    balaD2=false;
}
```

Reinicia la posición y velocidad de la segunda bala.

### `resetVariables3`

```javascript
function resetVariables3(){
    bala3.body.velocity.y = -270;
    bala3.body.velocity.x = 0;
    bala3.position.x = w-100;
    bala3.position.y = h-500;
    balaD3=false;
}
```

Reinicia la posición y velocidad de la tercera bala.

### `resetPlayer`

```javascript
function resetPlayer(){
    jugador.position.x=50;
}
```

Reinicia la posición del jugador.

## Funciones de Movimiento del Jugador

### `saltar`

```javascript
function saltar(){
    jugador.body.velocity.y = -270;


}
```

Hace que el jugador salte.

### `correr`

```javascript
function correr(){
    jugador.body.velocity.x = 150;
}
```

Hace que el jugador corra hacia adelante.

### `correrAtras`

```javascript
function correrAtras(){
    jugador.body.velocity.x = -150;
}
```

Hace que el jugador corra hacia atrás.

### `Detenerse`

```javascript
function Detenerse(){
    jugador.body.velocity.x = 0;
}
```

Detiene el movimiento del jugador.

## Función `update`

```javascript
function update() {
    fondo.tilePosition.x -= 1;

    juego.physics.arcade.collide(nave, jugador, colisionH, null, this);
    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);
    juego.physics.arcade.collide(bala2, jugador, colisionH, null, this);
    juego.physics.arcade.collide(bala3, jugador, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;
    estatusDerecha = 0;
    estatusIzquierda = 1;

    if(!jugador.body.onFloor() || jugador.body.velocity.y !=0) {
        estatuSuelo = 0;
        estatusAire = 1;
    }
    
    if(jugador.body.velocity.x >= 140) {
        estatusDerecha = 1;
        estatusIzquierda = 0;
    }
    
    despBala = Math.floor(jugador.position.x - bala.position.x);
    despBala2 = Math.floor(jugador.position.x - bala2.position.x);
    despBalaHorizontal3 = Math.floor(jugador.position.x - bala3.position.x);
    despBalaVertical3 = Math.floor(jugador.position.y - bala3.position.y);
    despBala3 = Math.floor(despBalaHorizontal3 + despBalaVertical3);

    if(modoAuto == false && salto.isDown && !estatusAire){
        if(jugador.body.velocity.x <= 0){
            jugador.body.velocity.x = 150;
            saltar();
            correr();
        } else { 
            saltar();
            Detenerse();
        }
    }

    if(modoAuto == false && avanza.isDown && jugador.body.onFloor()){
        correr();
    }

    if(modoAuto == false && jugador.body.onFloor() && jugador.position.x >= 200){
        correrAtras();
    }

    if(modoAuto == false && !avanza.isDown && jugador.body.onFloor() && jugador.position.x == 50){
        Detenerse();
    }

    if(modoAuto == true && bala.position.x > 0 && jugador.body.onFloor()) {
        if(EntrenamientoSalto([despBala, velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3])){
            if(jugador.body.velocity.x <= 0){
                jugador.body.velocity.x = 150;
                saltar();
                correr();
            } else { 
                saltar();
                Detenerse();
            }
        }

        if(datosDeEntrenamiento([despBala, velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3])){
            correr();         
        } else if(jugador.body.onFloor() && jugador.position.x >= 250){
            Detenerse();
            correrAtras();
        }
    }

    if(balaD == false){
        disparo();
    }

    if(balaD2 == false){
        disparo2();
    }

    if(balaD3 == false){
        disparo3();
    }

    if(bala.position.x <= 0){
        resetVariables();
    }

    if(bala2.position.y >= 355){
        resetVariables2();
    }

    if(bala3.position.x <= 0 || bala3.position.y >= 355){
        resetVariables3();
    }
  
    if(modoAuto == false && bala.position.x > 0){
        datosEntrenamiento.push({
            'input' : [despBala, velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3],
            'output': [estatusAire, estatuSuelo, estatusDerecha, estatusIzquierda]
        });
    }
}
```

Actualiza el estado del juego en cada frame. Maneja las colisiones, el movimiento manual y automático del jugador, y la generación de datos de entrenamiento.

## Funciones de Disparo

### `disparo`

```javascript
function disparo(){
    velocidadBala = -1 * velocidadRandom(300, 700);
    bala.body.velocity.y = 0;
    bala.body.velocity.x = velocidadBala;
    balaD = true;
}
```

Genera un disparo con la primera bala.

### `disparo2`

```javascript
function disparo2(){
    velocidadBala2 = -1 * velocidadRandom(300, 800);
    bala2.body.velocity.y = 0;
    balaD2 = true;
}
```

Genera un disparo con la segunda bala.

### `disparo3`

```javascript
function disparo3(){
    velocidadBala3 = -1 * velocidadRandom(400, 500);
    bala3.body.velocity.y = 0;
    bala3.body.velocity.x = 1.60 * velocidadBala3;
    balaD3 = true;
}
```

Genera un disparo con la tercera bala.

### `colisionH`

```javascript
function colisionH(){
    pausa();
}
```

Pausa el juego en caso de colisión.

### `velocidadRandom`

```javascript
function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

Genera una velocidad aleatoria entre `min` y `max`.

## Función `render`

```javascript
function render(){
    // Opcionalmente, renderizar el estado del juego o información adicional
}
```

Renderiza el estado del juego o información adicional (opcional).

---

Este código crea un juego donde el jugador debe evitar balas y naves que se mueven en la pantalla. El jugador puede ser controlado manualmente o a través de una red neuronal que se entrena con datos de posición y velocidad de las balas.