const express = require('express');
const userController = require('../controllers/userController');
const authContoller = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware'); // Importar el middleware
const isAdmin = require('../middlewares/adminMiddleware'); // Middleware de admin (si es necesario)
const router = express.Router();

// Gestion de usuario
router.post('/register', authContoller.registerUser);
router.post('/login', authContoller.loginUser);
router.post('/forgot-password', authContoller.forgotPassword);
router.post('/reset-password', authContoller.resetPassword);

// Gestión de perfil
router.delete('/eliminar-cuenta', authenticate, userController.deleteAccount);
router.put('/editar-perfil', authenticate, userController.updateUser);
router.post('/change-password', authenticate, userController.changePassword);
router.post('/actualizar-info-pago', authenticate, userController.updatePaymentInfo);
router.delete('/eliminar-info-pago', authenticate, userController.deletePaymentInfo);

// Rutas de administración
router.get('/usuarios', isAdmin, adminController.listUsers);
router.put('/modificar-rol', isAdmin, adminController.updateUserRole);
router.delete('/eliminar-usuario', isAdmin, adminController.deleteUser);
router.get('/listar-productos', isAdmin, adminController.listProducts);
router.post('/agregar-producto', isAdmin, adminController.addProduct);
router.put('/editar-producto', isAdmin, adminController.updateProduct); // Ruta para editar producto
router.delete('/eliminar-producto', isAdmin, adminController.deleteProduct);
router.get('/estadisticas', isAdmin, adminController.getStatistics);

module.exports = router;
