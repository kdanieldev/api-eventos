import express from 'express'
import {eventos} from './src/datos/eventos.js'
import {suministros} from './src/datos/almacen.js'
import {pedidos} from './src/datos/pedidos.js';
import { crear_router_eventos } from './src/rutas/eventos.js';
import { crear_router_almacen } from './src/rutas/almacen.js';
import { crear_router_pedidos } from './src/rutas/pedidos.js';

const clonar_estado_inicial = () => ({
    eventos: eventos.map((e) => ({
        ...e,
        etiquetas: [...e.etiquetas],
        fecha: { ...e.fecha },
        entrada: { ...e.entrada },
        organizador: { ...e.organizador },
        cobro: { ...e.cobro },
        cancelado: { ...e.cancelado },
        artistas: e.artistas.map((a) => ({ ...a }))
    })),
    productos: suministros.map((p) => ({
        ...p,
        compra: { ...p.compra },
        proveedor: { ...p.proveedor },
        consumo: { ...p.consumo }
    })),
    pedidos: pedidos.map((pe) => ({
        ...pe,
        lineas: pe.lineas.map((l) => ({ ...l }))
    }))
});

const app = express();
const estado = clonar_estado_inicial();

app.use(express.json());

app.use('/api/eventos', crear_router_eventos(estado));
app.use('/api/productos', crear_router_almacen(estado));
app.use('/api/pedidos', crear_router_pedidos(estado));

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Error interno' });
});


app.listen(4000, function() {
    console.log("El servidor se ha abierto en el puerto: 4000");
});