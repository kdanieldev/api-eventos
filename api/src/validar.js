import {tipos, aforo} from './config.js'
import {eventos} from './datos/eventos.js'
import {suministros} from './datos/almacen.js'

export const validacion_evento = (evento) => {
    const listaErrores = [];
    const patronFecha = /^\d{4}-\d{2}-\d{2}$/;
    const patronHora = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!evento || typeof evento !== 'object') {
        listaErrores.push("Error, el evento no es válido");
        return listaErrores;
    }

    if (evento.titulo === '' || evento.titulo === null || evento.titulo === undefined) {
        listaErrores.push("Error, el titulo del evento está vacio");
    }

    if (evento.descripcion === '' || evento.descripcion === null || evento.descripcion === undefined) {
        listaErrores.push("Error, la descripcion del evento está vacio");
    }

    if (!tipos.includes(evento.tipo)) {
        listaErrores.push("Error, el tipo no está permitido");
    }

    if (typeof evento.celebrado !== 'boolean') {
        listaErrores.push("Error, el estado de celebrado debe ser booleano");
    }

    if (!Array.isArray(evento.etiquetas)) {
        listaErrores.push("Error, las etiquetas deben ser un array");
    }

    if (!evento.entrada || typeof evento.entrada !== 'object') {
        listaErrores.push("Error, los datos de entrada no son válidos");
    } else {
        if (evento.entrada.pago === true && evento.entrada.precio <= 0) {
            listaErrores.push("Error, si la entrada es de paga, tiene que costar mas de 0 euros");
        }

        if (evento.entrada.pago === false && evento.entrada.precio > 0) {
            listaErrores.push("Error, si la entrada es gratuita, no puede costar mas de 0 euros");
        }
    }

    if (evento.gente > aforo || evento.gente <= 0) {
        listaErrores.push(`Error, el aforo de la sala debe ser del 1 al ${aforo}`);
    }

    if (!evento.cancelado || typeof evento.cancelado !== 'object') {
        listaErrores.push("Error, los datos de cancelación no son válidos");
    } else {
        if (evento.cancelado.estado === true && !evento.cancelado.razon) {
            listaErrores.push("Error, si el evento está cancelado, se necesita un motivo");
        }

        if (evento.cancelado.estado === false && evento.cancelado.razon !== '') {
            listaErrores.push("Error, si el evento no está cancelado, no puede haber un motivo");
        }
    }

    if (!evento.cobro || typeof evento.cobro !== 'object') {
        listaErrores.push("Error, los datos de cobro no son válidos");
    } else {
        if (evento.cobro.se_cobra === false) {
            if (evento.cobro.monto_cobro > 0 || evento.cobro.cobrado === true) {
                listaErrores.push("Error, si el alquiler no se cobra, no se puede dar un monto ni marcarse como cobrado");
            }
        } else if (evento.cobro.se_cobra === true) {
            if (evento.cobro.monto_cobro <= 0) {
                listaErrores.push("Error, si el alquiler se cobra, se debe dar un monto superior a 0");
            }
        }
    }

    if (!evento.fecha || typeof evento.fecha !== 'object') {
        listaErrores.push("Error, los datos de fecha no son válidos");
    } else {
        if (typeof evento.fecha.dia !== 'string' || patronFecha.test(evento.fecha.dia) === false) {
            listaErrores.push("Error, formato de fecha inválido");
        }

        if (typeof evento.fecha.hora !== 'string' || patronHora.test(evento.fecha.hora) === false) {
            listaErrores.push("Error, formato de hora inválido");
        }
    }

    if (evento.artistas !== undefined && evento.artistas !== null && !Array.isArray(evento.artistas)) {
        listaErrores.push("Error, artistas debe ser un array");
    } else if (Array.isArray(evento.artistas) && evento.artistas.length > 0) {
        const erroresArtistas = evento.artistas.flatMap((artista, index) => {
            const errores = validacion_eventoArtista(artista);

            return errores.map(error => `Artista: [${index}]: ${error}`);
        });

        listaErrores.push(...erroresArtistas);
    }

    return listaErrores;
};

const validacion_eventoArtista = (artista) => {
    const listaErroresArtista = [];

    if (!artista || typeof artista !== 'object') {
        listaErroresArtista.push("Error, el artista no es válido");
        return listaErroresArtista;
    }

    if (artista.nombre === '' || artista.nombre === null || artista.nombre === undefined) {
        listaErroresArtista.push("Error, el nombre del artista no puede estar vacío");
    }

    if (artista.pago <= 0) {
        listaErroresArtista.push("Error, se debe dar un pago al artista");
    }

    if (artista.duracion <= 0) {
        listaErroresArtista.push("Error, el artista necesita minutos de presentacion");
    }

    return listaErroresArtista;
};


