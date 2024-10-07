const User = require('../models/User');
const Product = require('../models/Product'); // Asegúrate de tener el modelo Product

// Listar usuarios
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find(); // Puede incluir filtros
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Modificar rol de usuario
exports.updateUserRole = async (req, res) => {
    const { userId, esAdmin } = req.body; // userId y nuevo rol
    try {
        const user = await User.findByIdAndUpdate(userId, { esAdmin }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Rol de usuario actualizado', user });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar rol' });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

// Listar productos (si aplica)
exports.listProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Si tienes un modelo Product
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Agregar producto (si aplica)
exports.addProduct = async (req, res) => {
    const newProduct = new Product(req.body); // Suponiendo que tienes un modelo Product
    try {
        const product = await newProduct.save();
        res.status(201).json({ message: 'Producto creado', product });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear producto' });
    }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
    const { productId, updatedData } = req.body; // productId y datos a actualizar
    try {
        const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado', product });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// Eliminar producto (si aplica)
exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

// Ver estadísticas
exports.getStatistics = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        res.json({ userCount, productCount });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
