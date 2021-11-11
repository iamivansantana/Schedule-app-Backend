const { response, json } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario-Model');
const { generarJWT } = require('../helpers/jwt');

//Nuevo usuario
const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo ya ha sido registrado',
			});
		}
		usuario = new Usuario(req.body);

		//Encriptar contraseña antes de guardar en BD
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		//Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			msg: 'Registro exitoso',
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el Administrador',
		});
	}
};
//Api Login
const loginUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		//Verificar si el email existe
		const usuario = await Usuario.findOne({ email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo aun no ha sido registrado',
			});
		}

		//Si email es true
		//Confirmar los passwords
		const validPassword = bcrypt.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Password incorrecto',
			});
		}

		//Si todo es ok Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el Administrador',
		});
	}
};
//Revalidar Token
const revalidadToken = async (req, res = response) => {
	const { uid, name } = req;

	//Generar un nuevo JWT
	const token = await generarJWT(uid, name);

	res.json({
		ok: true,
		token,
	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidadToken,
};
