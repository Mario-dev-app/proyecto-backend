const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const SEED = process.env.SEED;

//Login con usuario y contraseña
app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                error: 'Usuario o password incorrectos'
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                error: 'Usuario o password incorrectos'
            });
        }

        usuarioDB.password = null;
        let token = jwt.sign({
            usuario: usuarioDB
        }, SEED, {expiresIn: '8h'});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;