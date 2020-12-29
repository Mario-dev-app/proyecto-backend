const express = require('express');
const app = express();
const { verificaToken } = require('../middlewares/auth');
const Cliente = require('../models/cliente');

//Obtener clientes paginados
app.get('/cliente', [verificaToken], (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Cliente.find({activo: true})
        .skip(desde)
        .limit(limite)
        .exec((err, clientesDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                clientes: clientesDB
            });
        });
});

//Insertar un nuevo cliente
app.post('/cliente', [verificaToken], (req, res) => {
    let body = req.body;
    let cliente = new Cliente({
        nombre: body.nombre,
        apellidos: body.apellidos,
        nroDoc: body.nroDoc,
        email: body.email,
        telefono: body.telefono
    });

    cliente.save((err, clienteDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB
        });
    });
});

//Modificar cliente
app.put('/cliente/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Cliente.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, clienteDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!clienteDB){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontró cliente con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB
        });
    })
})

//Eliminar cliente (activo = false)
app.delete('/cliente/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    Cliente.findByIdAndUpdate(id, {activo: false}, {new: true}, (err, clienteDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!clienteDB){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontró cliente con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB
        });
    });
});

module.exports = app;