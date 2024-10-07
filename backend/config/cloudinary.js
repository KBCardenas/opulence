const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configura Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tu cloud name de Cloudinary
    api_key: process.env.CLOUDINARY_API_KEY,       // Tu API key de Cloudinary
    api_secret: process.env.CLOUDINARY_API_SECRET, // Tu API secret de Cloudinary
});

// Configura el almacenamiento de multer para Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'productos', // Carpeta donde se almacenarán las imágenes
        allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
        transformation: [
            {
                quality: 'auto', // Calidad automática
                fetch_format: 'auto', // Formato automático
            },
        ],
    },
});

// Exporta el middleware de multer
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
