const mongoose = require('mongoose');

const dbConection = async () => {
	try {
		await mongoose.connect(process.env.DB_CONECTION);
		console.log('BD Online');
	} catch (error) {
		console.log(error);
		throw new Error('Error al iniciar BD');
	}
};

module.exports = {
	dbConection,
};
