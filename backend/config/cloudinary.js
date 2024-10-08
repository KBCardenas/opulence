const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Asegúrate de cargar dotenv

// Configura Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura el almacenamiento de multer para Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'productos', // Carpeta donde se almacenarán las imágenes
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
        transformation: [
            {
                quality: 'auto',
                fetch_format: 'auto',
            },
        ],
    },
});

// Exporta el middleware de multer
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
