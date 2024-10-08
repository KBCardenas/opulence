const Order = require('../models/Order');
const Product = require('../models/Product');

// Crear un nuevo pedido
exports.createOrder = async (req, res) => {
    try {
        const { comprador_id, productos, direccionEntrega, metodoPago, transaccionID } = req.body;

        // Calcular el total del pedido
        let total = 0;
        for (const item of productos) {
            const producto = await Product.findById(item.producto_id);
            if (!producto) {
                return res.status(404).json({ error: `Producto con ID ${item.producto_id} no encontrado` });
            }
            total += producto.precio * item.cantidad;
        }

        const nuevaOrden = new Order({
            comprador_id,
            productos,
            total,
            direccionEntrega,
            metodoPago,
            transaccionID
        });

        await nuevaOrden.save();
        res.status(201).json({ mensaje: 'Pedido creado exitosamente', order: nuevaOrden });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el pedido', detalle: error.message });
    }
};

// Listar todos los pedidos
exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('comprador_id').exec();
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los pedidos', detalle: error.message });
    }
};

// Obtener los detalles de un pedido específico
exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('comprador_id').exec();

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles del pedido', detalle: error.message });
    }
};

// Actualizar el estado de un pedido
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { estado } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        order.estado = estado;
        await order.save();

        res.status(200).json({ mensaje: 'Estado del pedido actualizado correctamente', order });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del pedido', detalle: error.message });
    }
};

// Eliminar un pedido
exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        await order.remove();

        res.status(200).json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido', detalle: error.message });
    }
};
