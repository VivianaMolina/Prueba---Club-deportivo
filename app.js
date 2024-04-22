const express = require("express");
const app = express();
const fs = require('fs');
const axios = require('axios');
const router = express.Router();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`El servidor está inicializado en el puerto ${PORT}`)
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON (3 Puntos).
app.get("/agregar", (req, res) => {
    const { nombre, precio } = req.query
    const deporte = { nombre, precio };
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    const deportes = data.deportes;

    deportes.push(deporte);

    fs.writeFileSync("deportes.json", JSON.stringify(data));
    res.send(`Deporte ${nombre} y ${precio} han sido creados exitosamente`);
})

// 2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes registrados (2 Puntos).
app.get("/deportes", (req, res,) => {
    fs.readFile("deportes.json", "utf8", function (e, data) {
        res.write(data);
        res.end();
    });
});

// 3. Crear una ruta que edite el precio de un deporte registrado utilizando los parámetros de la consulta 
// y persista este cambio (2 Puntos).
app.get("/editar", (req, res) => {
    const { nombre, precio } = req.query
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    const deportes = data.deportes;
    deportes.map((e) => {
        if (e.nombre === nombre){
            e.precio = precio
        } else {
            return e;
        }
    })
    fs.writeFileSync("deportes.json", JSON.stringify(data));
    res.send(`Precio de ${nombre} ha sido actualizado a  ${precio}`);
});

//4. Crear una ruta que elimine un deporte solicitado desde el cliente y persista este cambio (3 Puntos).
app.get("/eliminar", (req, res) => {
    const { nombre } = req.query
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    const deportes = data.deportes;
    data.deportes = deportes.filter((elemento) => {
        return elemento.nombre !== nombre;
    })
    fs.writeFileSync("deportes.json", JSON.stringify(data));
    res.send(`Deporte ${nombre} ha sido eliminado exitosamente`);
});

// Ruta genérica que devuelva un mensaje diciendo “Esta página no existe...” al 
// consultar una ruta que no esté definida en el servidor.

app.get("*", (req, res) => {
    res.send("<h2>Esta página no existe </h2>");
});
