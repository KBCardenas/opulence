const User = require('../models/User');
const Product = require('../models/Product'); // Asegúrate de tener el modelo Product
const Order = require('../models/Order');
// Listar usuarios
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find(); // Puede incluir filtros
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Alternar rol de usuario
exports.toggleUserRole = async (req, res) => {
    const { userId } = req.body; // solo necesitamos el userId
    try {
        // Buscar el usuario por ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Alternar el rol de administrador
        user.esAdmin = !user.esAdmin; // Cambia el valor actual de esAdmin
        await user.save(); // Guarda los cambios

        res.json({ message: 'Rol de usuario actualizado', user });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar rol' });
    }
}; 

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Opcional: Verificar si el usuario a eliminar es el administrador
        if (user.esAdmin) {
            return res.status(403).json({ message: 'No se puede eliminar a un administrador' });
        }

        await User.findByIdAndDelete(userId);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

// Obtener estadisticas
exports.getStatistics = async (req, res) => {
    try {
        // Cantidad total de usuarios
        const userCount = await User.countDocuments();

        // Cantidad total de productos
        const productCount = await Product.countDocuments();

        // Pedidos por estado
        const orderStatusCount = await Order.aggregate([
            { $group: { _id: "$estado", count: { $sum: 1 } } }
        ]);

        // Ventas por categoría
        const salesByCategory = await Product.aggregate([
            { $unwind: "$categoria" },
            { $group: { _id: "$categoria", totalVentas: { $sum: "$ventasTotales" } } },
            { $sort: { totalVentas: -1 } }
        ]);

        // Productos con bajo stock
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } });

        // Usuarios más activos (por cantidad de compras realizadas)
        const topUsers = await Order.aggregate([
            { $group: { _id: "$comprador_id", totalPedidos: { $sum: 1 } } },
            { $sort: { totalPedidos: -1 } },
            { $limit: 5 }
        ]);

        // Nuevos usuarios registrados en los últimos 30 días
        const newUsers = await User.countDocuments({
            fechaRegistro: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        });

        // Pedidos realizados en los últimos 30 días
        const recentOrders = await Order.countDocuments({
            fechaPedido: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        });

        // Ganancias mensuales
        const monthlyRevenue = await Order.aggregate([
            { $match: { estado: 'entregado' } },
            {
                $group: {
                    _id: { year: { $year: "$fechaPedido" }, month: { $month: "$fechaPedido" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);

        // Valoraciones promedio de productos
        const averageRatings = await Product.aggregate([
            { $unwind: "$valoraciones" },
            { $group: { _id: "$_id", avgRating: { $avg: "$valoraciones.estrellas" } } },
            { $sort: { avgRating: -1 } },
            { $limit: 5 }
        ]);

        // Pedidos por método de pago
        const paymentMethodUsage = await Order.aggregate([
            { $group: { _id: "$metodoPago", count: { $sum: 1 } } }
        ]);

        // Usuarios con más gastos
        const topSpendingUsers = await Order.aggregate([
            { $group: { _id: "$comprador_id", totalGastado: { $sum: "$total" } } },
            { $sort: { totalGastado: -1 } },
            { $limit: 5 }
        ]);

        // Productos menos vendidos
        const leastSellingProducts = await Product.find().sort({ ventasTotales: 1 }).limit(5);

        // Usuarios inactivos
        const inactiveUsers = await User.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'comprador_id',
                    as: 'compras'
                }
            },
            { $match: { 'compras.0': { $exists: false } } } // Usuarios sin compras recientes
        ]);

        res.json({
            userCount,
            productCount,
            orderStatusCount,
            salesByCategory,
            lowStockProducts,
            topUsers,
            newUsers,
            recentOrders,
            monthlyRevenue,
            averageRatings,
            paymentMethodUsage,
            topSpendingUsers,
            leastSellingProducts,
            inactiveUsers
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
