//importar dependencias
const connection = require("./database/connection.js");
const express = require("express");
const cors = require("cors");

//Mensaje de bienvenido
console.log("API NODE para RED SOCIAL arrancada !!");

// Conexion a bbdd
connection();

// Crear servidor
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargar conf rutas
const UserRoutes = require("./routes/user.js");
const PublicationRoutes = require("./routes/publication.js");
const FollowRoutes = require("./routes/follow.js");

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "ruben",
            "mail": "info@gmail.com"
        }
    );
});

// Poner el servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo por", puerto);
})

