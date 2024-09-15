// Importar modelo 
const Follow = require("../models/follow");
const User = require("../models/user");

// Importar servicio
const followService = require("../services/followService");

// Importar dependencias
const monogoosePaginate = require("mongoose-pagination");

// Acciones de prueba
const pruebaFollow = (req, res) => {
    return res.status(200).send({
        menssage: "Mensaje enviado: follow"
    });
}

// Accion de guardar un follow (accion de seguir)
const save = (req, res) => {
    // Conseguir datos por body
    const params = req.body;

    // Sacar el id del usuario identificado
    const user = req.user;

    // Crear objeto con modelo follow
    let userToFollow = new Follow({
        user: user.id,
        followed: params.followed
    });

    // Guardar  objeto en bbdd
    userToFollow.save()
        .then((userStored) => {
            return res.status(200).send({
                status: "success",
                identity: req.user,
                userStored
            });
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error al guardar el follow",
                error
            })
        });
}

// Accion de borrar un follow (accion de dejar de seguir)
const unfollow = (req, res) => {
    // Recoger el id del usuario identificado
    const userId = req.user.id;

    // Recoger el id del usuario que sigo y quiero dejar de seguir
    const followedId = req.params.id;

    // Find de las coincidencia y hacer remove
    Follow.find({
        "user": userId,
        "followed": followedId
    }
    ).deleteOne()
        .then((followDeleted) => {
            return res.status(200).send({
                status: "success",
                message: "Follow eliminado correctamente",
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error al buscar los follows",
                error
            })
        });
}

// Accion de listado de usuarios que cualquier usuario esta siguiendo 
const following = async (req, res) => {

    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar que me llega el id por parametro en url
    if (req.params.id) {
        const userIdFormat = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        if (userIdFormat && await User.exists({ _id: req.params.id })) {
            userId = req.params.id
        } else {
            return res.status(404).send({
                status: "Error",
                message: "Id del usuario proporcionado no existe"
            })
        }
    }

    // Comprobar que me llega la pagina, si no la pagina 1
    let page = 1;
    if (req.params.page) page = req.params.page

    // Usuarios por pagina quiero mostrar
    const itemsPerPage = 5;

    // Total de follows
    const total = await Follow.countDocuments({ user: userId });

    // Find a follow, popular datos del usuario y paginar con mongoose paginate
    Follow.find({ user: userId })
        .populate("user followed", "-password -role -__v")
        .paginate(page, itemsPerPage)
        .then(async(follow) => {

            // Sacar un array de los usuarios que me siguen y sigo
            let followUserId = await followService.followUserIds(req.user.id);

            return res.status(200).send({
                status: "success",
                message: "Ver listado de usuario que estoy siguiendo",
                follow,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserId.following,
                user_follow_me: followUserId.followers
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error al ver los follows",
                error
            })
        });
}


// Accion de listado de usuarios que sigun a cualquier usuario 
const followed = async (req, res) => {

    // Sacar el id del usuario identificado
    let userId = req.user.id;

    // Comprobar que me llega el id por parametro en url
    if (req.params.id) {
        const userIdFormat = req.params.id.match(/^[0-9a-fA-F]{24}$/);
        if (userIdFormat && await User.exists({ _id: req.params.id })) {
            userId = req.params.id
        } else {
            return res.status(404).send({
                status: "Error",
                message: "Id del usuario proporcionado no existe"
            })
        }
    }

    // Comprobar que me llega la pagina, si no la pagina 1
    let page = 1;
    if (req.params.page) page = req.params.page

    // Usuarios por pagina quiero mostrar
    const itemsPerPage = 5;

    // Total de follows
    const total = await Follow.countDocuments({ followed: userId });

    // Find a follow, popular datos del usuario y paginar con mongoose paginate
    Follow.find({ followed: userId })
        .populate("user", "-password -role -__v")
        .paginate(page, itemsPerPage)
        .then(async(follow) => {

            // Sacar un array de los usuarios que me siguen y sigo
            let followUserId = await followService.followUserIds(req.user.id);

            return res.status(200).send({
                status: "success",
                message: "Ver listado de usuario que me siguen",
                follow,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user_following: followUserId.following,
                user_follow_me: followUserId.followers
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error al ver los follows que me siguen",
                error
            })
        });

}

// Exportar acciones
module.exports = {
    pruebaFollow,
    save,
    unfollow,
    following,
    followed
}