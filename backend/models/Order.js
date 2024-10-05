const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    comprador_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    productos: { 
        type: [Schema.Types.Mixed], 
        required: true 
    },
    total: { 
        type: Number, 
        required: true 
    },
    fechaPedido: { 
        type: Date, 
        default: Date.now 
    },
    estado: { 
        type: String, 
        default: 'pendiente' 
    }, // pendiente, enviado, entregado, cancelado
    direccionEntrega: { 
        type: String, 
        required: true 
    },
    metodoPago: { 
        type: String, 
        required: true 
    },
    transaccionID: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('Order', orderSchema);
