//Crea una copia profunda de un producto para evitar mutaciones accidentales
const clonar_producto = (producto) => {
    return {
        ...producto,
        compra: { ...producto.compra },
        proveedor: { ...producto.proveedor },
        consumo: { ...producto.consumo }
    };
};

//Crea un nuevo producto con el id asignado sin mutar la lista original
export const crear_producto = (listaProductos, nuevoProducto, siguienteId) => {
    const productoLimpio = {
        ...nuevoProducto,
        id: siguienteId,
        compra: { ...nuevoProducto.compra },
        proveedor: { ...nuevoProducto.proveedor },
        consumo: { ...nuevoProducto.consumo }
    };

    return [...listaProductos, productoLimpio];
};

//Junta cambios parciales sobre un producto existente ignorando el id
export const actualizar_producto_parcial = (productoActual, cambios) => {
    const { id, compra, proveedor, consumo, ...restoCambios } = cambios || {};

    return {
        ...clonar_producto(productoActual),
        ...restoCambios,
        compra: compra ? { ...productoActual.compra, ...compra } : { ...productoActual.compra },
        proveedor: proveedor
        ? { ...productoActual.proveedor, ...proveedor }
        : { ...productoActual.proveedor },
        consumo: consumo ? { ...productoActual.consumo, ...consumo } : { ...productoActual.consumo }
    };
};

//Cambia un producto actualizado dentro de la lista sin mutar la original
export const guardar_producto_actualizado = (listaProductos, id, productoActualizado) => {
    return listaProductos.map((producto) =>
        producto.id === id ? clonar_producto(productoActualizado) : clonar_producto(producto)
    );
};

//Borra un producto por id devolviendo un nuevo array sin mutar el original
export const eliminar_producto = (listaProductos, id) => {
    return listaProductos.filter((producto) => producto.id !== id).map(clonar_producto);
};

//Calcula lo que necesita, tiene y le falta de cada producto consumido en un evento
export const calcular_necesidades_evento = (evento, listaProductos) => {
    const consumoPorTipo = evento.tipo;
    const gente = evento.cancelado?.estado === true ? 0 : evento.gente;

    const productosDetalle = listaProductos
        .filter((producto) => (producto.consumo?.[consumoPorTipo] || 0) > 0)
        .map((producto) => {
        const porPersona = producto.consumo[consumoPorTipo];
        const necesario = gente === 0 ? 0 : Math.ceil(gente * porPersona);
        const disponible = producto.disponibles;
        const falta = Math.max(0, necesario - disponible);

        return {
            productoId: producto.id,
            nombre: producto.nombre,
            unidad: producto.unidad,
            necesario,
            disponible,
            falta,
            suficiente: disponible >= necesario
        };
        });

    const haySuficienteDeTodo = productosDetalle.every((item) => item.suficiente === true);

    return {
        eventoId: evento.id,
        tituloEvento: evento.titulo,
        haySuficienteDeTodo,
        productos: productosDetalle
    };
};

//Suma las necesidades de varios eventos producto a producto
const sumar_necesidades_eventos = (eventosPendientes, listaProductos) => {
    const consumosPorProducto = eventosPendientes.flatMap((evento) => {
        const gente = evento.gente;
        const tipo = evento.tipo;

        return listaProductos
        .filter((producto) => (producto.consumo?.[tipo] || 0) > 0)
        .map((producto) => ({
            productoId: producto.id,
            cantidad: Math.ceil(gente * producto.consumo[tipo])
        }));
    });

    return consumosPorProducto.reduce((acumulado, item) => {
        const actual = acumulado[item.productoId] || 0;

        return {
        ...acumulado,
        [item.productoId]: actual + item.cantidad
        };
    }, {});
};

//Calcula la previsión de pedidos en cajas completas para eventos no cancelados ni celebrados
export const calcular_prevision_almacen = (listaEventos, listaProductos) => {
    const eventosPendientes = listaEventos.filter(
        (evento) => evento.cancelado?.estado === false && evento.celebrado === false
    );

    const totalNecesarioPorId = sumar_necesidades_eventos(eventosPendientes, listaProductos);

    const itemsAPedir = listaProductos.reduce((acc, producto) => {
        const necesario = totalNecesarioPorId[producto.id] || 0;
        const disponible = producto.disponibles;
        const saldoTrasEventos = disponible - necesario;

        if (saldoTrasEventos >= producto.minimo) {
        return acc;
        }

        const unidadesFaltantesParaMinimo = producto.minimo - saldoTrasEventos;
        const cajasAPedir = Math.ceil(unidadesFaltantesParaMinimo / producto.compra.unidades);
        const subtotal = cajasAPedir * producto.compra.costo;

        return [
        ...acc,
        {
            productoId: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            necesario,
            disponible,
            minimo: producto.minimo,
            cajasAPedir,
            costoCaja: producto.compra.costo,
            subtotal
        }
        ];
    }, []);

    const importeTotal = itemsAPedir.reduce((suma, item) => suma + item.subtotal, 0);

    return {
        eventosConsiderados: eventosPendientes.length,
        productos: itemsAPedir,
        importeTotal
    };
};

//Calcula el valor económico de la mercancía en total y desglosado por categoría
export const calcular_valor_almacen = (listaProductos) => {
    const porCategoria = listaProductos.reduce((acc, producto) => {
        const precioUnidad = producto.compra.costo / producto.compra.unidades;
        const valorProducto = producto.disponibles * precioUnidad;
        const categoria = producto.categoria;
        const valorActual = acc[categoria] || 0;

        return {
        ...acc,
        [categoria]: Number((valorActual + valorProducto).toFixed(2))
        };
    }, {});

    const total = Number(
        Object.values(porCategoria)
        .reduce((suma, valor) => suma + valor, 0)
        .toFixed(2)
    );

    return {
        total,
        porCategoria
    };
};

//Descuenta del almacén el consumo previsto para un evento devolviendo una nueva lista
export const descontar_stock_evento = (listaProductos, evento) => {
    const consumoPorTipo = evento.tipo;
    const gente = evento.gente;

    return listaProductos.map((producto) => {
        const porPersona = producto.consumo?.[consumoPorTipo] || 0;
        const consumido = porPersona > 0 ? Math.ceil(gente * porPersona) : 0;
        const nuevoDisponible = Math.max(0, producto.disponibles - consumido);

        return {
        ...clonar_producto(producto),
        disponibles: nuevoDisponible
        };
    });
};