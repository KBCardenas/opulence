const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/routes');
const connectDB = require('./db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre gracioso
process.on('SIGINT', () => {
    console.log('Cerrando el servidor...');
    server.close(() => {
        console.log('Servidor cerrado.');
        mongoose.connection.close(false, () => {
            console.log('Conexión a MongoDB cerrada.');
            process.exit(0);
        });
    });
});