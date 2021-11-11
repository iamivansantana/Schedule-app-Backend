const express = require('express');
const cors = require('cors');
const { dbConection } = require('./database/config');
require('dotenv').config();

//Crear servidor de express
const app = express();
//Base de Datos
dbConection();

// CORS
app.use(cors());

//Directorio Publico
app.use(express.static('public'));
//Lectura y parseo del body
app.use(express.json());

//Rutas
//	Autenticacion
app.use('/api/auth', require('./routes/auth'));
//	Eventoss
app.use('/api/events', require('./routes/events'));

//TODO: Crud: eventos

//Escuchar pet
app.listen(process.env.PORT, () => {
	console.log(`Servidor runing at port ${process.env.PORT}`);
});
