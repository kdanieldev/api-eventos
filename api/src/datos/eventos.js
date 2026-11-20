const evento1 = {
    id: 1,
    titulo: 'Risas de Viernes',
    descripcion: 'Monólogos de humor local',
    tipo: 'monologo',
    gente: 90,
    celebrado: true,
    etiquetas: ['humor', 'noche'],
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
        }
    ]
};

const evento2 = {
    id: 2,
    titulo: 'Noche de Comedia',
    descripcion: 'Monólogos de nuevos talentos',
    tipo: 'monologo',
    gente: 65,
    celebrado: false,
    etiquetas: ['humor', 'euskera'],
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
        }
    ]
};

const evento3 = {
    id: 3,
    titulo: 'Rock en Directo',
    descripcion: 'Concierto de bandas emergentes',
    tipo: 'concierto',
    gente: 150,
    celebrado: true,
    etiquetas: ['rock', 'directo'],
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
        }
    ]
};

const evento4 = {
    id: 4,
    titulo: 'Fiesta de Primavera',
    descripcion: 'Sesión nocturna con música pinchada',
    tipo: 'fiesta',
    gente: 120,
    celebrado: false,
    etiquetas: ['fiesta', 'terraza'],
    fecha: {
        dia: '2026-04-10',
        hora: '23:30'
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
    artistas: []
};

const evento5 = {
    id: 5,
    titulo: 'Fiesta Electrónica',
    descripcion: 'Sesión de DJ hasta madrugada',
    tipo: 'fiesta',
    gente: 130,
    celebrado: true,
    etiquetas: ['electronica', 'noche'],
    fecha: {
        dia: '2026-05-18',
        hora: '23:00'
    },
    entrada: {
        pago: true,
        precio: 10
    },
    organizador: {
        nombre: 'Cultura Viva',
        contacto: 'contacto@culturaviva.org'
    },
    cobro: {
        se_cobra: false,
        monto_cobro: 0,
        cobrado: false
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: []
};

const evento6 = {
    id: 6,
    titulo: 'Acústico de Primavera',
    descripcion: 'Concierto íntimo de música acústica',
    tipo: 'concierto',
    gente: 45,
    celebrado: false,
    etiquetas: ['acustico', 'terraza'],
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
        }
    ]
};

const evento7 = {
    id: 7,
    titulo: 'Noche de Karaoke',
    descripcion: 'Canta tus temas favoritos en directo',
    tipo: 'karaoke',
    gente: 85,
    celebrado: false,
    etiquetas: ['karaoke', 'euskera'],
    fecha: {
        dia: '2026-07-22',
        hora: '21:30'
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
        monto_cobro: 110,
        cobrado: false
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: []
};

const evento8 = {
    id: 8,
    titulo: 'Karaoke de Verano',
    descripcion: 'Sesión abierta de karaoke por grupos',
    tipo: 'karaoke',
    gente: 70,
    celebrado: false,
    etiquetas: ['karaoke', 'verano'],
    fecha: {
        dia: '2026-09-05',
        hora: '20:00'
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
        se_cobra: false,
        monto_cobro: 0,
        cobrado: false
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
        nombre: 'Elena Voz',
        pago: 120,
        duracion: 90
        }
    ]
};

const evento9 = {
    id: 9,
    titulo: 'Gran Quiz Cultural',
    descripcion: 'Concurso por equipos con preguntas de cultura general',
    tipo: 'quiz',
    gente: 95,
    celebrado: false,
    etiquetas: ['quiz', 'grupos'],
    fecha: {
        dia: '2026-11-12',
        hora: '19:30'
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
        monto_cobro: 95,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
        nombre: 'Nerea Presenta',
        pago: 150,
        duracion: 60
        },
        {
        nombre: 'Ander Sonido',
        pago: 150,
        duracion: 60
        }
    ]
};

const evento10 = {
    id: 10,
    titulo: 'Quiz Temático de Cine',
    descripcion: 'Trivial por equipos sobre cine y series',
    tipo: 'quiz',
    gente: 80,
    celebrado: false,
    etiquetas: ['quiz', 'cine'],
    fecha: {
        dia: '2026-12-18',
        hora: '20:00'
    },
    entrada: {
        pago: true,
        precio: 6
    },
    organizador: {
        nombre: 'Asociación Humor',
        contacto: 'info@humor.org'
    },
    cobro: {
        se_cobra: true,
        monto_cobro: 140,
        cobrado: true
    },
    cancelado: {
        estado: false,
        razon: ''
    },
    artistas: [
        {
        nombre: 'Luna Roja',
        pago: 200,
        duracion: 45
        },
        {
        nombre: 'Norte Sonoro',
        pago: 200,
        duracion: 45
        }
    ]
};

export const eventos = [evento1, evento2, evento3, evento4, evento5, evento6, evento7, evento8, evento9, evento10];