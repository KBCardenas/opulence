const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    usuario_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    pedido_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    monto: { 
        type: Number, 
        required: true 
    },
    metodo: { 
        type: String, 
        required: true 
    }, // Tarjeta de crédito, Paypal, Mercado Pago, etc.
    estado: { 
        type: String, 
        default: 'pendiente' 
    }, // pendiente, pagado, fallido
    transaccionID: { 
        type: String, 
        required: true 
    },
    fechaPago: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
