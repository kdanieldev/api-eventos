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


//HAce un nuevo eventp con id creado y copia sin mutar el array original
export const crear_evento = (listaEventos, nuevoEvento, siguienteId) => {
    const eventoLimpio = {
        ...nuevoEvento,
        id: siguienteId,
        celebrado: Boolean(nuevoEvento.celebrado),
        etiquetas: Array.isArray(nuevoEvento.etiquetas) ? [...nuevoEvento.etiquetas] : [],
        fecha: { ...nuevoEvento.fecha },
        entrada: { ...nuevoEvento.entrada },
        organizador: { ...nuevoEvento.organizador },
        cobro: { ...nuevoEvento.cobro },
        cancelado: { ...nuevoEvento.cancelado },
        artistas: Array.isArray(nuevoEvento.artistas)
        ? nuevoEvento.artistas.map((artista) => ({ ...artista }))
        : []
    };
    return [...listaEventos, eventoLimpio];
};

//Cambia un evento que ya existe conservando su id original
export const reemplazar_evento = (listaEventos, id, datosReemplazo) => {
    const eventoReemplazado = {
        ...datosReemplazo,
        id,
        celebrado: Boolean(datosReemplazo.celebrado),
        etiquetas: Array.isArray(datosReemplazo.etiquetas) ? [...datosReemplazo.etiquetas] : [],
        fecha: { ...datosReemplazo.fecha },
        entrada: { ...datosReemplazo.entrada },
        organizador: { ...datosReemplazo.organizador },
        cobro: { ...datosReemplazo.cobro },
        cancelado: { ...datosReemplazo.cancelado },
        artistas: Array.isArray(datosReemplazo.artistas)
        ? datosReemplazo.artistas.map((artista) => ({ ...artista }))
        : []
    };
    return listaEventos.map((evento) => (evento.id === id ? eventoReemplazado : evento));
};

//Junta los campos recibidos sobre un evento existente sin mutar el original
export const actualizar_evento_parcial = (eventoActual, cambios) => {
    const {
        id,
        camareros,
        costePersonal,
        costeArtistas,
        balance,
        fecha,
        entrada,
        organizador,
        cobro,
        cancelado,
        etiquetas,
        artistas,
        ...restoCambios
    } = cambios || {};

    return {
        ...eventoActual,
        ...restoCambios,
        fecha: fecha ? { ...eventoActual.fecha, ...fecha } : { ...eventoActual.fecha },
        entrada: entrada ? { ...eventoActual.entrada, ...entrada } : { ...eventoActual.entrada },
        organizador: organizador
        ? { ...eventoActual.organizador, ...organizador }
        : { ...eventoActual.organizador },
        cobro: cobro ? { ...eventoActual.cobro, ...cobro } : { ...eventoActual.cobro },
        cancelado: cancelado
        ? { ...eventoActual.cancelado, ...cancelado }
        : { ...eventoActual.cancelado },
        etiquetas: Array.isArray(etiquetas) ? [...etiquetas] : [...eventoActual.etiquetas],
        artistas: Array.isArray(artistas)
        ? artistas.map((artista) => ({ ...artista }))
        : eventoActual.artistas.map((artista) => ({ ...artista }))
    };
};

// Sustituye un evento actualizado dentro de la lista sin mutar el array original
export const guardar_evento_actualizado = (listaEventos, id, eventoActualizado) => {
    return listaEventos.map((evento) => (evento.id === id ? eventoActualizado : evento));
};

//Quita un evento por id devolviendo un nuevo array sin mutar el original
export const eliminar_evento = (listaEventos, id) => {
    return listaEventos.filter((evento) => evento.id !== id);
};

//Cancela un evento diciendo el motivo sin mutar el evento original
export const cancelar_evento = (evento, motivo) => {
    return {
        ...evento,
        etiquetas: [...evento.etiquetas],
        fecha: { ...evento.fecha },
        entrada: { ...evento.entrada },
        organizador: { ...evento.organizador },
        cobro: { ...evento.cobro },
        cancelado: {
        estado: true,
        razon: motivo
        },
        artistas: evento.artistas.map((artista) => ({ ...artista }))
    };
};

