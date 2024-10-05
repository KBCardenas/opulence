const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Relación con el modelo User
    required: true
  },
  description: {
    type: String,
    required: true // Descripción de la queja o denuncia
  },
  type: {
    type: String,
    enum: ['queja', 'peticion', 'denuncia'], // Tipos permitidos
    required: true
  },
  status: {
    type: String,
    default: 'pendiente', // Estado inicial de la queja
    enum: ['pendiente', 'resuelta', 'no resuelta']
  },
  created_at: {
    type: Date,
    default: Date.now // Fecha de creación de la queja
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
