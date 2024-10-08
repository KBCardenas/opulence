const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    usuario_id: { 
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
                required: true,
                min: 1 
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
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Cart', cartSchema);
