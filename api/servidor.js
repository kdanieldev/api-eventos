import express from 'express'
import {eventos} from './src/datos/eventos.js'
import {suministros} from './src/datos/almacen.js'
import {pedidos} from './src/datos/pedidos.js';
import {validacion_evento} from './src/validar.js'
import {validacion_almacen} from './src/validar.js'
import {validacion_pedido} from './src/validar.js';
import {buscar_id} from './src/servicios/comun.js'

const app = express();

app.get('/', function(req, res) {
    res.status(200);
    // res.json(eventos);
    res.send(validacion_evento(eventos[0]));
});

app.get('/listadoAlmacen', function(req, res) {
    res.status(200);
    // res.json(eventos);
    res.send(validacion_almacen(suministros[0]));
});


app.get('/listadoPedidos', function(req, res) {
    res.status(200);
    res.send(validacion_pedido(pedidos[0], suministros));
});

app.get('/mostrarListado', function(req, res) {
    res.status(200);
    res.json(eventos);
})

app.listen(4000, function() {
    console.log("El servidor se ha abierto en el puerto: 4000");
});