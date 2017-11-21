/* Se crea una nueva instancia de juego llamada estudianteEnFinales. */
/* Esta es llamada en el manager */

/* Se añade una variable que cuente el total de condones que lleva el usuario*/
var total_condones = 0;

/* Para los modal */
var reg = {};
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

    /* Se crean los objetos estaticos condones */
    this.condon1 = null;
    this.condon2 = null;
    this.condon3 = null;
    this.condon4 = null;
    this.condon5 = null;
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
    this.direcciones = [null, null, null, null, null];
    /* Se crea un arreglo de opuestos de las direcciones anteriores */
    this.opuestos = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];
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
        /* Importa la imagen del condon*/
        this.load.image('condon', 'images/map/condon.png');
        /* Importa el logo de la UN */
        this.load.image('un', 'images/map/un.png');
        /* Importa el enemigo */
        this.load.image('enemigo', 'images/map/virus.png');
        /* Importa el otro enemigo */
        this.load.image('twitter', 'images/map/tw.png');
        /* Y mas...*/
        this.load.image('couple', 'images/map/par.png');
        /* Y mas...*/
        this.load.image('tv', 'images/map/tv.png');
    },

    /* Esta función crea nuestro mundo con los elementos que se cargaron en preload*/
    create: function () {
        // con la libreria modal.js creamos un nuevo objeto modal, para crear los dialogos
        reg.modal = new gameModal(game);
        // llamamos a la funcion que creara los dialogos
        this.createModals();
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
        this.unal = game.add.sprite(384, 384, 'un');
        /* se incluye al enemigo en el escenario */
        this.distraccion = game.add.sprite(128, 128, 'enemigo');
        this.twitter = game.add.sprite(224, 128, 'twitter');
        this.pareja = game.add.sprite(576, 128, 'couple');
        this.tv = game.add.sprite(96, 384, 'tv');
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
        /* Se añaden los condones en el mapa */
        /*Como cada recuadro en el mapa mide 32 e inicia desde cero, así
            se calculo para añadir a la posición: x*cantidad de casillas, y*cantidad de casillas*/
        this.condon1 = game.add.sprite(160, 32, 'condon');
        this.condon2 = game.add.sprite(384, 64, 'condon');
        this.condon3 = game.add.sprite(128, 288, 'condon');
        this.condon4 = game.add.sprite(512, 288, 'condon');
        this.condon5 = game.add.sprite(256, 384, 'condon');
        /* El movimiento del jugador es manejado por el usuario.
        Se le indica a game que se hará a través del teclado*/
        puntaje = game.add.text(2, 2, "Puntaje: 0", { font: "24px Montserrat" });
        puntaje.addColor("#f6a5a3", 0);
        puntaje.stroke = '#1a1c1e';
        puntaje.fontWeight = 'bold';
        puntaje.strokeThickness = 4;
        this.cursors = this.input.keyboard.createCursorKeys();
        /* Inicializa el movimiento, en este caso hacia abajo*/
        this.move(Phaser.DOWN);
        // Realiza los movimientos de las distracciones
        this.moverEnemigo();

    },

    /* Contiene todos los movimientos de los enemigos en el mundo */
    moverEnemigo: function () {
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
        if (this.cursors.left.isDown) {
            this.esValidoMoverse(Phaser.LEFT);
        }
        else if (this.cursors.right.isDown) {
            this.esValidoMoverse(Phaser.RIGHT);
        }
        if (this.cursors.up.isDown) {
            this.esValidoMoverse(Phaser.UP);
        }
        else if (this.cursors.down.isDown) {
            this.esValidoMoverse(Phaser.DOWN);
        }

    },

    /* checkea si el jugador puede moverse a la dirección que indico el usuario */
    esValidoMoverse: function (moverA) {
        /*Si el movimiento del usuario actual es contra una pared, llamará a la función move, para que
        examine otros movimientos posibles*/
        if (this.actual === this.opuestos[moverA]) {
            this.move(moverA);
        }
        else {
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
        if (direction === Phaser.LEFT || direction === Phaser.UP) {
            velocidad = -velocidad;
        }
        /* Establece la velocidad (cuando hay un avance) en x (derecha/izquierda)
          o en y (arriba/abajo) */
        if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
            this.jugador.body.velocity.x = velocidad;
        }
        else {
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
        if (this.girar !== Phaser.NONE) {
            this.turn();
        }

        /* Y buscará los condones */
        this.colisiones();

        this.ganaste();

        /* Si se sobrepone con los enemigos el jugador pierde */
        this.physics.arcade.overlap(this.jugador, this.distraccion, this.perdiste, null, this);
        this.physics.arcade.overlap(this.jugador, this.twitter, this.perdiste, null, this);
        this.physics.arcade.overlap(this.jugador, this.pareja, this.perdiste, null, this);
        this.physics.arcade.overlap(this.jugador, this.tv, this.perdiste, null, this);
    },


    colisiones: function () {

        // Colisiones. Resta el valor de x y y de jugador y la condon, si es menor a 20px destruye el objeto condon
        if (this.jugador.x == (this.condon1.x + 16) && this.jugador.y == (this.condon1.y + 16)) {
            reg.modal.showModal("modal1");
            this.condon1.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.condon1.y = 0;
            this.condon1.x = 0;
        }

        if (this.jugador.x == (this.condon2.x + 16) && this.jugador.y == (this.condon2.y + 16)) {
            reg.modal.showModal("modal2");
            this.condon2.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.condon2.y = 0;
            this.condon2.x = 0;
            //total_condones += 1;
        }

        if (this.jugador.x == (this.condon3.x + 16) && this.jugador.y == (this.condon3.y + 16)) {
            this.condon3.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.condon3.y = 0;
            this.condon3.x = 0;
            total_condones += 1;
        }

        if (this.jugador.x == (this.condon4.x + 16) && this.jugador.y == (this.condon4.y + 16)) {
            this.condon4.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.condon4.y = 0;
            this.condon4.x = 0;
            total_condones += 1;
        }

        if (this.jugador.x == (this.condon5.x + 16) && this.jugador.y == (this.condon5.y + 16)) {
            this.condon5.destroy();
            /* Se cambian los valores de x y y para que no entre de nuevo al if */
            this.condon5.y = 0;
            this.condon5.x = 0;
            total_condones += 1;
        }

        puntaje.setText("Puntaje: " + total_condones);

    },

    /* Cambia de estado si gana*/
    ganaste: function () {
        /* Si el total de condones es 5 puede ir a la puerta y ganar */
        /* Como la posición de jugador se refiere al punto de giro, se suma 16 (ya que es la mitad del jugador)
         a la posición unal*/
        if (this.jugador.x == (this.unal.x + 16) && this.jugador.y == (this.unal.y + 16)) {
            if (total_condones == 5) {
                game.state.start("ganar");
            } else {
                puntaje.setText("¡Sin todos los condones ni pio!");

            }
        }

    },

    /* Cambia de estado si pierde */
    perdiste: function () {
        game.state.start('perder');
    },

    createModals: function () {
        //// ventana modal 1, conversación 1 ////
        reg.modal.createModal({
            type: "modal1",
            includeBackground: true,
            modalCloseOnInput: false,
            itemsArr: [
                {
                    type: "text",
                    content: "Tienes una oportunidad, \nsi contestas mal tienes que volver a comenzar.",
                    fontFamily: "Montserrat",
                    fontSize: 20,
                    color: "f6a5a3",
                    offsetY: -100,
                    stroke: "0x000000",
                    strokeThickness: 5
                },
                {
                    type: "text",
                    content: "¿Abrazar a un seropositivo puede hacer que te contagies?",
                    fontFamily: "Montserrat",
                    fontSize: 20,
                    color: "f6a5a3",
                    stroke: "0x000000",
                    strokeThickness: 5
                },
                {
                    type: "text",
                    content: "si",
                    fontFamily: "Montserrat",
                    fontSize: 30,
                    color: "f6a5a3",
                    stroke: "0x000000",
                    strokeThickness: 5,
                    offsetY: 100,
                    offsetX: -80,
                    callback: function () {
                        reg.modal.hideModal("modal1");
                        reg.modal.showModal("modal3");
                        // en caso que responda no muestra game over y reinicia el juego
                        setTimeout(
                            function restart() {
                                game.state.start('perder');
                            },
                            2500);
                    }
                    //contentScale: 0.6,

                },
                {
                    type: "text",
                    content: "no",
                    fontFamily: "Montserrat",
                    fontSize: 30,
                    color: "f6a5a3",
                    stroke: "0x000000",
                    strokeThickness: 5,
                    offsetY: 100,
                    offsetX: 80,
                    contentScale: 0.6,
                    callback: function () {
                        // elimina los mounstros, cierra la venta modal y de nuevo permite movimiento al jugador
                        // autemnta el 1 para eliminar la pared donde esta la reina
                        //reg.wallDestroy += 1;
                        //item.kill();                        
                        reg.modal.hideModal("modal1");
                        total_condones += 1;
                        //hero.walking_speed = 150;
                    }

                }
            ]
        });


        /// ventana modal 3, conversación 3 ///
        reg.modal.createModal({
            type: "modal3",
            includeBackground: true,
            modalCloseOnInput: false,
            itemsArr: [
                {
                    type: "text",
                    content: "¿En serio, man?",
                    fontFamily: "Montserrat",
                    fontSize: 42,
                    color: "f6a5a3",
                    offsetY: 50
                },
                {
                    type: "text",
                    content: "¿Really?",
                    fontFamily: "Montserrat",
                    fontSize: 42,
                    color: "f6a5a3",
                    offsetY: -50,
                    contentScale: 0.6
                }
            ]
        });

        // Modal 2
        reg.modal.createModal({
            type: "modal2",
            includeBackground: true,
            modalCloseOnInput: false,
            itemsArr: [
                {
                    type: "text",
                    content: "Tienes una oportunidad, \nsi contestas mal tienes que volver a comenzar.",
                    fontFamily: "Montserrat",
                    fontSize: 20,
                    color: "f6a5a3",
                    offsetY: -100,
                    stroke: "0x000000",
                    strokeThickness: 5
                },
                {
                    type: "text",
                    content: "Si un hombre se hizo la circuncisión,\n ¿tiene menor riesgo de adquirir el VIH?",
                    fontFamily: "Montserrat",
                    fontSize: 20,
                    color: "f6a5a3",
                    stroke: "0x000000",
                    strokeThickness: 5
                },
                {
                    type: "text",
                    content: "si",
                    fontFamily: "Montserrat",
                    fontSize: 30,
                    color: "f6a5a3",
                    stroke: "0x000000",
                    strokeThickness: 5,
                    offsetY: 100,
                    offsetX: -80,
                    callback: function () {
                        // elimina los mounstros, cierra la venta modal y de nuevo permite movimiento al jugador
                        // autemnta el 1 para eliminar la pared donde esta la reina
                        //reg.wallDestroy += 1;
                        //item.kill();                        
                        reg.modal.hideModal("modal2");
                        total_condones += 1;
                        //hero.walking_speed = 150;
                    }

                },
                {
                    type: "text",
                    content: "no",
                    fontFamily: "Montserrat",
                    fontSize: 30,
                    color: "f6a5a3",
                    stroke: "0x000000",
                    strokeThickness: 5,
                    offsetY: 100,
                    offsetX: 80,
                    contentScale: 0.6,
                    callback: function () {
                        reg.modal.hideModal("modal2");
                        reg.modal.showModal("modal4");
                        // en caso que responda no muestra game over y reinicia el juego
                        setTimeout(
                            function restart() {
                                game.state.start('perder');
                            },
                            2500);
                    }
                    //contentScale: 0.6,


                }
            ]
        });

        reg.modal.createModal({
            type: "modal4",
            includeBackground: true,
            modalCloseOnInput: false,
            itemsArr: [
                {
                    type: "text",
                    content: "Las pruebas indican que la circuncisión masculina puede disminuir el riesgo de que un individuo se infecte por el VIH y la tasa de propagación del VIH en la comunidad",
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    color: "f6a5a3",
                    offsetY: 50
                },
                {
                    type: "text",
                    content: "La circuncisión masculina nunca debe reemplazar \na otros métodos de prevención y debe considerarse\n como un elemento más de las medidas de prevención",
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    color: "f6a5a3",
                    offsetY: -50,
                    contentScale: 0.6
                }
            ]
        });
        
    },

};

