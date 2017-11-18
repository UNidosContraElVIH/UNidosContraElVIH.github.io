/* Se crea una nueva instancia de juego llamada estudianteEnFinales. */
/* Esta es llamada en el manager */

/* Se añade una variable que cuente el total de diplomas que lleva el usuario*/
var total_diplomas = 0;

/* Se siguieron diferentes tutoriales encontrados en la pagina de Phaser */

/* Esta función recibe como parametro "game" -definido en el 
 manager.js- y le añade las propidades en su interior.*/
var estudianteEnFinales = function (game) {
    /* Inicializa el mapa, la capa donde se ubicarán los elementos y el jugador*/
    /*"this" hace referencia al parametro game, y así en las instancias de esta funcion*/
    this.map = null;
    this.capa = null;
    this.jugador = null;
    this.unal = null;
    this.distraccion = null;
    this.twitter = null;
    this.pareja = null;
    this.tv = null;

    /* Se crean los objetos estaticos diplomas */
    this.diploma1  = null;
    this.diploma2  = null;
    this.diploma3  = null;
    this.diploma4  = null;
    this.diploma5  = null;
    /* */
    //this.safetile = 1;
    /* Se usara para calcular movimientos */
    this.dimCuadricula = 32;

    /* Velocidad controla el movimiento "automatico" del jugador. 
    La dirección en que se mueva la define el usuario */
    this.velocidad = 100;
    //this.threshold = 3;
    this.velocidadGiro = 150;

    /* Traza el marcador de las paredes */
    this.marcador = new Phaser.Point();
    /* Se usará para permitir los giros y ver el ultimo giro realizado*/
    this.puntoGiro = new Phaser.Point();

    /* Se inicializa un vector de direcciones, con eso 
        sabemos si nuestro jugador puede moverse hacia la 
        izquierda, derecha, arriba, abajo. El primer elemento se 
        refiere cuando no realiza movimientos. */
    this.direcciones = [ null, null, null, null, null ];
    /* Se crea un arreglo de opuestos de las direcciones anteriores */
    this.opuestos = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
    /* Guarda la posición actual*/
    this.actual = Phaser.UP;
    /* Busca los posibles movimientos, los que son validos para moverse
        Los que no están obstruidos por una pared */
    this.girar = Phaser.NONE;

};

/* Esta es una instancia de estudianteEnFinales, que contiene las variables contenidas
    en la función anterior. */
