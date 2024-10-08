const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary'); // Asegúrate de que esté correctamente importado

// Listar productos
exports.listProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

exports.addProduct = async (req, res) => {
    const { nombre, descripcion, categoria, precio, stock, etiquetas } = req.body;
    const fotos = req.files;

    try {
        // Verifica si se han subido fotos
        if (!fotos || fotos.length === 0) {
            return res.status(400).json({ error: 'Debes subir al menos una imagen' });
        }

        // Mapea las fotos a sus URL
        const imageUrls = fotos.map(file => file.path);

        // Crea un nuevo producto
        const newProduct = new Product({
            nombre,
            descripcion,
            categoria,
            precio,
            stock,
            fotos: imageUrls,
            etiquetas,
        });

        // Guarda el nuevo producto en la base de datos
        await newProduct.save();

        // Responde con éxito
        return res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
    } catch (error) {
        console.error('Error al agregar producto:', JSON.stringify(error, null, 2));
        // Asegúrate de que el mensaje de error en la respuesta sea más detallado
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

exports.updateProduct = async (req, res) => {
    const { productId, updatedData, categoriasToAdd, etiquetasToAdd, etiquetasToDelete, imagesToRemove } = req.body;
    const images = req.files; // Obtener las nuevas imágenes subidas

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar los datos del producto
        product.nombre = updatedData.nombre || product.nombre;
        product.descripcion = updatedData.descripcion || product.descripcion;

        // Actualizar la categoría
        if (updatedData.categoria) {
            product.categoria = updatedData.categoria; // Reemplazar la categoría existente
        }

        // Agregar nuevas categorías
        if (categoriasToAdd && categoriasToAdd.length > 0) {
            product.categoria.push(...categoriasToAdd.filter(c => !product.categoria.includes(c))); // Añadir solo si no existe
        }

        // Actualizar precio y stock
        product.precio = updatedData.precio || product.precio;
        product.stock = updatedData.stock || product.stock;

        // Agregar nuevas etiquetas
        if (etiquetasToAdd && etiquetasToAdd.length > 0) {
            product.etiquetas.push(...etiquetasToAdd.filter(e => !product.etiquetas.includes(e))); // Añadir solo si no existe
        }

        // Eliminar etiquetas especificadas
        if (etiquetasToDelete && etiquetasToDelete.length > 0) {
            const etiquetasExistentes = product.etiquetas.flatMap(etiqueta => etiqueta.split(', '));
            const etiquetasFiltradas = etiquetasExistentes.filter(etiqueta => !etiquetasToDelete.includes(etiqueta));
            product.etiquetas = [...new Set(etiquetasFiltradas)]; // Usar Set para evitar duplicados
        }

        // Eliminar imágenes especificadas
        if (imagesToRemove && imagesToRemove.length > 0) {
            product.fotos = product.fotos.filter(foto => !imagesToRemove.includes(foto)); // Filtrar imágenes
        }

        // Verificamos si hay imágenes para subir
        if (images && images.length > 0) {
            // Mapea las imágenes a sus URLs en Cloudinary
            const uploadPromises = images.map(file => cloudinary.uploader.upload(file.path));
            const uploadedImages = await Promise.all(uploadPromises);
            const imageUrls = uploadedImages.map(image => image.secure_url); // Obtén las URLs seguras
            product.fotos.push(...imageUrls); // Usa push para añadir nuevas URLs
        }

        // Guardar el producto actualizado
        await product.save();

        res.json({ message: 'Producto actualizado con imágenes', product });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        console.log('Producto encontrado:', product);

        const deletePromises = product.fotos.map(async (imageUrl) => {
            const publicId = imageUrl.split('/').pop().split('.')[0]; // Extraer el public_id
            console.log('Eliminando imagen con publicId:', publicId); // Agregar log para verificar el publicId
            const result = await cloudinary.uploader.destroy(publicId); // Eliminar imagen
            console.log('Resultado de la eliminación:', result); // Verificar el resultado
        });

        await Promise.all(deletePromises);

        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

// Función para buscar productos
exports.searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        const products = await Product.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } }, // Buscar por nombre
                { categoria: { $regex: query, $options: 'i' } } // Buscar por categoría
            ],
        });

        res.json(products); // Retornar productos encontrados
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos' }); // Manejar errores
    }
};

// Filtrar productos
exports.filterProducts = async (req, res) => {
    const { categoria, minPrecio, maxPrecio } = req.query;
    const filters = {};
    if (categoria) filters.categoria = categoria;
    if (minPrecio) filters.precio = { $gte: minPrecio };
    if (maxPrecio) filters.precio = { $lte: maxPrecio };

    try {
        const products = await Product.find(filters);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al filtrar productos' });
    }
};

// Función para buscar productos según etiquetas, categoría y ofertas
exports.buscarProductosEnOferta = async (req, res) => {
    const { etiquetas, categoria, enOferta } = req.query;

    // Inicializar el objeto de filtros
    const filters = {};

    // Agregar filtros según las consultas
    if (etiquetas) {
        // Filtrar productos que contengan al menos una de las etiquetas
        filters.etiquetas = { $in: etiquetas.split(',') };
    }
    if (categoria) {
        // Filtrar productos que contengan al menos una de las categorías
        filters.categoria = { $in: categoria.split(',') };
    }
    if (enOferta !== undefined) {
        // Filtrar por estado de oferta
        filters.enOferta = enOferta === 'true'; // Convierte a booleano
    }

    try {
        const products = await Product.find(filters);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos' });
    }
};

