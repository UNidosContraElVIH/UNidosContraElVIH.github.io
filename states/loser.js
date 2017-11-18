var perdiste = {

    preload: function(){
         game.load.image('novictoria', 'images/map/perdiste.png');
    },

    create: function () {
        // Agregar fondo
        game.add.sprite(0, 0, 'novictoria');

        // enter guarda la acción de presionar R para reanudar el juego
        var enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        
        // Cuando presiona se cambia a esa acción
        enter.onDown.addOnce(this.start, this);

        /* Resetea la cantidad de diplomas en cada juego */
        total_diplomas = 0;
    },
    
    // reinicia el juego   
    start: function () {
        game.state.start('iniciar');    
    }	
}