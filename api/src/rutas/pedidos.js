import { Router } from 'express';
import { validacion_pedido } from '../validar.js';
import { buscar_id, aumentar_id } from '../servicios/comun.js';
import {listar_pedidos, enriquecer_pedido, crear_pedido_manual, generar_pedido_automatico, recibir_pedido} from '../servicios/pedidos.js';

const validar_entero = (valor) => {
    const num = Number(valor);
    return Number.isInteger(num) && num > 0 ? num : null;
};

export const crear_router_pedidos = (estado) => {
    const router = Router();

    router.get('/', (req, res) => {
        res.status(200).json(listar_pedidos(estado.pedidos, req.query.pendiente));
    });

    router.post('/automatico', (req, res) => {
        const nuevoId = aumentar_id(estado.pedidos);
        const resultado = generar_pedido_automatico(
        estado.pedidos,
        estado.eventos,
        estado.productos,
        nuevoId
        );

        if (!resultado) {
        return res.status(409).json({
            error: 'No hace falta pedir ningún producto según la previsión actual'
        });
        }

        estado.pedidos = resultado.pedidos;
        return res.status(201).json(enriquecer_pedido(resultado.pedido, estado.productos));
    });

    router.get('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del pedido debe ser un entero positivo'] });
        }

        const pedido = buscar_id(estado.pedidos, id);
        if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        return res.status(200).json(enriquecer_pedido(pedido, estado.productos));
    });

    router.post('/', (req, res) => {
        const pedidoCandidato = {
        fecha: new Date().toISOString().slice(0, 10),
        lineas: req.body?.lineas
        };

        const errores = validacion_pedido(pedidoCandidato, estado.productos);
        if (errores.length > 0) {
        return res.status(400).json({ errores });
        }

        const nuevoId = aumentar_id(estado.pedidos);
        const resultado = crear_pedido_manual(
        estado.pedidos,
        pedidoCandidato,
        estado.productos,
        nuevoId
        );

        estado.pedidos = resultado.pedidos;
        return res.status(201).json(enriquecer_pedido(resultado.pedido, estado.productos));
    });

    router.patch('/:id/recibir', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del pedido debe ser un entero positivo'] });
        }

        const resultado = recibir_pedido(estado.pedidos, estado.productos, id);
        if (resultado.error === 'not_found') {
        return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (resultado.error === 'already_received') {
        return res.status(409).json({ error: 'El pedido ya ha sido recibido anteriormente' });
        }

        estado.pedidos = resultado.pedidos;
        estado.productos = resultado.productos;

        return res.status(200).json(enriquecer_pedido(resultado.pedido, estado.productos));
    });

    return router;
};