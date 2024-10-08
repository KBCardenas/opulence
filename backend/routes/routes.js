const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController'); // Verifica que esto esté correcto
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

// Gestión de usuario
router.post('/register', authController.registerUser); // Verifica que registerUser exista
router.post('/login', authController.loginUser); // Verifica que loginUser exista
router.post('/forgot-password', authController.forgotPassword); // Verifica que forgotPassword exista
router.post('/reset-password', authController.resetPassword); // Verifica que resetPassword exista

// Gestión de perfil
router.delete('/eliminar-cuenta', authenticate, userController.deleteAccount);
router.put('/editar-perfil', authenticate, userController.updateUser);
router.post('/change-password', authenticate, userController.changePassword);
router.post('/actualizar-info-pago', authenticate, userController.updatePaymentInfo);
router.delete('/eliminar-info-pago', authenticate, userController.deletePaymentInfo);

// Rutas de administración
router.get('/usuarios', authenticate, isAdmin, adminController.listUsers);
router.post('/toggle-rol', authenticate, isAdmin, adminController.toggleUserRole);
router.delete('/eliminar-usuario', authenticate, isAdmin, adminController.deleteUser);
router.get('/estadisticas', authenticate, isAdmin, adminController.getStatistics);

// Gestion de productos 
router.get('/listar-productos', authenticate, productController.listProducts);
router.post('/add-product', authenticate, isAdmin, upload.array('fotos', 10), productController.addProduct);
router.put('/editar-producto', authenticate, isAdmin, upload.array('newImages'), productController.updateProduct);
router.delete('/eliminar-producto', authenticate, isAdmin, productController.deleteProduct);
router.get('/buscar-producto', authenticate, productController.searchProducts);
router.get('/filtrar-nombre-categoria', authenticate, productController.filterProducts);
router.get('/filtrar-oferta-categoria-etiqueta', authenticate, productController.buscarProductosEnOferta);
router.get('/detalles-producto', authenticate, productController.getProductDetails);
router.put('/up-atributes-producto', authenticate, isAdmin, productController.updateProductAttributes);
router.post('/add-valoracion', authenticate, productController.addReview);
router.post('/manejar-valoracion', authenticate, productController.manageValoraciones);
router.put('/aumentar-vistas', authenticate, productController.incrementarVistas);
router.get('/calcular-precio-descuento', authenticate, productController.calcularPrecioConDescuento);

// Gestion de pedidos
router.post('/crear-pedido', authenticate, orderController.createOrder);
router.get('/listar-pedidos', authenticate, isAdmin, orderController.listOrders);
router.get('/detalles-pedido', authenticate, orderController.getOrderDetails);
router.put('/actualizar-estado', authenticate, isAdmin, orderController.updateOrderStatus);
router.delete('/eliminar-pedido', authenticate, isAdmin, orderController.deleteOrder);

// Carrito
router.post('/agregar-al-carrito', authenticate, cartController.addToCart);
router.get('/carrito', authenticate, cartController.getCart);
router.post('/eliminar-del-carrito', authenticate, cartController.removeFromCart);
router.post('/vaciar-carrito', authenticate, cartController.clearCart);

// Gestion de pago
router.post('/procesar-pago', authenticate, paymentController.procesarPago);
router.post('/confirmar-pago', authenticate, paymentController.confirmarPago);
router.get('/historial-pagos', authenticate, paymentController.historialPagos);


module.exports = router;
