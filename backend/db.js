const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI no está definida en las variables de entorno');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        // Intentar reconectar después de 5 segundos
        console.log('Intentando reconectar en 5 segundos...');
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;