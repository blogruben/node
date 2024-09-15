// Importar dependencias y modulos
const bcrypt = require("bcrypt");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// Importar modelos
const User = require("../models/user");

// Importar servicios
const jwt = require("../services/jwt");
const followService = require("../services/followService");
const validate = require("../helpers/validate");

// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        menssage: "Mensaje enviado: user",
        usuario: req.user,
    });
}

// Registro de usuarios
const register = (req, res) => {
    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar que me llegan bien (validacion)
    if (!params.name || !params.password || !params.nick) {
        return res.status(400).send({
            status: "error",
            menssage: "Faltan datos por enviar"
        });
    }

    // Validacion avanzada
    try {
        validate(params);
    } catch (error) {
        return res.status(400).send({
            status: "error",
            menssage: "Validacion no superada",
            error: error.message
        });
    }


    // Control usuarios duplicados
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    }).then(async (user) => {

        if (user && user.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        //cifrar la contrasena
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Crear objeto de usuario
        let user_to_save = new User(params);

        // Guardar usuario en la bbdd
        user_to_save.save().then((userStored) => {
            // Devolver resultado
            if (userStored) return res.status(200).send({
                status: "success",
                menssage: "Usuario registrado correctamente",
                user: userStored
            });
        }).catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error al guardar el usuario",
                error: error.message
            })
        });

    }).catch((error) => {
        return res.status(500).json({
            status: "error",
            message: "Error en la consulta de usuarios",
            error: error.message
        })
    });
}


const login = (req, res) => {
    //recoger parametros del body
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    //buscar en la bbdd si existe
    User.findOne({ email: params.email })
        //.select({ password: 0 })
        .then(user => {

            //comprobar su contrasena
            const pwd = bcrypt.compareSync(params.password, user.password);

            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "No te has identificado correctamente.",
                })
            }

            //Conseguir token
            const token = jwt.createToken(user);

            //Devolver datos usuario
            return res.status(400).send({
                status: "success",
                message: "Te has identificado correctamente.",
                user: {
                    id: user._id,
                    name: user.name,
                    nick: user.nick,
                },
                token: token,
            })
        }
        ).catch((error) => {
            return res.status(400).send({
                status: "error",
                message: "No se encuentra el usuario.",
                error: error.message
            })
        });

}

const profile = (req, res) => {
    // Recibir el parametro del id del usuario por url
    const id = req.params.id;

    // Consulta para sacar los datos del uusario
    // Posteriormente devolver informacion de follow
    User.findById(id)
        .select({ password: 0, role: 0 })
        .then(async (userProfile) => {
            // Devolver el resultado

            // Info de seguimiento
            const followInfo = await followService.followThisUser(req.user.id, id);

            return res.status(200).send({
                status: "success",
                user: userProfile,
                following: followInfo.following,
                followed: followInfo.followers

            })
        })
        .catch((error) => {
            return res.status(400).send({
                status: "error",
                message: "El usuario no existe o hay un error.",
                error: error.message
            })
        });
}

const list = (req, res) => {
    //Controlar en que pagina estamos
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    page = parseInt(page);

    //Consulta con mogoose pagination
    let itemsPerPage = 5;

    // Devolver resultado (posteriormente info de follow)
    User.find()
        .sort('_id')
        .paginate(page, itemsPerPage)
        .then(async (users) => {

            if (!users) {
                return res.status(500).send({
                    status: "error",
                    message: "No hay usuarios disponibles."
                })
            }

            // Ver el total de usuarios
            const total = await User.countDocuments({});

            // Sacar un array de los usuarios que me siguen y sigo
            let followUserId = await followService.followUserIds(req.user.id);

            // Devolver el resultado
            return res.status(200).send({
                status: "success",
                users,
                page,
                itemsPerPage,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserId.following,
                user_follow_me: followUserId.followers
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error en la consulta.",
                error: error.message
            })
        });
}


const update = (req, res) => {

    // Recoger info del usuario a actualizar
    let userIdentity = req.user;
    let userToUpdate = req.body;

    // Eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    // Comprobar si el usuario ya existe
    User.find({
        $or: [
            { email: userToUpdate.email.toLowerCase() },
            { nick: userToUpdate.nick.toLowerCase() }
        ]
    }).then(async (users) => {

        let userIsset = false;
        users.forEach(user => {
            if (user && user._id != userIdentity.id) userIsset = true;
        });

        if (userIsset) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            });
        }

        //cifrar la contrasena
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        }

        // Buscar y actualizar
        try {
            let userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

            if (!userUpdated) {
                return res.status(400).json({
                    status: "error",
                    message: "Error al actualizar el usuarios"
                })
            }

            return res.status(200).send({
                status: "success",
                message: "Metodo de actualizar el usuarios",
                user: userUpdated
            })

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al actualizar",
                error: error.message
            })
        }

    }).catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "Error actualizando el usuarios",
            error: error.message
        })
    });
}


const upload = (req, res) => {

    // Recoger el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Peticion no incluye la imagen"
        })
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    // Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        //Borrar archivo subido
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        // Devolver respuesta negativa
        return res.status(400).send({
            status: "error",
            message: "Extension del fichero invalida"
        })
    }

    // si si es correcta, guarda la imagen en bbdd
    User.findOneAndUpdate({ _id: req.user.id }, { imagen: req.file.filename }, { new: true })
        .then((userUpdated) => {
            return res.status(200).send({
                status: "success",
                user: userUpdated,
                file: req.file
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida del avatar",
                error: error.message
            })
        });

}


const avatar = (req, res) => {
    // Sacar el parametro de la URL
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/avatars/" + file;

    // Comprobar que existe
    fs.stat(filePath, (err, exist) => {
        if (!exist) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            })
        }
        // Devolver un file
        res.sendFile(path.resolve(filePath));

    });
}



// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar
}