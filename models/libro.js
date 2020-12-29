const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let libroSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'El libro es un campo requerido']
    },
    autor: {
        type: String,
        required: [true, 'El libro es un campo requerido']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es un campo requerido']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es un campo requerido']
    },
    codigo:{
        type: String,
        required: [true, 'El código es un campo requerido']
    },
    activo: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Libro', libroSchema);