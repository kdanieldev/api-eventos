import { Router } from 'express';
import { validacion_evento } from '../validar.js';
import { buscar_id, aumentar_id } from '../servicios/comun.js';
import {enriquecer_evento, enriquecer_eventos, filtrar_eventos, ordenar_eventos, paginar_eventos, proyectar_eventos, crear_evento, reemplazar_evento, actualizar_evento_parcial, guardar_evento_actualizado, eliminar_evento, cancelar_evento, pagar_alquiler_evento, generar_resumen_eventos, obtener_deudas_organizador, listar_actuaciones, obtener_calendario_mes, responder_preguntas_sala} from '../servicios/eventos.js';
import {calcular_necesidades_evento, descontar_stock_evento} from '../servicios/almacen.js';

const validar_entero = (valor) => {
    const num = Number(valor);
    return Number.isInteger(num) && num > 0 ? num : null;
};

export const crear_router_eventos = (estado) => {
    const router = Router();

    router.get('/resumen', (req, res) => {
        res.status(200).json(generar_resumen_eventos(estado.eventos));
    });

    router.get('/deudas', (req, res) => {
        res.status(200).json(obtener_deudas_organizador(estado.eventos));
    });

    router.get('/actuaciones', (req, res) => {
        res.status(200).json(listar_actuaciones(estado.eventos));
    });

    router.get('/calendario', (req, res) => {
        const mes = req.query.mes || '';
        res.status(200).json(obtener_calendario_mes(estado.eventos, String(mes)));
    });

    router.get('/preguntas', (req, res) => {
        res.status(200).json(responder_preguntas_sala(estado.eventos, estado.productos));
    });

    router.get('/', (req, res) => {
        const enriquecidos = enriquecer_eventos(estado.eventos);
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

    router.get('/:id/necesidades', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        const evento = buscar_id(estado.eventos, id);
        if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        return res.status(200).json(calcular_necesidades_evento(evento, estado.productos));
    });

    router.get('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        const evento = buscar_id(estado.eventos, id);
        if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        return res.status(200).json(enriquecer_evento(evento));
    });

    router.post('/', (req, res) => {
        const errores = validacion_evento(req.body);
        if (errores.length > 0) {
        return res.status(400).json({ errores });
        }

        const nuevoId = aumentar_id(estado.eventos);
        estado.eventos = crear_evento(estado.eventos, req.body, nuevoId);
        const creado = buscar_id(estado.eventos, nuevoId);

        return res.status(201).json(enriquecer_evento(creado));
    });

    router.put('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        if (!buscar_id(estado.eventos, id)) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const errores = validacion_evento(req.body);
        if (errores.length > 0) {
        return res.status(400).json({ errores });
        }

        estado.eventos = reemplazar_evento(estado.eventos, id, req.body);
        const actualizado = buscar_id(estado.eventos, id);

        return res.status(200).json(enriquecer_evento(actualizado));
    });

    router.patch('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        const actual = buscar_id(estado.eventos, id);
        if (!actual) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const candidato = actualizar_evento_parcial(actual, req.body);
        const errores = validacion_evento(candidato);
        if (errores.length > 0) {
        return res.status(400).json({ errores });
        }

        estado.eventos = guardar_evento_actualizado(estado.eventos, id, candidato);
        return res.status(200).json(enriquecer_evento(candidato));
    });

    router.patch('/:id/cancelar', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        const actual = buscar_id(estado.eventos, id);
        if (!actual) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const motivo = req.body?.motivo;
        if (typeof motivo !== 'string' || motivo.trim() === '') {
        return res.status(400).json({ errores: ['Se debe indicar un motivo de cancelación'] });
        }

        if (actual.cancelado?.estado === true || actual.celebrado === true) {
        return res.status(409).json({
            error: 'No se puede cancelar un evento ya cancelado o celebrado'
        });
        }

        const cancelado = cancelar_evento(actual, motivo.trim());
        estado.eventos = guardar_evento_actualizado(estado.eventos, id, cancelado);

        return res.status(200).json(enriquecer_evento(cancelado));
    });

    router.patch('/:id/pagar-alquiler', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        const actual = buscar_id(estado.eventos, id);
        if (!actual) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        if (actual.cobro?.se_cobra !== true || actual.cobro?.cobrado === true) {
        return res.status(409).json({
            error: 'El alquiler no se cobra o ya figura como pagado'
        });
        }

        const pagado = pagar_alquiler_evento(actual);
        estado.eventos = guardar_evento_actualizado(estado.eventos, id, pagado);

        return res.status(200).json(enriquecer_evento(pagado));
    });

    router.patch('/:id/celebrar', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        const actual = buscar_id(estado.eventos, id);
        if (!actual) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        if (actual.cancelado?.estado === true || actual.celebrado === true) {
        return res.status(409).json({
            error: 'No se puede celebrar un evento cancelado o ya celebrado'
        });
        }

        const necesidades = calcular_necesidades_evento(actual, estado.productos);
        if (!necesidades.haySuficienteDeTodo) {
        const faltantes = necesidades.productos.filter((item) => item.falta > 0);
        return res.status(409).json({
            error: 'No hay suficiente stock en el almacén para celebrar el evento',
            faltantes
        });
        }

        estado.productos = descontar_stock_evento(estado.productos, actual);
        const celebrado = { ...actual, celebrado: true };
        estado.eventos = guardar_evento_actualizado(estado.eventos, id, celebrado);

        return res.status(200).json(enriquecer_evento(celebrado));
    });

    router.delete('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del evento debe ser un entero positivo'] });
        }

        if (!buscar_id(estado.eventos, id)) {
        return res.status(404).json({ error: 'Evento no encontrado' });
        }

        estado.eventos = eliminar_evento(estado.eventos, id);
        return res.status(204).send();
    });

    return router;
};