const mongoose = require("mongoose");

const connection = async() => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_red_social");
        console.log("Conectado correctamente a la bbdd: mi_red_social");
    } catch(error) {
        console.error(error);
        throw new Error("No se podido conectar a la bbdd");
    }
}

module.exports = connection
