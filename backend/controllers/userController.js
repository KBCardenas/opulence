// controllers/userController.js
const User = require('../models/User'); // Importa el modelo de usuario

exports.getUserInfo = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario del middleware

    try {
        const user = await User.findById(userId).select('-contrasena'); // No devolver la contraseña
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// Actualizar User
exports.updateUser = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario del middleware

    // Obtener los campos que se desean actualizar desde req.body
    const { nombre, apellido, correo, telefono, direccion, cedula } = req.body;

    // Crear un objeto con los campos permitidos
    const updates = {};
    if (nombre) updates.nombre = nombre;
    if (apellido) updates.apellido = apellido;
    if (correo) updates.correo = correo;
    if (telefono) updates.telefono = telefono;
    if (direccion) updates.direccion = direccion;

    try {
        // Actualizar el usuario solo con los campos proporcionados
        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado exitosamente', user });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(400).json({ error: error.message });
    }
};

// Eliminar cuenta del usuario
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id); // Suponiendo que el ID del usuario está en req.user
        res.json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};