const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    cedula: { type: String, required: true },
    contrasena: { type: String, required: true }, // Asegúrate de que esto coincida
    rol: { type: String, default: 'comprador' }, // Default rol
    isVendor: { type: Boolean, default: false },
    pendingVendorApproval: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