estudianteEnFinales.prototype = {

    /*Importa la función Physics de Phaser, que le da atributos 
    de colisiones a los objetos */
    init: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    /* En esta función se realiza la carga de los archivos que estan
        presentes en nuestro ambiente o mundo.*/
    preload: function () {
        /* map es un archivo json.*/
        /* Este archivo contiene la ubicacion de los elementos en el mapa. Es decir, 
            el toma de una imagen de patrones algunos elementos y construye así el mapa.*/
        this.load.tilemap('map', 'images/map/map.json', null, Phaser.Tilemap.TILED_JSON);
        /*Importa el archivo de patrones para que el json ubique los elementos usados en el mapa.
        La imagen de patrones contiene elementos del mismo tamaño y permite construir mundos*/
        this.load.image('tiles', 'images/map/default_tiles_x.png');
        /* Importa la imagen del jugador */
        this.load.image('jugador', 'images/map/car90.png');
        /* Importa la imagen del diploma*/
        this.load.image('diploma', 'images/map/diploma.png');
        /* Importa el logo de la UN */
        this.load.image('un', 'images/map/un.png');
        /* Importa el enemigo */
        this.load.image('enemigo', 'images/map/fb.png');
        /* Importa el otro enemigo */
        this.load.image('twitter', 'images/map/tw.png');
        /* Y mas...*/
        this.load.image('couple', 'images/map/par.png');
        /* Y mas...*/
        this.load.image('tv', 'images/map/tv.png');
    },

    /* Esta función crea nuestro mundo con los elementos que se cargaron en preload*/
    create: function () {
        /* Añade el mapa al escenario */
        this.map = this.add.tilemap('map');
        /* Añade los elementos en el json en el escenario. 'other' es el nombre clave
        con que el json reconoce el archivo de patrones */
        this.map.addTilesetImage('other', 'tiles');
        /* 'mundo' hace referencia al mapa creado por medio del archivo de patrones.
        También esta presente en el archivo de json */
        this.capa = this.map.createLayer('mundo');
        /*Añade colisiones con el elemento 2 en el mapa. json llena con numeros el patron construido.
        Esos numeros representan una imagen dentro del archivo de patrones. Así es como se
        construye el mapa.*/
        /*El elemento 2 es una pared */
        this.map.setCollision(2, true, this.capa);
        // Se incluye el logo en el escenario
        this.unal = game.add.sprite(384,384, 'un');
        /* se incluye al enemigo en el escenario */
        this.distraccion = game.add.sprite(128,128, 'enemigo');
        this.twitter = game.add.sprite(224,128, 'twitter');
        this.pareja = game.add.sprite(576,128, 'couple');
        this.tv = game.add.sprite(96,384, 'tv');
        /* Se añade al jugador en el escenario*/
        this.jugador = this.add.sprite(48, 48, 'jugador');
        /*Se refiere a la rotación de jugador. 0.5, en la mitad*/
        this.jugador.anchor.set(0.5);
        /* Hacemos que jugador y el enemigo sean objetos con propiedades fisicas,
        con el fin de la colisión.
        Esto se hace gracias a la libreria Phaser*/
        this.physics.arcade.enable(this.jugador);
        this.physics.arcade.enable(this.distraccion);
        this.physics.arcade.enable(this.twitter);
        this.physics.arcade.enable(this.pareja);
        this.physics.arcade.enable(this.tv);
        /* Se añaden los diplomas en el mapa */
        /*Como cada recuadro en el mapa mide 32 e inicia desde cero, así
            se calculo para añadir a la posición: x*cantidad de casillas, y*cantidad de casillas*/
        this.diploma1 = game.add.sprite(160,32, 'diploma');
        this.diploma2 = game.add.sprite(384,64, 'diploma');
        this.diploma3 = game.add.sprite(128,288, 'diploma');
        this.diploma4 = game.add.sprite(512,288, 'diploma');
        this.diploma5 = game.add.sprite(256,384, 'diploma');
        /* El movimiento del jugador es manejado por el usuario.
        Se le indica a game que se hará a través del teclado*/
        this.cursors = this.input.keyboard.createCursorKeys();
        /* Inicializa el movimiento, en este caso hacia abajo*/
        this.move(Phaser.DOWN);
        // Realiza los movimientos de las distracciones
        this.moverEnemigo();

    },

    /* Contiene todos los movimientos de los enemigos en el mundo */
    moverEnemigo: function() {
        /* Se define el movimiento en x o en y; con bounce se da el efecto de rebote*/
        this.distraccion.body.velocity.x = 100;
        this.distraccion.body.bounce.setTo(1, 1);

        this.twitter.body.velocity.y = 100;
        this.twitter.body.bounce.setTo(1, 1);

        this.pareja.body.velocity.y = 100;
        this.pareja.body.bounce.setTo(1, 1);

        this.tv.body.velocity.y = 100;
        this.tv.body.bounce.setTo(1, 1);
    },

    /* Chequea la tecla presionada y el movimiento*/
    accionesTeclado: function () {
        /* Realiza la opción cuando la tecla es presionada */
        /* Aquí se presentan las 4 direcciones posibles */
        if (this.cursors.left.isDown)
        {
            this.esValidoMoverse(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown)
        {
            this.esValidoMoverse(Phaser.RIGHT);
        }
        if (this.cursors.up.isDown)
        {
            this.esValidoMoverse(Phaser.UP);
        }
        else if (this.cursors.down.isDown)
        {
            this.esValidoMoverse(Phaser.DOWN);
        }

    },

    /* checkea si el jugador puede moverse a la dirección que indico el usuario */
    esValidoMoverse: function (moverA) {
        /*Si el movimiento del usuario actual es contra una pared, llamará a la función move, para que
        examine otros movimientos posibles*/
        if (this.actual === this.opuestos[moverA])
        {
            this.move(moverA);
        }
        else
        {
            /*Si no hay una casilla que lo obstruya gira a esa dirección*/
            this.girar = moverA;
            /*Punto giro es un elemento visual que le indica al usuario cual fue su ultimo giro
            y esta relacionado con la colision de las paredes. Permite también que el jugador no se salga
            de las dimensiones del mundo, o aparezca encima de las paredes donde colisiona*/
            this.puntoGiro.x = (this.marcador.x * this.dimCuadricula) + (this.dimCuadricula / 2);
            this.puntoGiro.y = (this.marcador.y * this.dimCuadricula) + (this.dimCuadricula / 2);
        }

    },

    /*Se define la función de giro*/
    turn: function () {
        /*Se recupera la posición (coordenada) del jugador, y realiza Math.floor (funcion piso, que es una 
        aproximación a la parte entera de un numero decimal por debajo)*/
        var cx = Math.floor(this.jugador.x);
        var cy = Math.floor(this.jugador.y);

        /*Asigna las coordenadas de giro a jugador*/
        this.jugador.x = this.puntoGiro.x;
        this.jugador.y = this.puntoGiro.y;

        /* le indica al jugador la posición donde debe efectuar el giro*/
        this.jugador.body.reset(this.puntoGiro.x, this.puntoGiro.y);
        /*Habilita hacia donde se puede girar en dicha posicion posbles y luego lo resetea*/
        this.move(this.girar);
        this.girar = Phaser.NONE;
        /* Le indica al que llama a esta función que si es valido el movimiento en la direccion opuesta*/
        return true;

    },

    move: function (direction) {
        var velocidad = this.velocidad;
        /* Como la velocidad es "negativa" de acuerdo al movimiento izquierda o arriba se actualiza de la siguiente forma
         para se conserve*/
        if (direction === Phaser.LEFT || direction === Phaser.UP)
        {
            velocidad = -velocidad;
        }
        /* Establece la velocidad (cuando hay un avance) en x (derecha/izquierda)
          o en y (arriba/abajo) */
        if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
        {
            this.jugador.body.velocity.x = velocidad;
        }
        else
        {
            this.jugador.body.velocity.y = velocidad;
        }

        /* Un tween es una función en Phaser que permite modificar algunas propiedades de movimiento
         en un periodo de tiempo. Aquí se usa para el giro */
        //this.add.tween(this.jugador).to( { angle: this.getAngle(direction) }, this.velocidadGiro, "Linear", true);
        /* Actualiza que la direccion indicada por el usuario es la nueva actual  */
        this.actual = direction;

    },

    // Esta función muestra el cambio en la imagen debido al giro
/*     getAngle: function (to) {

        console.log(this.actual + " <Actual | opuestos> " +this.opuestos[to])
        if (this.actual === this.opuestos[to])
        {
            return "180";
        }

        if ((this.actual === Phaser.UP && to === Phaser.LEFT) ||
            (this.actual === Phaser.DOWN && to === Phaser.RIGHT) ||
            (this.actual === Phaser.LEFT && to === Phaser.DOWN) ||
            (this.actual === Phaser.RIGHT && to === Phaser.UP))
        {
            return "-90";
        }

        return "90";

    },
     */
    /* Maneja la logica del juego */
    update: function () {
       /* Hace colisionar jugador con la capa, mediante la función arcade de Phaser */
        this.physics.arcade.collide(this.jugador, this.capa);
        /*También hace que el enemigo colisione*/
        this.physics.arcade.collide(this.distraccion, this.capa);
        this.physics.arcade.collide(this.twitter, this.capa);
        this.physics.arcade.collide(this.pareja, this.capa);
        this.physics.arcade.collide(this.tv, this.capa);

        /*El marcador indica donde se ubico el jugador por ultima vez antes de realizar un giro*/
        this.marcador.x = this.math.snapToFloor(Math.floor(this.jugador.x), this.dimCuadricula) / this.dimCuadricula;
        this.marcador.y = this.math.snapToFloor(Math.floor(this.jugador.y), this.dimCuadricula) / this.dimCuadricula;

        //  Actualiza los sensores de direcciones 
        this.direcciones[1] = this.map.getTileLeft(this.capa.index, this.marcador.x, this.marcador.y);
        this.direcciones[2] = this.map.getTileRight(this.capa.index, this.marcador.x, this.marcador.y);
        this.direcciones[3] = this.map.getTileAbove(this.capa.index, this.marcador.x, this.marcador.y);
        this.direcciones[4] = this.map.getTileBelow(this.capa.index, this.marcador.x, this.marcador.y);

        /* Permite que el usuario cambie el movimiento */
        this.accionesTeclado();

        /*Si puede girar llamara a la función que evalua giros */
        if (this.girar !== Phaser.NONE)
        {
            this.turn();
        }

        /* Y buscará los diplomas */
        this.colisiones();

        this.ganaste();

        /* Si se sobrepone con los enemigos el jugador pierde */
        this.physics.arcade.overlap(this.jugador, this.distraccion, this.perdiste, null, this);
        this.physics.arcade.overlap(this.jugador, this.twitter, this.perdiste, null, this);
        this.physics.arcade.overlap(this.jugador, this.pareja, this.perdiste, null, this);
        this.physics.arcade.overlap(this.jugador, this.tv, this.perdiste, null, this);
    },


    colisiones: function () {
        // Colisiones. Resta el valor de x y y de jugador y la diploma, si es menor a 20px destruye el objeto diploma
        if (this.jugador.x == (this.diploma1.x + 16) && this.jugador.y == (this.diploma1.y+16)){
            this.diploma1.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.diploma1.y = 0;
            this.diploma1.x = 0;
            total_diplomas += 1;
        }

        if (this.jugador.x == (this.diploma2.x + 16) && this.jugador.y == (this.diploma2.y+16)){
            this.diploma2.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.diploma2.y = 0;
            this.diploma2.x = 0;
            total_diplomas += 1;
        }

        if (this.jugador.x == (this.diploma3.x + 16) && this.jugador.y == (this.diploma3.y+16)){
            this.diploma3.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.diploma3.y = 0;
            this.diploma3.x = 0;
            total_diplomas += 1;
        }

        if (this.jugador.x == (this.diploma4.x + 16) && this.jugador.y == (this.diploma4.y+16)){
            this.diploma4.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.diploma4.y = 0;
            this.diploma4.x = 0;
            total_diplomas += 1;    
        }

        if (this.jugador.x == (this.diploma5.x + 16) && this.jugador.y == (this.diploma5.y+16)){
            this.diploma5.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.diploma5.y = 0;
            this.diploma5.x = 0;
            total_diplomas+= 1;    
        }
    },

    /* Cambia de estado si gana*/
    ganaste: function () {
        /* Si el total de diplomas es 5 puede ir a la puerta y ganar */
        /* Como la posición de jugador se refiere al punto de giro, se suma 16 (ya que es la mitad del jugador)
         a la posición unal*/
        if(this.jugador.x == (this.unal.x+16) && this.jugador.y == (this.unal.y+16)){
            if (total_diplomas == 5) {
                game.state.start("ganar");
            }
        }
            
    },

    /* Cambia de estado si pierde */
    perdiste: function(){
        game.state.start('perder');
    },

/*     render: function () {

        //  Render permite añadir texto o colores sobre el juego

        // Recorre todas las posibles direcciones 
        for (var t = 1; t < 5; t++)
        {
            // Cuando no se le indica dirección que continue
            if (this.direcciones[t] === null)
            {
                continue;
            }

            // Se crea un color por defecto : verde
            var color = 'rgba(0,255,0,0.3)';

            // Si la direccion t corresponde con la del usuario la coloca en azul la celda adyacente, con trasparencia
            if (t === this.actual)
            {
                color = 'rgba(0,255,255,0.3)';
            }
            // Esto crea un cuadrado que rellena la celda adyacente con el color deseado y su transparencia
            this.game.debug.geom(new Phaser.Rectangle(this.direcciones[t].worldX, this.direcciones[t].worldY, 32, 32), color, true);
        }

        this.game.debug.geom(this.puntoGiro, '#ffff00');
        //Debug text permite imprimir encima del ambiente. La mayoria de posiciones logradas
        //y la detección de colisiones se hicieron por medio de este debug. En este caso, se hizo para
        //detectar cuando jugador y distraccion se cruzaban
        //this.game.debug.text("Diferencia x: " + (this.jugador.x - (this.distraccion.x+16)), 32, 32);
        //this.game.debug.text("Diferencia y: " + (this.jugador.y - (this.distraccion.y+16)), 32, 64);
        //this.game.debug.text("Contador: " + total_diplomas, 32, 128);

    } */

};

