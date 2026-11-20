import { Router } from 'express';
import { validacion_almacen } from '../validar.js';
import { buscar_id, aumentar_id } from '../servicios/comun.js';
import { crear_producto, actualizar_producto_parcial, guardar_producto_actualizado, eliminar_producto, calcular_prevision_almacen, calcular_valor_almacen} from '../servicios/almacen.js';

const validar_entero = (valor) => {
    const num = Number(valor);
    return Number.isInteger(num) && num > 0 ? num : null;
};

export const crear_router_almacen = (estado) => {
    const router = Router();

    router.get('/valor', (req, res) => {
        res.status(200).json(calcular_valor_almacen(estado.productos));
    });

    router.get('/prevision', (req, res) => {
        res.status(200).json(calcular_prevision_almacen(estado.eventos, estado.productos));
    });

    router.get('/', (req, res) => {
        const { categoria, bajoMinimo } = req.query;

        const filtrados = estado.productos.filter((producto) => {
        if (categoria && producto.categoria !== categoria) {
            return false;
        }
        if (String(bajoMinimo) === 'true' && producto.disponibles >= producto.minimo) {
            return false;
        }
        return true;
        });

        res.status(200).json(filtrados);
    });

    router.get('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del producto debe ser un entero positivo'] });
        }

        const producto = buscar_id(estado.productos, id);
        if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json(producto);
    });

    router.post('/', (req, res) => {
        const errores = validacion_almacen(req.body);
        if (errores.length > 0) {
        return res.status(400).json({ errores });
        }

        const nuevoId = aumentar_id(estado.productos);
        estado.productos = crear_producto(estado.productos, req.body, nuevoId);
        const creado = buscar_id(estado.productos, nuevoId);

        return res.status(201).json(creado);
    });

    router.patch('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del producto debe ser un entero positivo'] });
        }

        const actual = buscar_id(estado.productos, id);
        if (!actual) {
        return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const candidato = actualizar_producto_parcial(actual, req.body);
        const errores = validacion_almacen(candidato);
        if (errores.length > 0) {
        return res.status(400).json({ errores });
        }

        estado.productos = guardar_producto_actualizado(estado.productos, id, candidato);
        return res.status(200).json(candidato);
    });

    router.delete('/:id', (req, res) => {
        const id = validar_entero(req.params.id);
        if (!id) {
        return res.status(400).json({ errores: ['El id del producto debe ser un entero positivo'] });
        }

        if (!buscar_id(estado.productos, id)) {
        return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const enPedidoPendiente = estado.pedidos.some(
        (pedido) =>
            pedido.recibido === false &&
            pedido.lineas.some((linea) => linea.productoId === id)
        );

        if (enPedidoPendiente) {
        return res.status(409).json({
            error: 'No se puede eliminar un producto que aparece en un pedido pendiente'
        });
        }

        estado.productos = eliminar_producto(estado.productos, id);
        return res.status(204).send();
    });

    return router;
};