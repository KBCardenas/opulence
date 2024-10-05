const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    usuario1_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    usuario2_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    mensajes: [{
        mensaje: { type: String, required: true },
        fecha: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Chat', chatSchema);
