const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        required: true 
    },
    categoria: { 
        type: String, 
        required: true 
    },
    precio: { 
        type: Number, 
        required: true 
    },
    vendedor_id: { 
        type: Schema.Types.ObjectId, ref: 'User', required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    fotos: { 
        type: [String] 
    },
    valoraciones: { 
        type: Schema.Types.Mixed, 
        default: {} 
    },
    ventasTotales: { 
        type: Number, 
        default: 0 
    },
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    },
    enOferta: { 
        type: Boolean, 
        default: false 
    },
    vistas: { 
        type: Number, 
        default: 0 
    }
});

module.exports = mongoose.model('Product', productSchema);
