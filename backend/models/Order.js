const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    comprador_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    productos: [
        {
            producto_id: { 
                type: Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            cantidad: { 
                type: Number, 
                required: true 
            },
            precioUnitario: { 
                type: Number, 
                required: true 
            }
        }
    ],
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
        enum: ['pendiente', 'enviado', 'entregado', 'cancelado'], 
        default: 'pendiente' 
    }, 
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