export const validacion_almacen = (producto) => {
    const listaErrores = [];
    const categoriasPermitidas = ['bebida', 'comida', 'otros'];

    if (producto.nombre === '' || producto.nombre === null || producto.nombre === undefined) {
        listaErrores.push('Error, el nombre del producto está vacío');
    }

    if (producto.categoria === '' || producto.categoria === null || producto.categoria === undefined) {
        listaErrores.push('Error, la categoría del producto está vacía');
    } else if (!categoriasPermitidas.includes(producto.categoria)) {
        listaErrores.push('Error, la categoría del producto no está permitida');
    }

    if (producto.unidad === '' || producto.unidad === null || producto.unidad === undefined) {
        listaErrores.push('Error, la unidad del producto está vacía');
    }

    if (typeof producto.disponibles !== 'number' || producto.disponibles < 0) {
        listaErrores.push('Error, las unidades disponibles no pueden ser negativas');
    }

    if (typeof producto.minimo !== 'number' || producto.minimo < 0) {
        listaErrores.push('Error, el mínimo del producto no puede ser negativo');
    }

    if (!producto.compra || typeof producto.compra.tipo !== 'string' || producto.compra.tipo.trim() === '') {
        listaErrores.push('Error, el tipo de compra del producto no es válido');
    }

    if (!producto.compra || typeof producto.compra.unidades !== 'number' || producto.compra.unidades <= 0) {
        listaErrores.push('Error, las unidades por caja o paquete deben ser mayor que 0');
    }

    if (!producto.compra || typeof producto.compra.costo !== 'number' || producto.compra.costo <= 0) {
        listaErrores.push('Error, el costo de compra debe ser mayor que 0');
    }

    if (!producto.proveedor || producto.proveedor.nombre === '' || producto.proveedor.nombre === null || producto.proveedor.nombre === undefined) {
        listaErrores.push('Error, el nombre del proveedor está vacío');
    }

    if (!producto.proveedor || typeof producto.proveedor.telefono !== 'number' || producto.proveedor.telefono <= 0) {
        listaErrores.push('Error, el teléfono del proveedor no es válido');
    }

    if (!producto.consumo || typeof producto.consumo !== 'object') {
        listaErrores.push('Error, el objeto de consumo del producto no es válido');
    } else {
        const erroresConsumo = tipos.flatMap((tipo) => {
        const valor = producto.consumo[tipo];
        if (typeof valor !== 'number' || Number.isNaN(valor) || valor < 0) {
            return [
            `Error, el consumo para el tipo "${tipo}" debe ser un número mayor o igual a 0`
            ];
        }
        return [];
        });

        listaErrores.push(...erroresConsumo);
    }

    return listaErrores;
};


export const validacion_lineaPedido = (linea, productos) => {
    const listaErroresLinea = [];

    if (!linea || typeof linea !== 'object') {
        listaErroresLinea.push('Error, la línea de pedido no es válida');
        return listaErroresLinea;
    }

    const productoEncontrado = productos.find(
        (producto) => producto.id === linea.productoId
    );

    if (!productoEncontrado) {
        listaErroresLinea.push('Error, el producto de la línea no existe');
    }

    if (!Number.isInteger(linea.cajas) || linea.cajas <= 0) {
        listaErroresLinea.push('Error, cajas debe ser un entero mayor que 0');
    }

    return listaErroresLinea;
};

export const validacion_pedido = (pedido, productos = suministros) => {
    const listaErrores = [];
    const patronFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (!pedido || typeof pedido !== 'object') {
        listaErrores.push('Error, el pedido no es válido');
        return listaErrores;
    }

    if (pedido.fecha === '' || pedido.fecha === null || pedido.fecha === undefined || typeof pedido.fecha !== 'string' || patronFecha.test(pedido.fecha) === false) {
        listaErrores.push('Error, la fecha del pedido no es válida');
    }

    if (!Array.isArray(pedido.lineas) || pedido.lineas.length === 0) {
        listaErrores.push('Error, el pedido debe tener al menos una línea');
    } else {
        const erroresLineas = pedido.lineas.flatMap((linea, index) => {
        const errores = validacion_lineaPedido(linea, productos);

        return errores.map((error) => `lineas[${index}]: ${error}`);
        });

        listaErrores.push(...erroresLineas);
    }

    return listaErrores;
};