//alert("El juego no se ejecuta de modo local en Chrome.\nSe recomienda usar Firefox para ejecutarlo localmente.\nSe subió a un servidor para ejecutarlo en cualquier navegador,\nesto puede verse en la sección -¿Como jugar?-. Ahí aparece el enlace.");
/* Este es el manejador de mis archivos Javascript 
	y que utiliza funcionalidad de Phaser */

/* Se crea una nueva instancia de juego. 
	Este será nuestro elementos canvas y tendrá 
	todos los elementos de mundo y personajes.*/

// Se crea el lienzo donde se carga el juego
var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');

// Se crean los estados del juego
// Este contiene el inicio del juego, que inicia cuando el usuario presiona ENTER
game.state.add('iniciar', inicio);
// Se presentan las instrucciones al usuario
game.state.add('instruccion', instrucciones);
// Al presionar enter lo dirige al siguiente estado
game.state.add('juego', estudianteEnFinales);
// Cuando ganas, llama a ganaste
game.state.add('ganar', ganaste);
// Y pues... cuando pierdes
game.state.add('perder', perdiste);

// Se llama al primer estado
game.state.start('iniciar');
