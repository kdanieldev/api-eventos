export const buscar_id = (array, id) => {
    return array.find(a => a.id === id);
};

const aumentar_id = (array) => {
    if (array.length < 1) {
        return 1;
    } else {
        const listaID = array.map(a => a.id);
        const mayorID = Math.max(...listaID);
        return mayorID + 1;
    }
};