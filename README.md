# Sala Arke - API REST

API REST con Node.js y Express para gestionar eventos culturales, almacén y pedidos de Sala Arke. Los datos se mantienen en memoria y se procesan mediante métodos de array, inmutabilidad y copias profundas.

## Inicio

### Requisitos

- Node
- npm

### Instalación y ejecución

```bash
npm install
npm start
```

El servidor escucha en `http://localhost:4000`.

## Estructura

```text
api/
  servidor.js         # Punto de entrada, estado clonado y middlewares
src/
  config.js           # Constantes y reglas de negocio
  validar.js          # Validaciones
  datos/
    eventos.js        # 10 eventos iniciales
    almacen.js        # 5 productos iniciales
    pedidos.js        # 2 pedidos iniciales
  servicios/
    comun.js          # Búsqueda por id y siguiente id
    eventos.js        # CRUD, cálculos y informes
    almacen.js        # CRUD, necesidades, previsión y valor
    pedidos.js        # Creación, listado y recepción
  rutas/
    eventos.js        # /api/eventos
    almacen.js        # /api/productos
    pedidos.js        # /api/pedidos
package.json
peticiones.http      # Pruebas para REST Client de VS Code
```

## Diseño de los datos

### Principios

1. Cada magnitud numérica usa `number`; la unidad se indica en el nombre del campo o en la documentación.
2. Los datos derivados se calculan al responder, no se guardan: camareros, costes, balance, necesidades y valor del almacén. La excepción es `importeTotal` de los pedidos, que se conserva al crear el pedido porque el precio de compra puede cambiar.
3. El estado inicial y cada operación usan copias profundas para mantener la inmutabilidad.

### Eventos

Ejemplo:

```json
{
  "id": 1,
  "titulo": "Risas de Viernes",
  "descripcion": "Monólogos de humor local",
  "tipo": "monologo",
  "gente": 90,
  "celebrado": true,
  "etiquetas": ["humor", "noche"],
  "fecha": { "dia": "2026-02-14", "hora": "21:00" },
  "entrada": { "pago": true, "precio": 8 },
  "organizador": { "nombre": "Asociación Humor", "contacto": "info@humor.org" },
  "cobro": { "se_cobra": true, "monto_cobro": 100, "cobrado": true },
  "cancelado": { "estado": false, "razon": "" },
  "artistas": [
    { "nombre": "Alicia", "pago": 250, "duracion": 30 }
  ]
}
```

Incluye cinco objetos anidados (`fecha`, `entrada`, `organizador`, `cobro` y `cancelado`), un array de objetos (`artistas`) y un array de valores simples (`etiquetas`). Los artistas tienen `nombre`, `pago` en euros y `duracion` en minutos. Son booleanos `celebrado`, `entrada.pago`, `cobro.se_cobra`, `cobro.cobrado` y `cancelado.estado`; `fecha.dia` usa `AAAA-MM-DD`.

Los bloques semánticos facilitan la lectura y permiten actualizar parcialmente un objeto con `PATCH` sin sustituir el resto. La cancelación siempre usa `{ estado: boolean, razon: string }`, en vez de `null` o estructuras variables; así se evitan comprobaciones constantes de nulidad y no queda texto residual en un evento activo.

### Productos

Ejemplo:

```json
{
  "id": 1,
  "nombre": "Cocacola",
  "categoria": "bebida",
  "unidad": "botella",
  "disponibles": 35,
  "minimo": 50,
  "compra": { "tipo": "caja", "unidades": 20, "costo": 30 },
  "proveedor": { "nombre": "Cocacola", "telefono": 132349583 },
  "consumo": {
    "monologo": 1,
    "concierto": 2,
    "fiesta": 3,
    "karaoke": 2,
    "quiz": 1.5,
    "privado": 2
  }
}
```

Incluye tres objetos anidados: `compra`, `proveedor` y `consumo`. `compra` define el formato de reposición, `proveedor` contiene los datos de contacto y `consumo` permite calcular directamente el gasto de cada tipo de evento.

El consumo no se representa como array de objetos (`[{ tipo, cantidad }]`) porque exigiría búsquedas adicionales y dificultaría comprobar que estén presentes todos los tipos permitidos.

### Pedidos

Ejemplo:

```json
{
  "id": 1,
  "fecha": "2026-10-10",
  "recibido": true,
  "lineas": [
    { "productoId": 1, "cajas": 2 },
    { "productoId": 2, "cajas": 1 }
  ],
  "importeTotal": 82
}
```

Cada línea referencia `productoId` y el número entero de `cajas`. Así se evita duplicar datos mutables del producto y se pueden añadir dinámicamente nombre, unidad y subtotales al consultar el pedido. El importe total se calcula al crear y representa el coste histórico. Los pedidos pueden contener productos de varios proveedores.

## Reglas de negocio

Configuradas en `src/config.js`:

| Constante | Valor | Uso |
| :--- | :--- | :--- |
| `nombre_sala` | `sala Arke` | Nombre oficial |
| `aforo` | `150` | Capacidad máxima por evento |
| `personas_por_camarero` | `35` | Asistentes por camarero, redondeo hacia arriba |
| `minimo_camareros` | `2` | Mínimo en eventos activos |
| `coste_camarero` | `90` | Euros por camarero y evento |
| `tipos` | `monologo`, `concierto`, `fiesta`, `karaoke`, `quiz`, `privado` | Tipos válidos |

