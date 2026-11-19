import express from 'express'
import {eventos} from './src/datos/eventos.js'
import {validacion_evento} from './src/validar.js'
import {buscar_id} from './src/servicios/comun.js'

const app = express();

app.get('/', function(req, res) {
    res.status(200);
    // res.json(eventos);
    res.send(validacion_evento(eventos[0]));
});

app.get('/mostrarListado', function(req, res) {
    res.status(200);
    res.json(eventos);
})

app.listen(4000, function() {
    console.log("El servidor se ha abierto en el puerto: 4000");
});