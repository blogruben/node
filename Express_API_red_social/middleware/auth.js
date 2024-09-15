// Importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// Immportar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;


// MIDDLEWARE de autenticacion 
exports.auth = (req, res, next) => {

    // Comporbar si me llegar la autorizaion de la cabecera
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "Error  no tiene la cabecera de autentificacion."
        })
    }
    // limpiar token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar el token
    try {
        let payload = jwt.decode(token, secret);

        //comprobar expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Token expirado.",
            })
        }

        // Agregar datos del usuario a la request
        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token invalido.",
            error
        })
    }

    // Pasar a ejecutar la accion 
    next();
}

