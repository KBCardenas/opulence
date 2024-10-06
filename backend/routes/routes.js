const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware'); // Importar el middleware
const isAdmin = require('../middlewares/adminMiddleware');
const router = express.Router();

// Registro de usuarios
router.post('/register', userController.registerUser);

// Inicio de sesión
router.post('/login', userController.loginUser);

// Cerrar Sesion
router.post('/logout', userController.logoutUser);

// Recuperación de contraseña
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Gestión de perfil
router.get('/me', authenticate, userController.getUserById); // Ruta protegida
router.put('/me', authenticate, userController.updateUser); // Ruta protegida
router.delete('/me', authenticate, userController.deleteAccount); // Ruta protegida

// Gestión de roles
router.post('/convert-to-seller', authenticate, userController.convertToSeller); // Ruta protegida
router.post('/deactivate-seller', authenticate, userController.deactivateSeller); // Ruta protegida
router.put('/make-admin', authenticate, isAdmin, userController.makeAdmin);

// Solicitud para ser vendedor (cualquier usuario autenticado puede hacer esta solicitud)
router.post('/request-seller', authenticate, userController.requestSeller);

// Aprobación o rechazo de solicitud de vendedor (solo administradores)
router.put('/approve-seller/', authenticate, isAdmin, userController.approveSeller);
router.put('/reject-seller/', authenticate, isAdmin, userController.rejectSeller);

// Listar usuarios (solo para administradores, si es necesario)
router.get('/', authenticate, isAdmin, userController.listUsers); // Ruta protegida
router.get('/search', authenticate, isAdmin, userController.searchUser); // Ruta protegida

module.exports = router;
