const suministro1 = {
    id: 1,
    nombre: 'Cocacola',
    categoria: 'bebida',
    unidad: 'botella',
    disponibles: 35,
    minimo: 50,
    compra: {
        tipo: 'caja',
        unidades: 20,
        costo: 30
    },
    proveedor: {
        nombre: 'Cocacola',
        telefono: 132349583
    },
    consumo: {
        monologo: 1,
        concierto: 2,
        fiesta: 3,
        karaoke: 2,
        quiz: 1.5,
        privado: 2
    }
};  

const suministro2 = {
    id: 2,
    nombre: 'Patatas fritas',
    categoria: 'comida',
    unidad: 'bolsa',
    disponibles: 100,
    minimo: 30,
    compra: {
        tipo: 'caja',
        unidades: 25,
        costo: 22
    },
    proveedor: {
        nombre: 'Snacks del Norte',
        telefono: 612345678
    },
    consumo: {
        monologo: 0.5,
        concierto: 1,
        fiesta: 2,
        karaoke: 1.5,
        quiz: 1,
        privado: 1.5
    }
};

const suministro3 = {
    id: 3,
    nombre: 'Vasos desechables',
    categoria: 'otros',
    unidad: 'vaso',
    disponibles: 150,
    minimo: 100,
    compra: {
        tipo: 'paquete',
        unidades: 100,
        costo: 8
    },
    proveedor: {
        nombre: 'Distribuciones Hosteleras',
        telefono: 623456789
    },
    consumo: {
        monologo: 1,
        concierto: 3,
        fiesta: 4,
        karaoke: 3,
        quiz: 2,
        privado: 3
    }
};

const suministro4 = {
    id: 4,
    nombre: 'Agua mineral',
    categoria: 'bebida',
    unidad: 'botella',
    disponibles: 80,
    minimo: 40,
    compra: {
        tipo: 'caja',
        unidades: 12,
        costo: 6
    },
    proveedor: {
        nombre: 'Aguas del Cantábrico',
        telefono: 634567890
    },
    consumo: {
        monologo: 1,
        concierto: 2,
        fiesta: 2,
        karaoke: 2,
        quiz: 1,
        privado: 2
    }
};

const suministro5 = {
    id: 5,
    nombre: 'Servilletas',
    categoria: 'otros',
    unidad: 'servilleta',
    disponibles: 200,
    minimo: 100,
    compra: {
        tipo: 'paquete',
        unidades: 250,
        costo: 5
    },
    proveedor: {
        nombre: 'Suministros Hosteleros',
        telefono: 645678901
    },
    consumo: {
        monologo: 1,
        concierto: 2,
        fiesta: 3,
        karaoke: 2,
        quiz: 1,
        privado: 2
    }
};

export const suministros = [suministro1, suministro2, suministro3, suministro4, suministro5];