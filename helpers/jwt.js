const jwt = require('jsonwebtoken');

//Recibe el uid y name del usuario
const generarJWT = (uid, name) => {
	//Retorna una promesa
	return new Promise((resolve, reject) => {
		//Se crea el payload con el uid y name
		const payload = { uid, name };
		//Se firma el token recibe (payload,palabra secreta, {time en que caduca}, callback para el error o resolver token  )
		jwt.sign(
			payload,
			process.env.SECRET_JWT_SEED,
			{
				expiresIn: '2h',
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject('No se pudo Generar el token');
				}

				resolve(token);
			}
		);
	});
};

module.exports = {
	generarJWT,
};
