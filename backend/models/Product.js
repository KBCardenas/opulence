const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const valoracionSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'User' },
    estrellas: { type: Number, min: 1, max: 5, required: true },
    comentario: { type: String, required: true, maxlength: 500 },
    fecha: { type: Date, default: Date.now }
});

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
        type: [String], 
        default: []
    },
    precio: { 
        type: Number, 
        required: true,
        min: 0 
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0
    },
    stockBajo: { 
        type: Boolean, 
        default: false 
    },
    fotos: { 
        type: [String],
        default: [] 
    },
    etiquetas: { 
        type: [String],
        default: []
    },
    valoraciones: [valoracionSchema],
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
    },
    ventas: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Product', productSchema);
