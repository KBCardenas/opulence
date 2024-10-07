const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String, 
        required: true 
    },
    correo: { 
        type: String, 
        required: true, 
        unique: true 
    },
    contrasena: { 
        type: String, 
        required: true 
    },
    telefono: { 
        type: String, 
        required: true 
    },
    direccion: { 
        type: String 
    },
    fechaRegistro: { 
        type: Date, 
        default: Date.now 
    },
    esAdmin: {
        type: Boolean, 
        default: false // El valor por defecto será `false` para los usuarios regulares
    },
    informacionPago: [ // Cambiado para ser un arreglo de objetos
        {
            tipo: { type: String, required: true }, // Tipo de método de pago (ej. tarjeta, PayPal)
            numero: { type: String, required: true } // Número de la tarjeta o método de pago
            // Agrega otros campos si es necesario
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
