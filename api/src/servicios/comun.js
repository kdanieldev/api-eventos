//Devuelve el elemento un array que coincida con el id indicado
export const buscar_id = (array, id) => {
    if (!Array.isArray(array)) {
        return undefined;
    }

    return array.find((elemento) => elemento.id === id);
};

//Buscq el siguiente id disponible para un array a partir del mayor id existente
export const aumentar_id = (array) => {
    if (!Array.isArray(array) || array.length < 1) {
        return 1;
    }

    const listaID = array.map((elemento) => elemento.id);
    const mayorID = Math.max(...listaID);

    return mayorID + 1;
};