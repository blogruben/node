const fs = require("fs");
console.log('ultima 1');
fs.writeFile("./text.txt", "este es el contenido", function (err) {
  if (err) {
    console.log(err);
  }
  console.log('texto creado');
});
console.log('ultima 2');
console.log('ultima 3');
console.log('ultima 4');