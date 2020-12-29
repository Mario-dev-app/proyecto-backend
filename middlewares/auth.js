const jwt = require('jsonwebtoken');
const SEED = process.env.SEED;

//Verifica token
let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, SEED, (err, decoded) => {
        if(err){
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
} 

//Verifica ADMIN_ROLE
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if(usuario.role != 'ADMIN_ROLE'){
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
}