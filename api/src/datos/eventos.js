const evento1 = {
    titulo: 'Risas de Viernes',
    descripcion: 'Monólogos de humor local',
    tipo: 'monologo',
    gente: 90,
    fecha: {
        dia: '2026-02-14',
        hora: '21:00'
    },
    entrada: {
        pago: true,
        precio: 8
    },
    organizador: {
        nombre: 'Asociación Humor',
        contacto: 'info@humor.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 100,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
            nombre: 'Alicia',
            pago: 250,
            duracion: 30
        }]
};

const evento2 = {
    titulo: 'Noche de Comedia',
    descripcion: 'Monólogos de nuevos talentos',
    tipo: 'Monologo',
    gente: 65,
    fecha: {
        dia: '2026-11-20',
        hora: '20:30'
    },
    entrada: {
        pago: false,
        precio: 0
    },
    organizador: {
        nombre: 'Asociación Humor',
        contacto: 'info@humor.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 120,
        cobrado: false
    },
    cancelado: {
        estado: true,
        razon: 'Baja médica del humorista'
    },
    artistas: [
        {
            nombre: 'Carlos Risas',
            pago: 180,
            duracion: 45
        },
        {
            nombre: 'Norte Sonoro',
            pago: 250,
            duracion: 45
        },
        {
            nombre: 'Luna Roja',
            pago: 250,
            duracion: 45
        }
    ]
};

const evento3 = {
    titulo: 'Rock en Directo',
    descripcion: 'Concierto de bandas emergentes',
    tipo: 'Concierto',
    gente: 150,
    fecha: {
        dia: '2026-03-15',
        hora: '22:00'
    },
    entrada: {
        pago: true,
        precio: 12
    },
    organizador: {
        nombre: 'Bilbao Music',
        contacto: 'info@bilbaomusic.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 200,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
            nombre: 'Los Eléctricos',
            pago: 300,
            duracion: 60
        },
        {
            nombre: 'The Waves',
            pago: 250,
            duracion: 45
        },
        {
            nombre: 'Norte Sonoro',
            pago: 250,
            duracion: 45
        }
    ]
};

const evento4 = {
    titulo: 'Teatro entre Amigos',
    descripcion: 'Representación de una comedia contemporánea',
    tipo: 'Teatro',
    gente: 80,
    fecha: {
        dia: '2026-04-10',
        hora: '19:00'
    },
    entrada: {
        pago: false,
        precio: 0
    },
    organizador: {
        nombre: 'Cultura Viva',
        contacto: 'contacto@culturaviva.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 150,
        cobrado: false
    },
    cancelado: {
        estado: true,
        razon: 'Problemas técnicos en el escenario'
    },
    artistas: null
};

const evento5 = {
    titulo: 'Taller de Improvisación',
    descripcion: 'Actividad participativa de teatro improvisado',
    tipo: 'Taller',
    gente: 25,
    fecha: {
        dia: '2026-05-18',
        hora: '17:00'
    },
    entrada: {
        pago: false,
        precio: 0
    },
    organizador: {
        nombre: 'Cultura Viva',
        contacto: 'contacto@culturaviva.org'
    },
    cobro: {
        se_cobra: false,
        monto_cobro: 0,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
            nombre: 'Laura Impro',
            pago: 100,
            duracion: 60
        },
        {
            nombre: 'Miguel Escena',
            pago: 100,
            duracion: 60
        },
        {
            nombre: 'Norte Sonoro',
            pago: 250,
            duracion: 45
        }
    ]
};

const evento6 = {
    titulo: 'Acústico de Primavera',
    descripcion: 'Concierto íntimo de música acústica',
    tipo: 'Concierto',
    gente: 45,
    fecha: {
        dia: '2026-06-12',
        hora: '20:00'
    },
    entrada: {
        pago: true,
        precio: 10
    },
    organizador: {
        nombre: 'Bilbao Music',
        contacto: 'info@bilbaomusic.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 90,
        cobrado: false
    },
    cancelado: {
        estado: true,
        razon: 'Enfermedad de uno de los músicos'
    },
    artistas: [
        {
            nombre: 'Ane Soul',
            pago: 200,
            duracion: 40
        },
        {
            nombre: 'Jon Guitar',
            pago: 150,
            duracion: 40
        },
        {
            nombre: 'Norte Sonoro',
            pago: 250,
            duracion: 45
        }
    ]
};

const evento7 = {
    titulo: 'Clásicos del Teatro',
    descripcion: 'Representación de una obra clásica',
    tipo: 'Teatro',
    gente: 110,
    fecha: {
        dia: '2026-07-22',
        hora: '19:30'
    },
    entrada: {
        pago: true,
        precio: 15
    },
    organizador: {
        nombre: 'Teatro Abierto',
        contacto: 'info@teatroabierto.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 250,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
            nombre: 'Marta Escena',
            pago: 220,
            duracion: 50
        },
        {
            nombre: 'Pablo Actor',
            pago: 220,
            duracion: 50
        },
        {
            nombre: 'Irene Drama',
            pago: 180,
            duracion: 50
        }
    ]
};

const evento8 = {
    titulo: 'Pintura Creativa',
    descripcion: 'Taller abierto de pintura para principiantes',
    tipo: 'Taller',
    gente: 30,
    fecha: {
        dia: '2026-09-05',
        hora: '11:00'
    },
    entrada: {
        pago: false,
        precio: 0
    },
    organizador: {
        nombre: 'Arte para Todos',
        contacto: 'hola@arteparatodos.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 80,
        cobrado: false
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
        nombre: 'Elena Pincel',
        pago: 120,
        duracion: 120
        },
        {
            nombre: 'Norte Sonoro',
            pago: 250,
            duracion: 45
        },
        {
            nombre: 'Luna Roja',
            pago: 250,
            duracion: 45
        }
    ]
};

const evento9 = {
    titulo: 'Teatro de Barrio',
    descripcion: 'Obra teatral gratuita para familias',
    tipo: 'Teatro',
    gente: 95,
    fecha: {
        dia: '2026-12-15',
        hora: '18:00'
    },
    entrada: {
        pago: false,
        precio: 0
    },
    organizador: {
        nombre: 'Cultura Viva',
        contacto: 'contacto@culturaviva.org'
    },
    cobro: {
        se_cobra: false,
        monto_cobro: 0,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
            nombre: 'Nerea Teatro',
            pago: 150,
            duracion: 45
        },
        {
            nombre: 'Ander Escena',
            pago: 150,
            duracion: 45
        },
        {
            nombre: 'Norte Sonoro',
            pago: 250,
            duracion: 45
        }
    ]
};

const evento10 = {
    titulo: 'Festival de Música Local',
    descripcion: 'Actuaciones de artistas locales',
    tipo: 'Concierto',
    gente: 200,
    fecha: {
        dia: '2026-10-20',
        hora: '21:00'
    },
    entrada: {
        pago: false,
        precio: 0
    },
    organizador: {
        nombre: 'Bilbao Music',
        contacto: 'info@bilbaomusic.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 300,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
            nombre: 'Luna Roja',
            pago: 250,
            duracion: 45
        },
        {
            nombre: 'Norte Sonoro',
            pago: 250,
            duracion: 45
        },
        {
            nombre: 'Ander Escena',
            pago: 150,
            duracion: 45
        }
    ]
};

export const eventos = [evento1, evento2, evento3, evento4, evento5, evento6, evento7, evento8, evento9, evento10];