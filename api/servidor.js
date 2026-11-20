import express from 'express'
import {eventos} from './src/datos/eventos.js'
import {suministros} from './src/datos/almacen.js'
import {pedidos} from './src/datos/pedidos.js';
import {validacion_evento} from './src/validar.js'
import {validacion_almacen} from './src/validar.js'
import {validacion_pedido} from './src/validar.js';
import {buscar_id} from './src/servicios/comun.js'
import {aumentar_id} from './src/servicios/comun.js';
import {calcular_camareros} from './src/servicios/eventos.js';
import {calcular_coste_personal} from './src/servicios/eventos.js';
import {calcular_coste_artistas} from './src/servicios/eventos.js';
import {calcular_balance_evento} from './src/servicios/eventos.js';

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

app.get('/probar-servicios', (req, res) => {
    const eventoNormal = buscar_id(eventos, 1);
    const eventoCancelado = buscar_id(eventos, 2);
    const eventoFiesta = buscar_id(eventos, 5);

    res.status(200).json({
        siguienteId: aumentar_id(eventos),
        normal: {
        titulo: eventoNormal.titulo,
        camareros: calcular_camareros(eventoNormal),
        costePersonal: calcular_coste_personal(eventoNormal),
        costeArtistas: calcular_coste_artistas(eventoNormal),
        balance: calcular_balance_evento(eventoNormal)
        },
        cancelado: {
        titulo: eventoCancelado.titulo,
        camareros: calcular_camareros(eventoCancelado),
        costePersonal: calcular_coste_personal(eventoCancelado),
        costeArtistas: calcular_coste_artistas(eventoCancelado),
        balance: calcular_balance_evento(eventoCancelado)
        },
        fiesta: {
        titulo: eventoFiesta.titulo,
        camareros: calcular_camareros(eventoFiesta),
        costePersonal: calcular_coste_personal(eventoFiesta),
        costeArtistas: calcular_coste_artistas(eventoFiesta),
        balance: calcular_balance_evento(eventoFiesta)
        }
    });
});

app.listen(4000, function() {
    console.log("El servidor se ha abierto en el puerto: 4000");
});