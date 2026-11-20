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