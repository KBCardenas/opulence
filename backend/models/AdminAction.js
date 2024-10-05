const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Relación con el modelo User
    required: true
  },
  action: {
    type: String,
    required: true // Descripción de la acción realizada (ej: 'eliminar usuario', 'aprobar vendedor')
  },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Quien realizó la acción, refiriéndose al modelo User
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // Fecha y hora de la acción
  }
});

module.exports = mongoose.model('AdminAction', adminActionSchema);
