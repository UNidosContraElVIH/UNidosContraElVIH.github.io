var instrucciones = {

    preload: function(){
         game.load.image('insw', 'images/map/instrucciones.png');
    },

    create: function () {
        // Agregar fondo
        game.add.sprite(0, 0, 'insw');

        // enter guarda la acción de presionar R para reanudar el juego
        var enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        
        // Cuando presiona se cambia a esa acción
        enter.onDown.addOnce(this.start, this);
    },
    
    // reinicia el juego   
    start: function () {
        game.state.start('juego');    
    }	
}