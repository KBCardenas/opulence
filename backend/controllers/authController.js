// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


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

// Registrar usuario
exports.registerUser = async (req, res) => {
    try {
        const { nombre, apellido, correo, telefono, direccion, contrasena } = req.body;

        // Verificar si el correo ya está en uso
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está en uso' });
        }

        // Hashear la contraseña usando hashSync
        const hashedPassword = bcrypt.hashSync(contrasena, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            nombre,
            apellido,
            correo,
            telefono,
            direccion,
            contrasena: hashedPassword,
        });

        await newUser.save();
        console.log(newUser); // Verificar que el usuario se guarde correctamente

        // Crear el token JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Cambia '1h' según sea necesario

        // Enviar la respuesta con el token y el mensaje
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: newUser,
            token: token, // Incluye el token en la respuesta
        });
    } catch (error) {
        console.error(error); // Agregar logging para verificar el error
        res.status(400).json({ error: error.message });
    }
};

// Iniciar sesion
exports.loginUser = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Verificar si se proporcionan correo y contraseña
        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        // Buscar al usuario por correo
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar el token incluyendo el rol de administrador
        const token = jwt.sign(
            { id: user._id, esAdmin: user.esAdmin }, // Incluir si es administrador
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        // Retornar el token y los datos del usuario
        res.json({
            token,
            user: {
                _id: user._id,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                esAdmin: user.esAdmin // Incluir información de si es administrador
            }
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

// Recuperar contraseña
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
            subject: 'Restablecer contraseña',
            text: `Hola ${user.nombre},\n\nHaga clic en el siguiente enlace para restablecer su contraseña:\n\n` +
            `http://localhost:5173/reset-password/${resetToken}\n\n` + // Cambia el puerto al del frontend
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

// Restablecer contraseña
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
