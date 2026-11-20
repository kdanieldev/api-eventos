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
import {enriquecer_eventos} from './src/servicios/eventos.js';
import {ordenar_eventos} from './src/servicios/eventos.js';
import {filtrar_eventos} from './src/servicios/eventos.js';
import {paginar_eventos} from './src/servicios/eventos.js';
import {proyectar_eventos} from './src/servicios/eventos.js';
import {enriquecer_evento, crear_evento, reemplazar_evento, actualizar_evento_parcial, guardar_evento_actualizado, eliminar_evento, cancelar_evento, pagar_alquiler_evento, generar_resumen_eventos, obtener_deudas_organizador, listar_actuaciones, obtener_calendario_mes, responder_preguntas_sala} from './src/servicios/eventos.js';



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

app.get('/probar-consulta', (req, res) => {
    const enriquecidos = enriquecer_eventos(eventos);
    const filtrados = filtrar_eventos(enriquecidos, req.query);
    const ordenados = ordenar_eventos(filtrados, req.query.orden, req.query.dir);
    const pagina = Number(req.query.pagina) || 1;
    const limite = Number(req.query.limite) || 10;
    const paginados = paginar_eventos(ordenados, pagina, limite);
    const datos = proyectar_eventos(paginados, req.query.campos);

    res.status(200).json({
        total: filtrados.length,
        pagina,
        limite,
        datos
    });
});


app.get('/probar-crud-informes', (req, res) => {
    const nuevoId = aumentar_id(eventos);
    const copiaEvento1 = {...buscar_id(eventos, 1),
        titulo: 'Nuevo Monólogo de Prueba'
    };

    const listaTrasCrear = crear_evento(eventos, copiaEvento1, nuevoId);
    const listaTrasReemplazar = reemplazar_evento(listaTrasCrear, nuevoId, {...copiaEvento1,
        titulo: 'Monólogo Reemplazado'
    });

    const evento7Actual = buscar_id(listaTrasReemplazar, 7);
    const evento7Patch = actualizar_evento_parcial(evento7Actual, {
        id: 999,
        balance: 12345,
        entrada: { precio: 5 }
    });
    const listaTrasPatch = guardar_evento_actualizado(listaTrasReemplazar, 7, evento7Patch);
    const listaTrasEliminar = eliminar_evento(listaTrasPatch, nuevoId);

    const evento7Cancelado = cancelar_evento(evento7Actual, 'Prueba de cancelación');
    const evento7Pagado = pagar_alquiler_evento(evento7Actual);

    res.status(200).json({
        longitudOriginal: eventos.length,
        longitudTrasCrearYBorrar: listaTrasEliminar.length,
        evento7PatchPrecio: buscar_id(listaTrasPatch, 7)?.entrada.precio,
        evento7PatchIdConservado: buscar_id(listaTrasPatch, 7)?.id,
        evento7Cancelado: evento7Cancelado.cancelado,
        evento7Pagado: evento7Pagado.cobro.cobrado,
        resumen: generar_resumen_eventos(eventos),
        resumenVacio: generar_resumen_eventos([]),
        deudas: obtener_deudas_organizador(eventos),
        actuaciones: listar_actuaciones(eventos),
        calendarioNoviembre: obtener_calendario_mes(eventos, '2026-11'),
        preguntas: responder_preguntas_sala(eventos, suministros),
        evento7Enriquecido: enriquecer_evento(evento7Actual)
    });
});




app.listen(4000, function() {
    console.log("El servidor se ha abierto en el puerto: 4000");
});