Las fiestas añaden un camarero adicional. Los eventos cancelados tienen camareros, costes, ingresos y balance iguales a `0`.

## Endpoints

### Eventos: `/api/eventos`

| Método | Ruta | Resultado | Códigos |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/eventos` | Lista filtrada, ordenada y paginada: `{ total, pagina, limite, datos }`. | `200` |
| `GET` | `/api/eventos/resumen` | Totales, celebrados, cancelados, media de asistentes y balance previsto. | `200` |
| `GET` | `/api/eventos/deudas` | Alquiler pendiente agrupado por organizador, solo con deuda mayor que `0`. | `200` |
| `GET` | `/api/eventos/actuaciones` | Actuaciones planas con identificadores y fecha, ordenadas por caché descendente. | `200` |
| `GET` | `/api/eventos/calendario?mes=AAAA-MM` | Eventos activos del mes, ordenados por fecha y hora. | `200` |
| `GET` | `/api/eventos/preguntas` | Booleanos: alquiler sin cobrar, almacén sobre mínimo y artistas con más de una actuación. | `200` |
| `GET` | `/api/eventos/:id/necesidades` | Consumo necesario, disponible y faltante; incluye `haySuficienteDeTodo`. | `200`, `400`, `404` |
| `GET` | `/api/eventos/:id` | Detalle con datos calculados. | `200`, `400`, `404` |
| `POST` | `/api/eventos` | Crea un evento con `id` automático. | `201`, `400` |
| `PUT` | `/api/eventos/:id` | Sustituye el evento conservando su `id`. | `200`, `400`, `404` |
| `PATCH` | `/api/eventos/:id` | Actualiza parcialmente y fusiona objetos anidados. | `200`, `400`, `404` |
| `PATCH` | `/api/eventos/:id/cancelar` | Cancela el evento con `{ motivo }`. | `200`, `400`, `404`, `409` |
| `PATCH` | `/api/eventos/:id/pagar-alquiler` | Marca `cobro.cobrado = true`. | `200`, `400`, `404`, `409` |
| `PATCH` | `/api/eventos/:id/celebrar` | Marca el evento como celebrado y descuenta el consumo del almacén. | `200`, `400`, `404`, `409` |
| `DELETE` | `/api/eventos/:id` | Elimina el evento. | `204`, `400`, `404` |

#### Consulta de eventos

- Filtros: `tipo`, `precioMin`, `precioMax`, `gratis=true|false`, `texto`, `etiqueta`, `desde`, `hasta`, `organizador`, `artista`, `cancelado=true|false`, `alquilerPendiente=true`, `minCamareros`.
- Texto: busca en título o descripción sin distinguir mayúsculas.
- Ordenación: `orden` y `dir=asc|desc` (`fecha` usa `hora` como desempate).
- Paginación: `pagina=1` y `limite=10`.
- Proyección: `campos` con nombres separados por comas; `id` siempre se incluye.

### Almacén: `/api/productos`

| Método | Ruta | Resultado | Códigos |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/productos` | Lista productos; admite `categoria=bebida\|comida\|otros` y `bajoMinimo=true`. | `200` |
| `GET` | `/api/productos/valor` | Valor total y por categoría (`costo / unidades`). | `200` |
| `GET` | `/api/productos/prevision` | Cajas necesarias para cubrir eventos pendientes y recuperar los mínimos, con importe total. | `200` |
| `GET` | `/api/productos/:id` | Detalle por `id`. | `200`, `400`, `404` |
| `POST` | `/api/productos` | Crea un producto. | `201`, `400` |
| `PATCH` | `/api/productos/:id` | Actualiza parcialmente y fusiona objetos anidados. | `200`, `400`, `404` |
| `DELETE` | `/api/productos/:id` | Elimina el producto; devuelve `409` si aparece en un pedido pendiente. | `204`, `400`, `404`, `409` |

### Pedidos: `/api/pedidos`

| Método | Ruta | Resultado | Códigos |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pedidos` | Lista del más reciente al más antiguo; admite `pendiente=true`. | `200` |
| `GET` | `/api/pedidos/:id` | Detalle enriquecido con nombre, unidad y subtotal por línea. | `200`, `400`, `404` |
| `POST` | `/api/pedidos` | Crea `{ lineas: [{ productoId, cajas }] }` con fecha de hoy e importe calculado. | `201`, `400` |
| `POST` | `/api/pedidos/automatico` | Crea un pedido desde `/api/productos/prevision`. | `201`, `409` |
| `PATCH` | `/api/pedidos/:id/recibir` | Recibe el pedido y suma `cajas * compra.unidades` al almacén. | `200`, `400`, `404`, `409` |

## Respuestas de error

Los errores son JSON con el siguiente significado:

- `400 Bad Request`: `{ "errores": ["Mensaje descriptivo", "..."] }`; fallos de validación, reglas cruzadas o identificadores.
- `404 Not Found`: `{ "error": "Recurso o ruta no encontrada" }`.
- `409 Conflict`: `{ "error": "Motivo del conflicto", "faltantes": [...] }`; por ejemplo, falta de stock al celebrar.
- `500 Internal Server Error`: `{ "error": "Error interno" }`.
