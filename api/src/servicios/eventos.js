import {personas_por_camarero} from '../config.js';
import {minimo_camareros} from '../config.js';
import {coste_camarero} from '../config.js';

// Busca los camareros necesarios para un evento por su estado, y tipo y asistencia
export const calcular_camareros = (evento) => {
    if (!evento || evento.cancelado?.estado === true) {
        return 0;
    }

    const base = Math.ceil(evento.gente / personas_por_camarero);
    const conMinimo = Math.max(minimo_camareros, base);

    return evento.tipo === 'fiesta' ? conMinimo + 1 : conMinimo;
};

// Calcula el precio de camareros para un evento
export const calcular_coste_personal = (evento) => {
    const camareros = calcular_camareros(evento);

    return camareros * coste_camarero;
};

// Calcula la suma de todos los artistas de un evento
export const calcular_coste_artistas = (evento) => {
    if (!evento || evento.cancelado?.estado === true || !Array.isArray(evento.artistas)) {
        return 0;
    }

    return evento.artistas.reduce((total, artista) => {
        const pago = typeof artista?.pago === 'number' ? artista.pago : 0;

        return total + pago;
    }, 0);
};

// Calcula el balance de un evento
export const calcular_balance_evento = (evento) => {
    if (!evento || evento.cancelado?.estado === true) {
        return 0;
    }

    const precioEntrada = evento.entrada?.pago === true ? evento.entrada.precio : 0;
    const ingresosEntradas = precioEntrada * evento.gente;
    const ingresoAlquiler = evento.cobro?.se_cobra === true ? evento.cobro.monto_cobro : 0;
    const ingresos = ingresosEntradas + ingresoAlquiler;

    const gastos = calcular_coste_personal(evento) + calcular_coste_artistas(evento);

    return ingresos - gastos;
};


//Hace una copia de un evento y le añade los datos calculados
export const enriquecer_evento = (evento) => {
    return {
        ...evento,
        etiquetas: [...evento.etiquetas],
        fecha: { ...evento.fecha },
        entrada: { ...evento.entrada },
        organizador: { ...evento.organizador },
        cobro: { ...evento.cobro },
        cancelado: { ...evento.cancelado },
        artistas: evento.artistas.map((artista) => ({ ...artista })),
        camareros: calcular_camareros(evento),
        costePersonal: calcular_coste_personal(evento),
        costeArtistas: calcular_coste_artistas(evento),
        balance: calcular_balance_evento(evento)
    };
};

//Mete los datos calculados de cada evento de una lista sin afectar la primera
export const enriquecer_eventos = (listaEventos) => {
    return listaEventos.map((evento) => enriquecer_evento(evento));
};

//Mira si el evento cumple los filtros de texto, etiquetas, fechas, organizador y artista
const cumple_filtros_texto = (evento, filtros) => {
    const { texto, etiqueta, desde, hasta, organizador, artista } = filtros;
    const textoBuscado = texto ? texto.toLowerCase() : '';

    if (texto && !evento.titulo.toLowerCase().includes(textoBuscado) &&
        !evento.descripcion.toLowerCase().includes(textoBuscado)) {
        return false;
    }

    if (etiqueta && !evento.etiquetas.includes(etiqueta)) {
        return false;
    }

    if (desde && evento.fecha.dia < desde) {
        return false;
    }

    if (hasta && evento.fecha.dia > hasta) {
        return false;
    }

    if (organizador && !evento.organizador.nombre.toLowerCase().includes(organizador.toLowerCase())) {
        return false;
    }

    if (artista && !evento.artistas.some((a) => a.nombre.toLowerCase().includes(artista.toLowerCase()))) {
        return false;
    }

    return true;
};

//Mira si un evento cumple los filtros de tipo, precio, estado y camareros
const cumple_filtros_estado = (evento, filtros) => {
    const { tipo, precioMin, precioMax, gratis, cancelado, alquilerPendiente, minCamareros } = filtros;

    if (tipo && evento.tipo !== tipo) {
        return false;
    }

    if (precioMin !== undefined && evento.entrada.precio < Number(precioMin)) {
        return false;
    }

    if (precioMax !== undefined && evento.entrada.precio > Number(precioMax)) {
        return false;
    }

    if (gratis !== undefined && evento.entrada.pago !== (String(gratis) === 'false')) {
        return false;
    }

    if (cancelado !== undefined && evento.cancelado.estado !== (String(cancelado) === 'true')) {
        return false;
    }

    if (String(alquilerPendiente) === 'true' && (!evento.cobro.se_cobra || evento.cobro.cobrado)) {
        return false;
    }

    if (minCamareros !== undefined && evento.camareros < Number(minCamareros)) {
        return false;
    }

    return true;
};

//Hace una lista de eventos enriquecidos combinando todos los parámetros
export const filtrar_eventos = (listaEventos, filtros = {}) => {
    return listaEventos.filter(
        (evento) => cumple_filtros_estado(evento, filtros) && cumple_filtros_texto(evento, filtros)
    );
};

//Coge el valor comparable de un evento segun el campo de ordenación
const obtener_valor_orden = (evento, orden) => {
    if (orden === 'precio') {
        return evento.entrada.precio;
    }

    if (orden === 'fecha') {
        return evento.fecha.dia;
    }

    return evento[orden];
};

//Ordena una copia de la lista de eventos por el campo y dirección
export const ordenar_eventos = (listaEventos, orden, dir = 'asc') => {
    if (!orden) {
        return [...listaEventos];
    }

    const factor = dir === 'desc' ? -1 : 1;

    return [...listaEventos].sort((a, b) => {
        const valorA = obtener_valor_orden(a, orden);
        const valorB = obtener_valor_orden(b, orden);

        if (valorA === valorB && orden === 'fecha') {
        return a.fecha.hora.localeCompare(b.fecha.hora) * factor;
        }

        if (typeof valorA === 'string' && typeof valorB === 'string') {
        return valorA.localeCompare(valorB) * factor;
        }

        return ((valorA ?? 0) - (valorB ?? 0)) * factor;
    });
};

//Da una página de resultados segun pagina y limite
export const paginar_eventos = (listaEventos, pagina = 1, limite = 10) => {
    const numPagina = Number(pagina) || 1;
    const numLimite = Number(limite) || 10;
    const inicio = (numPagina - 1) * numLimite;

    return listaEventos.slice(inicio, inicio + numLimite);
};

// Proyecta cada evento dejando siempre el id y solo los campos pedidos
export const proyectar_eventos = (listaEventos, campos) => {
    if (!campos) {
        return listaEventos;
    }

    const listaCampos = Array.isArray(campos)
        ? campos
        : String(campos).split(',').map((campo) => campo.trim()).filter(Boolean);

    return listaEventos.map((evento) => {
        const proyeccion = listaCampos.reduce((acc, campo) => {
        if (campo in evento) {
            return { ...acc, [campo]: evento[campo] };
        }
        return acc;
        }, { id: evento.id });

        return proyeccion;
    });
};