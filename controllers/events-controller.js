const { response } = require('express');
const Evento = require('../models/Evento-Model');

//Obtener Eventos
const getEventos = async (req, res = response) => {
	const eventos = await Evento.find().populate('user', 'name'); //populate() es para desestructurar la referencia (user) como segundo parametro se indica que atributo se quiere (el id es por default)

	try {
		res.status(201).json({
			ok: true,
			eventos,
			msg: 'get eventos',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el Administrador',
		});
	}
};

//CrearEvento
const crearEvento = async (req, res = response) => {
	const evento = new Evento(req.body);

	try {
		evento.user = req.uid;

		const eventoGuardado = await evento.save();

		res.status(201).json({
			ok: true,
			evento: eventoGuardado,
			msg: 'crear Evento',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el Administrador',
		});
	}
};

//ActualizarEvento
const actualizarEvento = async (req, res = response) => {
	const eventoID = req.params.id;
	const uid = req.uid;

	try {
		const evento = await Evento.findById(eventoID);
		//Verificar si evento existe
		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'error no se encontró evento con ese ID',
			});
		}

		//Verificar si la persona que creo el evento
		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No tiene privilegio de editar este evento',
			});
		}

		//Si llega a esta parte El usuario es correcto
		const nuevoEvento = {
			//Se desestructura aqui todo el contenido del body y se agrega el user: uid
			...req.body,
			user: uid,
		};
		const eventoActualizado = await Evento.findByIdAndUpdate(
			eventoID,
			nuevoEvento,
			{ new: true }
		); //{new: true} para mostrar el evento actualizado y no el anterior

		res.status(201).json({
			ok: true,
			evento: eventoActualizado,
			msg: 'evento Actualizado',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el Administrador',
		});
	}
};

//Eliminar Evento
const eliminarEvento = async (req, res = response) => {
	const eventoID = req.params.id;
	const uid = req.uid;

	try {
		const evento = await Evento.findById(eventoID);
		//Verificar si evento existe
		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: 'error no se encontró evento con ese ID',
			});
		}

		//Verificar si la persona que creo el evento
		if (evento.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: 'No tiene privilegio de eliminar este evento',
			});
		}

		//Si llega a esta parte El usuario es correcto

		await Evento.findByIdAndDelete(eventoID);

		res.status(201).json({
			ok: true,
			msg: 'evento Eliminado',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor hable con el Administrador',
		});
	}
};

module.exports = {
	getEventos,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
};
