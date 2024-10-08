const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
    try {
        const { productoId, cantidad } = req.body;

        // Buscar el carrito del usuario
        let carrito = await Cart.findOne({ usuario_id: req.user._id });

        if (!carrito) {
            // Si no existe el carrito, crear uno nuevo
            carrito = new Cart({
                usuario_id: req.user._id,
                productos: []
            });
        }

        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = carrito.productos.find(p => p.productoId.toString() === productoId);

        if (productoEnCarrito) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            productoEnCarrito.cantidad += cantidad;
        } else {
            // Si no está en el carrito, agregar el nuevo producto
            const producto = await Product.findById(productoId);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            carrito.productos.push({ productoId, cantidad });
        }

        // Guardar el carrito actualizado
        await carrito.save();

        res.status(200).json({ message: 'Producto agregado al carrito', carrito });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
};

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
    try {
        const carrito = await Cart.findOne({ usuario_id: req.user._id }).populate('productos.productoId');

        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    try {
        const { productoId } = req.body;

        let carrito = await Cart.findOne({ usuario_id: req.user._id });

        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtrar el producto a eliminar
        carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== productoId);

        // Guardar el carrito actualizado
        await carrito.save();

        res.status(200).json({ message: 'Producto eliminado del carrito', carrito });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
    }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
    try {
        let carrito = await Cart.findOne({ usuario_id: req.user._id });

        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Vaciar el carrito
        carrito.productos = [];

        // Guardar el carrito vacío
        await carrito.save();

        res.status(200).json({ message: 'Carrito vaciado', carrito });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};