//Da el alquiler de un evento como pagado sin mutar el evento original
export const pagar_alquiler_evento = (evento) => {
    return {
        ...evento,
        etiquetas: [...evento.etiquetas],
        fecha: { ...evento.fecha },
        entrada: { ...evento.entrada },
        organizador: { ...evento.organizador },
        cobro: {
        ...evento.cobro,
        cobrado: true
        },
        cancelado: { ...evento.cancelado },
        artistas: evento.artistas.map((artista) => ({ ...artista }))
    };
};

//Hace el resumen de eventos evitando NaN cuando la lista esta vacia
export const generar_resumen_eventos = (listaEventos) => {
    const enriquecidos = enriquecer_eventos(listaEventos);
    const total = enriquecidos.length;

    if (total === 0) {
        return {
        total: 0,
        cancelados: 0,
        celebrados: 0,
        mediaGentePrevista: 0,
        balancePrevistoNoCancelados: 0
        };
    }

    const cancelados = enriquecidos.filter((e) => e.cancelado.estado === true).length;
    const celebrados = enriquecidos.filter((e) => e.celebrado === true).length;
    const sumaGente = enriquecidos.reduce((acc, e) => acc + e.gente, 0);
    const balanceNoCancelados = enriquecidos
        .filter((e) => e.cancelado.estado === false)
        .reduce((acc, e) => acc + e.balance, 0);

    return {
        total,
        cancelados,
        celebrados,
        mediaGentePrevista: sumaGente / total,
        balancePrevistoNoCancelados: balanceNoCancelados
    };
};

//Calcula el alquiler pendiente agrupado por organizador devolviendo a los que deben dinero
export const obtener_deudas_organizador = (listaEventos) => {
    const pendientes = listaEventos.filter(
        (e) => e.cancelado.estado === false && e.cobro.se_cobra === true && e.cobro.cobrado === false
    );

    const acumulado = pendientes.reduce((acc, e) => {
        const nombre = e.organizador.nombre;
        const deudaActual = acc[nombre] || 0;

        return {
        ...acc,
        [nombre]: deudaActual + e.cobro.monto_cobro
        };
    }, {});

    return Object.entries(acumulado)
        .filter(([, deuda]) => deuda > 0)
        .map(([organizador, deudaPendiente]) => ({organizador,deudaPendiente}));
};

//Devuelve las actuaciones con datos del evento ordenadas de mayor a menor
export const listar_actuaciones = (listaEventos) => {
    const actuaciones = listaEventos.flatMap((evento) =>
        evento.artistas.map((artista) => ({
        artista: artista.nombre,
        cache: artista.pago,
        duracionMin: artista.duracion,
        eventoId: evento.id,
        tituloEvento: evento.titulo,
        fechaEvento: evento.fecha.dia
        }))
    );

    return [...actuaciones].sort((a, b) => b.cache - a.cache);
};

//devuelve los eventos no cancelados de un mes ordenados por fecha y hora
export const obtener_calendario_mes = (listaEventos, mes) => {
    const delMes = listaEventos.filter(
        (evento) => evento.cancelado.estado === false && evento.fecha.dia.startsWith(mes)
    );

    const ordenados = [...delMes].sort((a, b) => {
        const diffDia = a.fecha.dia.localeCompare(b.fecha.dia);
        if (diffDia !== 0) {
        return diffDia;
        }
        return a.fecha.hora.localeCompare(b.fecha.hora);
    });

    return ordenados.map((evento) => ({
        fecha: evento.fecha.dia,
        hora: evento.fecha.hora,
        titulo: evento.titulo,
        tipo: evento.tipo
    }));
};

//Responde a las tres preguntas rapidas de la sala con valores booleanos
export const responder_preguntas_sala = (listaEventos, listaProductos) => {
    const hayAlquilerSinCobrar = listaEventos.some(
        (e) => e.cancelado.estado === false && e.cobro.se_cobra === true && e.cobro.cobrado === false
    );

    const todoAlmacenSobreMinimo = listaProductos.every(
        (producto) => producto.disponibles > producto.minimo
    );

    const eventosConArtistas = listaEventos.filter((e) => e.artistas.length > 0);
    const todosConMasDeUnaActuacion = eventosConArtistas.every((e) => e.artistas.length > 1);

    return {
        hayAlquilerSinCobrar,
        todoAlmacenSobreMinimo,
        todosConMasDeUnaActuacion
    };
};