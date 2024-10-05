const mongoose = require('mongoose');
const User = require('./User'); // Importamos el modelo User

const sellerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Relación con el modelo User
  },
  cedula: {
    type: String,
    required: true // La cédula es obligatoria para el vendedor
  },
  direccion: {
    type: String,
    required: true // La dirección es obligatoria para el vendedor
  },
  isVerified: {
    type: Boolean,
    default: false // Estado de verificación del vendedor (por defecto es falso)
  },
  adminActions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminAction' // Relación con las acciones de administración
  }]
}, { timestamps: true }); // Agrega campos createdAt y updatedAt automáticamente

module.exports = mongoose.model('Seller', sellerSchema);
