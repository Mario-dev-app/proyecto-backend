const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clienteSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es un campo requerido']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido es un campo requerido']
    },
    nroDoc: {
        type: String,
        required: [true, 'El nro de documento es un campo requerido']
    },
    email: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: false
    },
    activo: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Cliente', clienteSchema);