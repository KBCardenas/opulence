const Payment = require('../models/Payment');

exports.procesarPago = async (req, res) => {
    try {
        const { metodoPago, total, detallesPago } = req.body;
        const nuevoPago = new Payment({
            usuario: req.user._id,
            metodoPago,
            total,
            detallesPago
        });
        await nuevoPago.save();
        res.status(200).json({ mensaje: 'Pago procesado exitosamente', pago: nuevoPago });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar el pago', error });
    }
};

exports.confirmarPago = async (req, res) => {
    try {
        const { pagoId } = req.body;
        const pago = await Payment.findById(pagoId);
        if (!pago) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }
        pago.estado = 'confirmado';
        await pago.save();
        res.status(200).json({ mensaje: 'Pago confirmado exitosamente', pago });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al confirmar el pago', error });
    }
};

exports.historialPagos = async (req, res) => {
    try {
        const pagos = await Payment.find({ usuario: req.user._id });
        res.status(200).json({ pagos });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el historial de pagos', error });
    }
};
