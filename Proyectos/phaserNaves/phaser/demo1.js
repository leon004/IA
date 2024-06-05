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

function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');
}



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

function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
}


function datosDeEntrenamiento(param_entrada){
    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]+" "+param_entrada[4]+" "+param_entrada[5]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire=Math.round( nnSalida[0]*100 );
    var piso=Math.round( nnSalida[1]*100 );
    var derecha=Math.round( nnSalida[2]*100 );
    var izquierda=Math.round( nnSalida[3]*100 );
    //[despBala , velocidadBala, despBala2, velocidadBala2, despBalaHorizontal3, velocidadBala3, despBalaVertical3, velocidadBala3]
    console.log(" En el Aire %: "+ aire
                +"\n En el suelo %: " + piso 
                +"\n En la derecha %: " + derecha 
                +"\n En la izquierda %: " + izquierda 
            );
            console.log("OUTPUTS: "+ nnSalida[2]>=nnSalida[3])
    return nnSalida[2]>=nnSalida[3];
}
function EntrenamientoSalto(param_entrada){
    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire=Math.round( nnSalida[0]*100 );
    var piso=Math.round( nnSalida[1]*100 );
    //[despBala , velocidadBala, despBala2, velocidadBala2, despBalaHorizontal3, velocidadBala3, despBalaVertical3, velocidadBala3]
    console.log(" En el Aire %: "+ aire
                +"\n En el suelo %: " + piso 
            );
            console.log("OUTPUTS: "+ nnSalida[0]>=nnSalida[1])
    return nnSalida[0]>=nnSalida[1];
}



function pausa(){
    juego.paused = true;
    menu = juego.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event){
    if(juego.paused){
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x  ,
            mouse_y = event.y  ;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                eCompleto=false;
                datosEntrenamiento = [];
                modoAuto = false;
            }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!eCompleto) {
                    console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" );
                    enRedNeural();
                    eCompleto=true;
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


function resetVariables(){
    bala.body.velocity.x = 0;
    bala.position.x = w-100;
    balaD=false;
}

function resetVariables2(){
    bala2.body.velocity.y = -270;
    bala2.position.y = h-400;
    //bala2.position.x = w-760;
    balaD2=false;
}

function resetVariables3(){
    bala3.body.velocity.y = -270;
    bala3.body.velocity.x = 0;
    bala3.position.x = w-100;
    bala3.position.y = h-500;
    balaD3=false;
}

function resetPlayer(){
    jugador.position.x=50;
}


function saltar(){
    jugador.body.velocity.y = -270;
}

function correr(){
    jugador.body.velocity.x = 150;

}
function correrAtras(){
    jugador.body.velocity.x = -150;
}

function Detenerse(){
    jugador.body.velocity.x = 0;
}

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
        console.log("ARRIBA!");
        
    }
    
    if(jugador.body.velocity.x >= 140) {
       
            estatusDerecha = 1;
            estatusIzquierda = 0;
        console.log("DERECHA!");
       
    }
    despBala = Math.floor( jugador.position.x - bala.position.x );
    despBala2 = Math.floor( jugador.position.x - bala2.position.x );
    despBalaHorizontal3 = Math.floor( jugador.position.x - bala3.position.x );
    despBalaVertical3 = Math.floor( jugador.position.y - bala3.position.y );
    despBala3 = Math.floor(despBalaHorizontal3 + despBalaVertical3);
    // El jugador está aprox en 99.99, hay que hacer que salte al estar en 105
    //console.log("Poscion bala:", bala.position.x);
/*
    if (bala.position.x <= 200 && bala.position.x >=170){
        saltar();
    }
*/
console.log("VJ: "+jugador.body.velocity.x);
    if( modoAuto==false && salto.isDown &&  !estatusAire ){
        if(jugador.body.velocity.x <= 0){
            jugador.body.velocity.x = 150;
            saltar();
            correr();
        }
        else{ 
            saltar();
            Detenerse();
        }
    }
    if( modoAuto==false && avanza.isDown &&  jugador.body.onFloor()){
        correr();
    }

    if( modoAuto==false && jugador.body.onFloor() && jugador.position.x >= 200){
        correrAtras();
    }

    if( modoAuto==false && !avanza.isDown &&  jugador.body.onFloor() && jugador.position.x == 50 ){
        Detenerse();
    }

    console.log(jugador.position.x);

    if( modoAuto == true  && bala.position.x>0 && jugador.body.onFloor()) {

        console.log("Saltar: "+EntrenamientoSalto( [despBala , velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3] ));
        if( EntrenamientoSalto( [despBala , velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3] )  ){
            console.log("SALTAR");
            console.log("SALTAR");
            console.log("SALTAR");
            console.log("SALTAR");
            console.log("SALTAR");
            if(jugador.body.velocity.x <= 0){
                jugador.body.velocity.x = 150;
                saltar();
                correr();
            }
            else{ 
                saltar();
                Detenerse();
            }
        } 
        console.log("Correr: "+datosDeEntrenamiento( [despBala , velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3] ));
        if( datosDeEntrenamiento( [despBala , velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3] )  ){
            console.log("CORRER");
            console.log("CORRER");
            console.log("CORRER");
            console.log("CORRER");
            console.log("CORRER");
            correr();         
        }else if(jugador.body.onFloor() && jugador.position.x >= 250){
            Detenerse();
            correrAtras();
        }
    }

    if( balaD==false ){
        disparo();
    }

    if( balaD2==false ){
        disparo2();
    }

    if( balaD3==false ){
        disparo3();
    }

    if( bala.position.x <= 0  ){
        resetVariables();
    }

    if( bala2.position.y >= 355  ){
        resetVariables2();
    }

    if( bala3.position.x <= 0  || bala3.position.y >= 355 ){
        resetVariables3();
    }
  
    if( modoAuto ==false  && bala.position.x > 0 ){

        datosEntrenamiento.push({
                'input' :  [despBala , velocidadBala, despBala2, velocidadBala2, despBala3, velocidadBala3],
                'output':  [estatusAire , estatuSuelo, estatusDerecha, estatusIzquierda]  
        });

        console.log(
                    "DB1: ", despBala + "\n"+
                    "VB1: " +velocidadBala +"\n"+
                    "DB2: ", despBala2 + "\n"+
                    "VB2: " +velocidadBala2 +"\n"+
                    "DHB3: ", despBalaHorizontal3 + "\n"+
                    "DVB3: " +despBalaVertical3 +"\n"+
                    "DB3: " +despBala3 +"\n"+
                    "VB3: ", velocidadBala3 + "\n"
                );
   }

}


function disparo(){
    velocidadBala =  -1 * velocidadRandom(300,700);
    bala.body.velocity.y = 0 ;
    bala.body.velocity.x = velocidadBala ;
    balaD=true;
}

function disparo2(){
    velocidadBala2 =  -1 * velocidadRandom(300,800);
    bala2.body.velocity.y = 0 ;
    balaD2=true;
}

function disparo3(){
    velocidadBala3 =  -1 * velocidadRandom(400,500);
    bala3.body.velocity.y = 0 ;
    bala3.body.velocity.x = 1.60*velocidadBala3 ;
    balaD3=true;
}

function colisionH(){
    pausa();
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render(){

}
