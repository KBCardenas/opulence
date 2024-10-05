// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Configurar el transporter de Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Asegúrate de usar el host correcto
    port: 465,               // Puerto para SMTP seguro
    secure: true,            // true para conexiones seguras SSL/TLS
    auth: {
        user: "opulencerestablecimiento@gmail.com",  // Tu correo de Gmail
        pass: "ysdjwubfdruufhin"  // Contraseña de aplicación (sin espacios)
    }
});


// controllers/userController.js
exports.registerUser = async (req, res) => {
    try {
        const { nombre, apellido, correo, telefono, direccion, cedula, contrasena } = req.body;

        // Verificar si el correo ya está en uso
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }

        // Hashear la contraseña usando hashSync
        const hashedPassword = bcrypt.hashSync(contrasena, 10); // Hashear la contraseña

        // Crear un nuevo usuario
        const newUser = new User({
            nombre,
            apellido,
            correo,
            telefono,
            direccion,
            cedula,
            contrasena: hashedPassword,
        });

        await newUser.save();
        console.log(newUser); // Verificar que la contraseña se guarde correctamente
        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        console.error(error); // Agregar logging para verificar el error
        res.status(400).json({ error: error.message });
    }
};


// Autenticación
exports.loginUser = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error); // Detallar el error aquí
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

exports.logoutUser = (req, res) => {
    res.json({ message: 'Sesión cerrada' });
};

// Recuperación de contraseñas
exports.forgotPassword = async (req, res) => {
    const { correo } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar un token de restablecimiento de contraseña válido por 1 hora
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Configuración del correo que se enviará al usuario
        const mailOptions = {
            from: process.env.EMAIL_USER, // Enviar desde el correo configurado
            to: correo, // Correo del usuario
            subject: 'Restablecer contraseña',
            text: `Hola ${user.nombre},\n\nHaga clic en el siguiente enlace para restablecer su contraseña:\n\n` +
                `http://localhost:3000/reset-password/${resetToken}\n\n` +
                `Este enlace será válido por una hora.\n\nSi no solicitaste restablecer tu contraseña, puedes ignorar este correo.\n`
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        // Responder que el correo se ha enviado
        res.json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(400).json({ error: error.message });
    }
};

// Resablecimiento
exports.resetPassword = async (req, res) => {
    const { token, nuevaContrasena } = req.body;

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id); // Encuentra al usuario usando el ID del token

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Hashear la nueva contraseña antes de guardarla
        user.contrasena = bcrypt.hashSync(nuevaContrasena, 10);
        await user.save();

        return res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
        console.error('Error en el restablecimiento de contraseña:', error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    }
};


// Gestión del perfil
exports.getUserById = async (req, res) => {
    console.log('Entrando en getUserById');
    console.log('req.user:', req.user);
    
    try {
        if (!req.user || !req.user.id) {
            console.log('ID de usuario no encontrado en req.user');
            return res.status(400).json({ error: 'ID de usuario no proporcionado' });
        }

        console.log('Estado de la conexión a MongoDB:', mongoose.connection.readyState);
        console.log('Buscando usuario con ID:', req.user.id);
        const user = await User.findById(req.user.id);
        console.log('Resultado de la búsqueda:', user);
        
        if (!user) {
            console.log('Usuario no encontrado en la base de datos');
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        console.log('Usuario encontrado, enviando respuesta');
        res.json(user);
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

// Actualizar Usuario
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

// Activar Vendedor
exports.convertToSeller = async (req, res) => {
    const { userId } = req.body; // ID del usuario a convertir a vendedor
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        user.rol = 'vendedor'; // Suponiendo que tienes un campo de rol en tu modelo User
        await user.save();
        res.json({ message: 'Usuario convertido a vendedor exitosamente', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Desactivar Vendedor
exports.deactivateSeller = async (req, res) => {
    const { userId } = req.body; // ID del usuario a desactivar como vendedor
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        user.rol = 'comprador'; // Cambiar rol a comprador
        await user.save();
        res.json({ message: 'Rol de vendedor desactivado exitosamente', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Convertir a administrador
exports.makeAdmin = async (req, res) => {
    try {
        // Obtener el ID del usuario desde el token
        const userIdToMakeAdmin = req.body.userId; // Espera que el ID del usuario a convertir en admin se pase en el cuerpo de la solicitud

        const user = await User.findById(userIdToMakeAdmin); // Busca el usuario con el ID proporcionado

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Asignar el rol de administrador
        user.rol = 'admin';
        await user.save();

        res.status(200).json({ message: 'El usuario ha sido convertido en administrador.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al convertir al usuario en administrador', error });
    }
};

// Solicitud para convertirse en vendedor
exports.requestSeller = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Asumiendo que req.user contiene el ID del usuario autenticado

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario ya ha solicitado ser vendedor o si ya es vendedor
        if (user.pendingVendorApproval || user.isVendor) {
            return res.status(400).json({ message: 'Ya has solicitado ser vendedor o ya eres vendedor' });
        }

        // Marcar el estado como "pendiente de aprobación"
        user.pendingVendorApproval = true;
        await user.save();

        res.status(200).json({ message: 'Solicitud para ser vendedor enviada. Espera la aprobación del administrador.' });
    } catch (error) {
        console.error('Error al solicitar ser vendedor:', error);
        res.status(500).json({ message: 'Error al solicitar ser vendedor', error: error.message });
    }
};

// Aprobar solicitud de vendedor (solo para administradores)
exports.approveSeller = async (req, res) => {
    try {
        // Obtener el ID del usuario desde el cuerpo de la solicitud
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Aprobar la solicitud de vendedor
        user.isVendor = true;
        user.pendingVendorApproval = false;
        await user.save();

        res.status(200).json({ message: 'Solicitud de vendedor aprobada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar la solicitud de vendedor', error });
    }
};

// Rechazar solicitud de vendedor (solo para administradores)
exports.rejectSeller = async (req, res) => {
    try {
        // Obtener el ID del usuario desde el cuerpo de la solicitud
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Rechazar la solicitud de vendedor
        user.pendingVendorApproval = false;
        await user.save();

        res.status(200).json({ message: 'Solicitud de vendedor rechazada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al rechazar la solicitud de vendedor', error });
    }
};

// Listar usuarios
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar user
exports.searchUser = async (req, res) => {
    const { nombre, cedula, telefono, correo } = req.query;
    try {
        const query = {};
        if (nombre) query.nombre = nombre;
        if (cedula) query.cedula = cedula;
        if (telefono) query.telefono = telefono;
        if (correo) query.correo = correo;

        const users = await User.find(query);
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};