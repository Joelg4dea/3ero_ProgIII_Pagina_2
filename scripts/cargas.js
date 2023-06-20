// #region funciones que no se deben tocar
// Función para leer el contenido de una URL
async function leerContenido(URL) {
    const response = await fetch(URL);
    const contenido = await response.text();

    return contenido;
}

// Función para devolver una variable con el contenido de un json.
async function leerJSON(URL) {
    try {
        return JSON.parse(await leerContenido(URL));
    } catch (error) {
        console.error('Error al leer el contenido:', URL, error);
    }
}

// Función para reemplazar el contenido de un elemento por lo que esté en una URL.
async function reemplazarContenido(URL, destino) {
    try {
        document.getElementById(destino).innerHTML = await leerContenido(URL);
    } catch (error) {
        console.error('Error al insertar el contenido:', URL, error);
    }
}

// Función para insertar el contenido de una URL en un elemento HTML.
async function insertarContenido(URL, destino) {
    try {
        document.getElementById(destino).insertAdjacentHTML('beforeend', await leerContenido(URL));
    } catch (error) {
        console.error('Error al insertar el contenido:', URL, error);
    }
}

// Lo mismo que arriba pero con el selector CSS.
async function insertarContenidoCSS(URL, destino) {
    await __insertarContenidoCSS(URL, destino, "beforeend");
}

async function __insertarContenidoCSS(URL, destino, locacion) {
    try {
        document.querySelector(destino).insertAdjacentHTML(locacion, await leerContenido(URL));
    } catch (error) {
        console.error('Error al insertar el contenido:', URL, error);
    }
}

function insertarContenidoCSSalPrincipio(contenido, destino) {
    try {
        document.querySelector(destino).insertAdjacentHTML("afterbegin", contenido);
    } catch (error) {
        console.error('Error al insertar el contenido:', URL, error);
    }
}
// #endregion