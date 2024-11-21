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
    }
});

module.exports = mongoose.model('User', userSchema);
