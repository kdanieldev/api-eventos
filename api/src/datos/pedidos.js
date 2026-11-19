const pedido1 = {
    id: 1,
    fecha: '2026-10-10',
    recibido: true,
    lineas: [
        { 
            productoId: 1, cajas: 2 },
        { 
            productoId: 2, cajas: 1 }
    ],
    importeTotal: 82
};

const pedido2 = {
    id: 2,
    fecha: '2026-11-15',
    recibido: false,
    lineas: [
        { 
            productoId: 4, cajas: 3 },
        { 
            productoId: 5, cajas: 2 }
    ],
    importeTotal: 28
};

export const pedidos = [pedido1, pedido2];