// Importar moludos
const fs = require("fs");
const path = require("path");

// Importar modelo
const Publication = require("../models/publication");

// Importar servicios
const followService = require("../services/followService");

// Acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).send({
        menssage: "Mensaje enviado: publication"
    });
}



// Guardar publicacion
const save = (req, res) => {
    // Recoger datos del body
    const params = req.body;

    // Si no me llegan dar repuesta negativa
    if (!params.text) {
        return res.status(400).send({
            status: "error",
            message: "Debes de enviar el texto de la publicacion.",
        })
    }

    // Crear y rellenar el objeto del modelo
    let newPublication = new Publication(params);
    newPublication.user = req.user.id;

    // Guardar objeto en bbdd
    newPublication.save()
        .then((publicationStored) => {
            // Devolver resultado
            if (publicationStored) return res.status(200).send({
                status: "success",
                menssage: "Publicacion registrada correctamente",
                publicationStored
            });
        }).catch(() => {
            return res.status(500).json({
                status: "error",
                message: "Error al guardar la publicacion"
            })
        });

}



// Sacar una publicacion 
const detail = (req, res) => {
    // Sacar el id de publicacio de la urlencoded
    const publicationId = req.params.id;

    // Find con la condicion del id
    Publication.findById(publicationId)
        .then((publicationStored) => {

            return res.status(200).send({
                status: "success",
                message: "Mostrar publicacion.",
                publication: publicationStored
            })
        })
        .catch(() => {
            return res.status(404).send({
                status: "error",
                message: "No existe la publicacion."
            })
        });

}



// Eliminar una publiccion
const remove = async (req, res) => {
    // Sacar el id de la publicacion
    const publicationId = req.params.id;

    try {
        // Find y luego remove
        const publicationRemoved = await Publication.findOneAndDelete({ "user": req.user.id, "_id": publicationId });
        return res.status(200).send({
            status: "success",
            message: "Eliminar mi publiccion.",
            publicationId
        })
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Error al eliminar la publicacion.",
            error
        })
    }


}



// Listar todas las publicaciones
const user = async (req, res) => {
    // Sacar el id del usuario
    const userId = req.params.id;

    // Controlar la pagina
    let page = 1;
    if (req.params.page) page = req.params.page;
    const itemsPerPage = 5;

    try {
        // Find populate order paginar
        // -created_at ordenar al reves (por el menos) de mayor a menor
        const publications = await Publication.find({ user: userId })
            .sort("-created_at")
            .select({ __v: 0 })
            .populate("user", "-password -__v -role")
            .paginate(page, itemsPerPage)
            .exec();

        const total = await Publication.find({ user: userId }).countDocuments();

        // Devolver resultado
        return res.status(200).send({
            status: "success",
            message: "Accion de listar todas las publicaciones.",
            user: req.user,
            page,
            total,
            pages: Math.ceil(total / itemsPerPage),
            publications
        })
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "No existen publicaciones de este usuario.",
            error
        })
    }


}


// Subir ficheros
const upload = (req, res) => {

    // Sacar publication id
    const publicationId = req.params.id;

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

    // si es correcta, guarda la imagen en bbdd
    Publication.findOneAndUpdate({ "user": req.user.id, "_id": publicationId }, { file: req.file.filename }, { new: true })
        .then((publicationUpdated) => {
            return res.status(200).send({
                status: "success",
                publication: publicationUpdated,
                file: req.file
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida del avatar",
                error
            })
        });

}


// Devolver archivos multimedia
const media = (req, res) => {
    // Sacar el parametro de la URL
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;

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


// Listar publicaciones de un usuario en concreto
const feed = async (req, res) => {

    // Sacar la pagina actual
    let page = 1;
    if (req.params.page) page = req.params.page;

    // Establer numero de elemento por pagina
    let itemsPerPage = 5;

    // Sacar un array de usuarios que yo sigo como usurio identificado
    try {
        const myFollows = await followService.followUserIds(req.user.id);

        // Find a publication in, ordenar, popular, paginar
        const publications = await Publication.find({
            user: myFollows.following
        })
            .populate("user", "-password -role -__v")
            .sort("-created_at")
            .paginate(page, itemsPerPage);

        return res.status(200).send({
            status: "success",
            message: "Feed de publications.",
            following: myFollows.following,
            publications
        })
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "No se han listado las publicaciones del feed.",
        })
    }
}


// Exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    remove,
    user,
    upload,
    media,
    feed
}