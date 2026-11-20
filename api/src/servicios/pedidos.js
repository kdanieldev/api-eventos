import { buscar_id } from './comun.js';
import { calcular_prevision_almacen } from './almacen.js';

//Obtiene la fecha actual en formato
const obtener_fecha_hoy = () => {
  return new Date().toISOString().slice(0, 10);
};

//Clona una línea de pedido para evitar mutaciones
const clonar_linea = (linea) => {
  return { ...linea };
};

//Clona un pedido completo incluyendo su array de líneas
export const clonar_pedido = (pedido) => {
  return {
    ...pedido,
    lineas: Array.isArray(pedido.lineas) ? pedido.lineas.map(clonar_linea) : []
  };
};

//Lista pedidos del más reciente al más antiguo, filtrando pendientes si se solicita
export const listar_pedidos = (listaPedidos, pendiente) => {
  const filtrados = String(pendiente) === 'true' ? listaPedidos.filter((pedido) => pedido.recibido === false) : listaPedidos;

  return [...filtrados].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id).map(clonar_pedido);
};

//Devuelve un pedido enriqueciendo cada línea con los datos del producto correspondiente
export const enriquecer_pedido = (pedido, listaProductos) => {
  const lineasDetalladas = pedido.lineas.map((linea) => {
    const producto = buscar_id(listaProductos, linea.productoId);
    const costeCaja = producto?.compra?.costo || 0;

    return {
      ...clonar_linea(linea),
      nombreProducto: producto ? producto.nombre : 'Producto no encontrado',
      unidad: producto ? producto.unidad : '',
      unidadesPorCaja: producto?.compra?.unidades || 0,
      costoCaja,
      subtotal: linea.cajas * costeCaja
    };
  });

  return {
    ...clonar_pedido(pedido),
    lineas: lineasDetalladas
  };
};

//Calcula el importe total de un array de líneas según el coste de caja en almacén
export const calcular_importe_pedido = (lineas, listaProductos) => {
  return lineas.reduce((total, linea) => {
    const producto = buscar_id(listaProductos, linea.productoId);
    const costoCaja = producto?.compra?.costo || 0;

    return total + linea.cajas * costoCaja;
  }, 0);
};

//Crea un pedido manual en estado pendiente con fecha de hoy e importe calculado
export const crear_pedido_manual = (listaPedidos, datosPedido, listaProductos, siguienteId) => {
  const lineasLimpias = datosPedido.lineas.map((linea) => ({
    productoId: Number(linea.productoId),
    cajas: Number(linea.cajas)
  }));

  const nuevoPedido = {
    id: siguienteId,
    fecha: obtener_fecha_hoy(),
    recibido: false,
    lineas: lineasLimpias,
    importeTotal: calcular_importe_pedido(lineasLimpias, listaProductos)
  };

  return {
    pedido: nuevoPedido,
    pedidos: [...listaPedidos.map(clonar_pedido), clonar_pedido(nuevoPedido)]
  };
};

//Genera un pedido automático a partir de la previsión de almacén
export const generar_pedido_automatico = (
  listaPedidos,
  listaEventos,
  listaProductos,
  siguienteId
) => {
  const prevision = calcular_prevision_almacen(listaEventos, listaProductos);

  if (!prevision.productos || prevision.productos.length === 0) {
    return null;
  }

  const lineas = prevision.productos.map((item) => ({
    productoId: item.productoId,
    cajas: item.cajasAPedir
  }));

  return crear_pedido_manual(listaPedidos, { lineas }, listaProductos, siguienteId);
};

//Marca un pedido como recibido y devuelve las nuevas listas de pedidos y productos
export const recibir_pedido = (listaPedidos, listaProductos, pedidoId) => {
  const pedidoActual = buscar_id(listaPedidos, pedidoId);

  if (!pedidoActual) {
    return { error: 'not_found' };
  }

  if (pedidoActual.recibido === true) {
    return { error: 'already_received' };
  }

  const pedidoRecibido = {
    ...clonar_pedido(pedidoActual),
    recibido: true
  };

  const nuevosPedidos = listaPedidos.map((pedido) =>
    pedido.id === pedidoId ? pedidoRecibido : clonar_pedido(pedido)
  );

  const nuevosProductos = listaProductos.map((producto) => {
    const lineaCoincidente = pedidoActual.lineas.find(
      (linea) => linea.productoId === producto.id
    );

    if (!lineaCoincidente) {
      return {
        ...producto,
        compra: { ...producto.compra },
        proveedor: { ...producto.proveedor },
        consumo: { ...producto.consumo }
      };
    }

    const unidadesSumadas = lineaCoincidente.cajas * producto.compra.unidades;

    return {
      ...producto,
      disponibles: producto.disponibles + unidadesSumadas,
      compra: { ...producto.compra },
      proveedor: { ...producto.proveedor },
      consumo: { ...producto.consumo }
    };
  });

  return {
    pedido: pedidoRecibido,
    pedidos: nuevosPedidos,
    productos: nuevosProductos
  };
};