// Función para obtener detalles de un producto
exports.getProductDetails = async (req, res) => {
    const { productId } = req.params; // Obtener el ID del producto desde los parámetros de la ruta
    try {
        const product = await Product.findById(productId); // Buscar el producto por ID
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // Manejo del caso donde no se encuentra el producto
        }
        res.json(product); // Devolver el producto encontrado
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalles del producto' }); // Manejo de errores
    }
};

// Función para actualizar atributos del producto
exports.updateProductAttributes = async (req, res) => {
    const { productId, newStock, enOferta, descuento } = req.body; // Desestructurar los atributos del cuerpo de la petición
    try {
        const product = await Product.findById(productId); // Buscar el producto por ID
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // Manejo del caso donde no se encuentra el producto
        }

        // Actualizar stock si se proporciona
        if (newStock !== undefined) {
            product.stock = newStock; // Actualiza el stock
            // Eliminar el producto si el stock es 0
            if (newStock === 0) {
                await product.remove(); // Eliminar el producto de la base de datos
                return res.json({ message: 'Producto eliminado por stock 0' });
            }
        }

        // Cambiar el estado de la oferta si se proporciona
        if (enOferta !== undefined) {
            product.enOferta = enOferta; // Actualiza el estado de la oferta
            if (enOferta && descuento !== undefined) {
                product.precio = product.precio - (product.precio * (descuento / 100)); // Aplica el descuento
            }
        }

        await product.save(); // Guardar los cambios en la base de datos
        res.json({ message: 'Atributos del producto actualizados', product }); // Respuesta exitosa
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar atributos del producto' }); // Manejo de errores
    }
};

// Función para agregar una valoración
exports.addReview = async (req, res) => {
    const { productId, rating, comment } = req.body; // Desestructurar los datos del cuerpo de la petición
    try {
        const product = await Product.findById(productId); // Buscar el producto por ID
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // Manejo del caso donde no se encuentra el producto
        }

        // Verificar si la valoración es válida
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'La valoración debe estar entre 1 y 5' }); // Manejo de valoraciones inválidas
        }

        // Crear una nueva valoración
        const newReview = {
            usuario: req.user._id, // Asumiendo que el ID del usuario está disponible en req.user
            estrellas: rating,
            comentario: comment,
            fecha: Date.now()
        };

        product.valoraciones.push(newReview); // Agregar la valoración al producto
        await product.save(); // Guardar los cambios en la base de datos
        res.json({ message: 'Reseña agregada', product }); // Respuesta exitosa
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar reseña' }); // Manejo de errores
    }
};

// Función para gestionar valoraciones
exports.manageValoraciones = async (req, res) => {
    const { productId, rating, comment, action } = req.body; // Desestructurar los datos del cuerpo de la petición
    try {
        const product = await Product.findById(productId); // Buscar el producto por ID
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // Manejo del caso donde no se encuentra el producto
        }

        switch (action) {
            case 'add': // Agregar valoración
                // Verificar si la valoración es válida
                if (rating < 1 || rating > 5) {
                    return res.status(400).json({ message: 'La valoración debe estar entre 1 y 5' }); // Manejo de valoraciones inválidas
                }

                // Crear una nueva valoración
                const newReview = {
                    usuario: req.user._id, // Asumiendo que el ID del usuario está disponible en req.user
                    estrellas: rating,
                    comentario: comment,
                    fecha: Date.now()
                };

                product.valoraciones.push(newReview); // Agregar la valoración al producto
                await product.save(); // Guardar los cambios en la base de datos
                return res.json({ message: 'Reseña agregada', product }); // Respuesta exitosa

            case 'delete': // Eliminar valoración
                const reviewIndex = product.valoraciones.findIndex(review => review.usuario.toString() === req.user._id.toString());
                if (reviewIndex === -1) {
                    return res.status(404).json({ message: 'Valoración no encontrada' }); // Manejo del caso donde no se encuentra la valoración
                }
                product.valoraciones.splice(reviewIndex, 1); // Eliminar la valoración
                await product.save(); // Guardar los cambios en la base de datos
                return res.json({ message: 'Valoración eliminada', product }); // Respuesta exitosa

            case 'list': // Listar valoraciones
                return res.json(product.valoraciones); // Devolver las valoraciones del producto

            default:
                return res.status(400).json({ message: 'Acción no válida' }); // Manejo de acciones no válidas
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al gestionar valoraciones' }); // Manejo de errores
    }
};

// Función para incrementar vistas
exports.incrementarVistas = async (req, res) => {
    const { productId } = req.params; // Obtener el ID del producto de los parámetros de la solicitud
    try {
        const product = await Product.findById(productId); // Buscar el producto por ID
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // Manejo del caso donde no se encuentra el producto
        }
        
        product.vistas += 1; // Incrementar el contador de vistas
        await product.save(); // Guardar los cambios en la base de datos
        res.json({ message: 'Contador de vistas incrementado', vistas: product.vistas }); // Respuesta exitosa
    } catch (error) {
        res.status(500).json({ error: 'Error al incrementar vistas' }); // Manejo de errores
    }
};

// Función para calcular precio con descuento
exports.calcularPrecioConDescuento = async (req, res) => {
    try {
        const productId = req.params.id;
        const producto = await Product.findById(productId);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        // Suponiendo que el descuento se define como un porcentaje en el campo descuento
        let precioFinal = producto.precio;

        if (producto.enOferta) {
            // Aplica un descuento del 20% como ejemplo (puedes ajustar el porcentaje)
            const descuento = 0.20; // Por ejemplo, 20% de descuento
            precioFinal = producto.precio - (producto.precio * descuento);
        }

        res.status(200).json({
            producto: producto.nombre,
            precioOriginal: producto.precio,
            enOferta: producto.enOferta,
            precioConDescuento: precioFinal
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calcular el precio con descuento', error });
    }
};

