/*
Rutas de Usuarios / auth 
host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

const {
	crearUsuario,
	loginUsuario,
	revalidadToken,
} = require('../controllers/auth');

///api/auth/new
router.post(
	//Ruta
	'/new',
	[
		//Middlewares
		check('name', 'El nombre es Obligatorio').not().isEmpty(),
		check('email', 'El email es Obligatorio').isEmail(),
		check('password', 'El password debe tener almenos 6 caracteres').isLength({
			min: 6,
		}),
		validarCampos,
	],
	//Controller
	crearUsuario
);

///api/auth/
router.post(
	//Ruta
	'/',
	[
		//Middleware
		check('email', 'El email es Obligatorio').isEmail(),
		check('password', 'El password debe tener almenos 6 caracteres').isLength({
			min: 6,
		}),
		validarCampos,
	],
	//Controller
	loginUsuario
);

///api/auth/renew
router.get(
	//Ruta
	'/renew',
	//Middleware
	validarJWT,
	//Controller
	revalidadToken
);

module.exports = router;
