const express = require('express');
const app = express();
const Libro = require('../models/libro');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

//Obtener libros con paginación
app.get('/libro', (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Libro.find({activo: true})
        .skip(desde)
        .limit(limite)
        .exec((err, librosDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            Libro.countDocuments((err, conteo) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }

                res.json({
                    ok: true,
                    libros: librosDB,
                    totalReg: conteo
                });
            });
        });
});

//Obtener libros por filtro de título
app.get('/libro/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Libro.find({titulo: regex, activo: true})
        .exec((err, librosDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            if(!librosDB){
                return res.status(400).json({
                    ok: false,
                    error:{
                        message: 'No existen libros con ese título'
                    }
                });
            }

            res.json({
                ok: true,
                libros: librosDB
            });
        });
});

//Insertar un libro
app.post('/libro', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let libro = new Libro({
        titulo: body.titulo,
        autor: body.autor,
        cantidad: body.cantidad,
        precio: body.precio,
        codigo: body.codigo
    });

    libro.save((err, libroDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            libro: libroDB
        });
    });
});

//Editar un libro
app.put('/libro/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Libro.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, libroDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            libro: libroDB
        });
    });
});

//Eliminar un libro (activo = false)
app.delete('/libro/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Libro.findByIdAndUpdate(id, {activo: false}, {new: true}, (err, libroDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            libro: libroDB
        });
    })
})

module.exports = app;