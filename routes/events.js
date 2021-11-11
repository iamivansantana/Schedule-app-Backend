/*
Rutas de Usuarios / auth 
host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const {
	getEventos,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
} = require('../controllers/events-controller');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Validar el JWT en todas las rutas
router.use(validarJWT);

//Obtener Eventos
router.get('/', getEventos);

//Crear nuevo Evento
router.post(
	'/',
	[
		check('title', 'Tituulo es obligatorio').not().isEmpty(),
		check('start', 'Fecha de inicio es obligatoria').custom(isDate),
		check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
		validarCampos,
	],
	crearEvento
);

//Actualizar Evento
router.put(
	'/:id',
	[
		check('title', 'Tituulo es obligatorio').not().isEmpty(),
		check('start', 'Fecha de inicio es obligatoria').custom(isDate),
		check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
		validarCampos,
	],
	actualizarEvento
);

//Actualizar Evento
router.delete('/:id', eliminarEvento);

module.exports = router;
