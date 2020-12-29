const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Obtener usuarios (paginado)
app.get('/usuario', [verificaToken, verificaAdminRole] , (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Usuario.find({}, 'nombre apellido email role activo')
            .skip(desde)
            .limit(limite)
            .exec((err, usuariosDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        error: err
                    });
                }

                usuariosDB.password = null;
                res.json({
                    ok: true,
                    usuarios: usuariosDB
                });
            });

});

//Crear usuario
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, saltRounds),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        usuarioBD.password = null;
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

//Modificar usuario
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let body = _.pick(req.body, ['nombre', 'apellido', 'role', 'activo']);
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//Cambiar estado de usuario (activo = value)
app.delete('/usuario/:id/:value', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let value = req.params.value;

    Usuario.findByIdAndUpdate(id, {activo: value}, {new: true}, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;