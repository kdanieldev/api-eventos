import {tipos, aforo} from './config.js'
import {eventos} from './datos/eventos.js'
import {suministros} from './datos/almacen.js'

export const validacion_evento = (evento) => {
    const listaErrores = [];
    const patronFecha = /^\d{4}-\d{2}-\d{2}$/;
    const patronHora = /^([01]\d|2[0-3]):[0-5]\d$/;;

    if (evento.titulo === '' || evento.titulo === null || evento.titulo === undefined) {
        listaErrores.push("Error, el titulo del evento está vacio");
    }

    if (evento.descripcion === '' || evento.descripcion === null || evento.descripcion === undefined) {
        listaErrores.push("Error, la descripcion del evento está vacio");
    }

    if (!tipos.includes(evento.tipo)) {
        listaErrores.push("Error, el tipo no está permitido");
    }

    if (evento.entrada.pago === true && evento.entrada.precio <= 0) {
        listaErrores.push("Error, si la entrada es de paga, tiene que costar mas de 0 euros")
    }

    if (evento.entrada.pago === false && evento.entrada.precio > 0) {
        listaErrores.push("Error, si la entrada es gratuita, no puede costar mas de 0 euros")
    }

    if (evento.gente > aforo || evento.gente <= 0) {
        listaErrores.push(`Error, el aforo de la sala debe ser del 1 al ${aforo}`);
    }

    if (evento.cancelado.estado === true && !evento.cancelado.razon) {
        listaErrores.push("Error, si el evento está cancelado, se necesita un motivo");
    }

    if (evento.cancelado.estado === false && evento.cancelado.razon !== '') {
        listaErrores.push("Error, si el evento no está cancelado, no puede haber un motivo");
    }

    if (evento.cobro.se_cobra === false) {
        if (evento.cobro.monto_cobro > 0 || evento.cobro.cobrado === true) {
            listaErrores.push("Error, si el alquiler no se cobra, no se puede dar un monto ni marcarse como cobrado");
        }
    } else if (evento.cobro.se_cobra === true) {
        if (evento.cobro.monto_cobro === 0) {
            listaErrores.push("Error, si el alquiler se cobra, se debe dar un monto superior a 0");
        }
    }

    if (typeof evento.fecha.dia !== 'string' || patronFecha.test(evento.fecha.dia) === false) {
        listaErrores.push("Error, formato de fecha inválido");
    }

    if (typeof evento.fecha.hora !== 'string' || patronHora.test(evento.fecha.hora) === false) {
        listaErrores.push("Error, formato de hora inválido");
    }

    if (Array.isArray(evento.artistas) && evento.artistas.length > 0) {
        const erroresArtistas = evento.artistas.flatMap((artista, index) => {
            const errores = validacion_eventoArtista(artista);
            
            return errores.map(error => `Artista: [${index}]: ${error}`);
        })

        listaErrores.push(...erroresArtistas);
    }

    return listaErrores;
};

const validacion_eventoArtista = (artista) => {
    const listaErroresArtista = [];
    if (artista.nombre === '' || artista.nombre === null || artista.nombre === undefined) {
        listaErroresArtista.push("Error, el nombre del artista no puede estar vacío");
    };

    if (artista.pago <= 0) {
        listaErroresArtista.push("Error, se debe dar un pago al artista");
    };

    if (artista.duracion <= 0) {
        listaErroresArtista.push("Error, el artista necesita minutos de presentacion");
    };

    return listaErroresArtista;
};

export const validacion_almacen = (producto) => {
    const listaErrores = [];

    if (producto.nombre === '' || producto.nombre === null || producto.nombre === undefined) {
        listaErrores.push('Error, el nombre del producto está vacío');
    }

    if (producto.categoria === '' || producto.categoria === null || producto.categoria === undefined) {
        listaErrores.push('Error, la categoría del producto está vacía');
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

    return listaErrores;
}