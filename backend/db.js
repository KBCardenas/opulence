// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Asegúrate de que no haya opciones obsoletas aquí
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1); // Salir si no se puede conectar
    }
};

module.exports = connectDB;
