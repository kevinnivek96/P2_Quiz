const model = require('./model');
const {log,errorlog,colorize,biglog} = require('./out');



exports.helpCmd = rl => {

	log('Commandos : ')
	log('	h|help - Muestra esta ayuda.');
	log('	list - Listar los quizzes existentes.');
	log('	show <id> - Muestra la pregunta y la respuesta del quiz indicado.');
	log('	add - Añadir un nuevo quiz interactivamente.');
	log('	delete <id> - Borrar el quiz indicado.');
	log('	edit <id> - Editar el quiz indicado.');
	log('	test <id> - Probar el quiz indicado.');
	log('	p|play - Jugar a preguntar aleatoriamente todos los quizzes.');
	log('	credits - Créditos.');
	log('	q|quit - Salir del programa.');
	rl.prompt();
};

exports.listCmd = rl => {
	model.getAll().forEach((quiz,id) => {

		log(` [${colorize(id,'magenta')}]: ${quiz.question}`);

	});
	rl.prompt();
}

exports.showCmd = (rl,id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();

	} else {


		try{

			const quiz = model.getByIndex(id);
			log(` [${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
		} catch(error) {

			errorlog(error.message);
		}
	}

	rl.prompt();

};


exports.addCmd = rl => {

	rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {

		rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {

			model.add(question,answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`)
			rl.prompt();
		});
	});

	rl.prompt();

	
};

exports.deleteCmd = (rl,id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();

	} else {


		try{
			model.deleteByIndex(id);
		} catch(error) {

			errorlog(error.message);
		}
	}
	rl.prompt();



};

exports.editCmd = (rl,id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();

	} else {


		try{
			const quiz = model.deleteByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0)

			rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0)

				rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {

					model.update(id,question,answer);
					log(` Se ha cambiado el quiz ${colorize(id,'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);

					rl.prompt();

				});
			});		
		} catch(error) {

			errorlog(error.message);
			rl.prompt();
		}
	}
};
// TO DO 
exports.testCmd = (rl,id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();

	} else {


		try {

			quiz = model.getByIndex(id);
			rl.question(colorize(quiz.question + "? ",'red'), answer => {

			log('Su respuesta es: ');
			if( answer.toLowerCase().trim() === quiz.answer.toLowerCase()) {
				log('correct','green');
			} else {
				log('incorrect','red');

			}
			rl.prompt();

			});

		} catch (error) {

			errorlog(error.message);
			rl.prompt();

		}
	}
	

};

// TO DO
exports.playCmd = (rl) => {

	let score = 0;
	let toBeResolved = [];

	for (let i = 0; i < model.count(); ++i) {
		toBeResolved[i] = i;
		
		
		};

	const playOne = () => {
	if (toBeResolved.length === 0){
		log('No hay nada mas que preguntar.');
		log('Fin del examen. Aciertos: ');
		biglog(score,'magenta');
		rl.prompt();



	} else {
		let id = Math.round(Math.random()*(toBeResolved.length-1));
		let quiz = model.getByIndex(toBeResolved[id]);
		toBeResolved.splice(id,1);

		rl.question(colorize(quiz.question + "? ",'red'), answer => {

			
			if( answer.toLowerCase().trim() === quiz.answer.toLowerCase()) {
				score++;
				log('correcto - Lleva ' + score + ' aciertos');
				playOne();

			} else {
				log('incorrecto.');
				log('Fin del examen. Aciertos: ');
				biglog(score,'magenta');
				rl.prompt();



			}

			});



		}
	}
	playOne();



};


exports.creditsCmd = () => {
	log('Autores de la práctica:');
	log('kevinnivek96','green');
};
	
exports.quitCmd = (rl) => {
	rl.close();
	

};