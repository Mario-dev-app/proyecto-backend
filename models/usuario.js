const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValues = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'SELLER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es un campo requerido']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es un campo requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es un campo requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es un campo requerido']
    },
    activo: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValues
    }
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});
module.exports = mongoose.model('Usuario', usuarioSchema);

