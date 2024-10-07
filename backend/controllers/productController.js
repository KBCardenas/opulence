const Product = require('../models/Product');

// Crear Producto
exports.createProduct = async (req, res) => {
    const { nombre, descripcion, categoria, precio, stock } = req.body;
    const fotos = req.files.map(file => file.path); // Obtiene las URLs de las imágenes subidas

    try {
        const newProduct = new Product({
            nombre,
            descripcion,
            categoria,
            precio,
            stock,
            fotos, // Asigna las fotos subidas
        });

        await newProduct.save();
        res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto', details: error.message });
    }
};
