// controllers/userController.js
const User = require('../models/User'); // Importa el modelo de usuario
const bcrypt = require('bcryptjs'); // Para manejar el hashing de contraseñas

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
    if (cedula) updates.cedula = cedula;

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

// Cambiar contraseña
exports.changePassword = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario del middleware
    const { currentPassword, newPassword } = req.body; // Obtener las contraseñas desde el cuerpo de la solicitud
    
    console.log('ID de usuario:', userId);
    console.log('Contraseña actual recibida:', currentPassword);
    console.log('Nueva contraseña recibida:', newPassword);
    try {
        // Buscar al usuario en la base de datos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Hash la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        user.contrasena = hashedPassword;
        await user.save();

        res.json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(400).json({ error: error.message });
    }
};

// Actualizar información de pago
exports.updatePaymentInfo = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario del middleware

    const { informacionPago } = req.body; // Asegúrate de que 'informacionPago' sea un objeto o un arreglo
    try {
        // Validar que se haya pasado 'informacionPago'
        if (!informacionPago) {
            return res.status(400).json({ message: 'La información de pago es requerida' });
        }

        // Actualizar la información de pago
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { informacionPago } }, // Agregar la nueva información al arreglo
            { new: true, runValidators: true } // Retornar el nuevo usuario actualizado
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Información de pago actualizada exitosamente', user });
    } catch (error) {
        console.error('Error al actualizar la información de pago:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.deletePaymentInfo = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario autenticado
    const { metodoPagoId } = req.body; // Obtener el ID del método de pago que se va a eliminar

    try {
        // Buscar el usuario y eliminar el método de pago
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { informacionPago: { _id: metodoPagoId } } }, // Eliminar el método de pago con el ID proporcionado
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Método de pago eliminado exitosamente', user });
    } catch (error) {
        console.error('Error al eliminar el método de pago:', error);
        res.status(400).json({ error: error.message });
    }
};