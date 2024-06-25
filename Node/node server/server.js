
//npm install -g vue-cli
//vue list

//node server.js
//salir con Ctrl-C 

// repositorio npm
//npm install colors

//npm init -> poner info en el package json
//npm install -> desplegar package json


const http = require('http');
const colors = require('colors');
const handServer = function (req, res) {
    res.writeHead(200, {'Content-type':'text/html'});
    res.write('<h1>Hola Mundo</h1>');
    res.end();
}

const server = http.createServer(handServer);

server.listen(3000, function () {
    console.log('Server on port 3000'.green);
});