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

function insertarStringCSSalPrincipio(contenido, destino) {
    try {
        document.querySelector(destino).insertAdjacentHTML("afterbegin", contenido);
    } catch (error) {
        console.error('Error al insertar el contenido:', URL, error);
    }
}

function insertarStringCSS(contenido, destino) {
    try {
        document.querySelector(destino).insertAdjacentHTML("beforeend", contenido);
    } catch (error) {
        console.error('Error al insertar el contenido:', URL, error);
    }
}

function eliminarSegunID(identificador) {
    try {
        document.getElementById(identificador).remove();
    } catch (error) {
        console.error("No se pudo eliminar según identificador", identificador);
    }
}

function eliminarSegunCSS(selector) {
    try {
        document.querySelector(selector).remove();
    } catch (error) {
        console.error("No se pudo eliminar según selector", selector);
    }
}
// #endregion


// #region funciones de búsqueda
// borrar el texto que se muestra en los buscadores
function buscador_input_borrarTexto(input) {
    input.placeholder = "";
}

function buscador_input_ponerTexto(input) {
    if (!input.value) {
        input.placeholder = "Buscar...";
    }
}

function __formulario_enviar_busquedaTxt(evento, formulario) {
    //  previene el comportamiento predeterminado del formulario al presionar ENTER
    evento.preventDefault();

    //  envía la búsqueda
    enviar_busquedaTxt(formulario);
}

function enviar_busquedaTxt(formulario) {
    //  a continuación se verifica que al presionar el botón haya texto en el campo de búsqueda
    //  si lo hay, se redirecciona a la página de búsqueda con el texto que se escribió.
    if (formulario.elements[0].value) {
        window.location.href = document.location.href.replace(/\/[A-Z\._\- ?]+$/i, ('/busqueda.html?texto=') + formulario.elements[0].value);
    }

    return
}

function quitarAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function borrarSegun(articulos, articulos_clave, elementos, comparacion) {
    // función que borra TODOS los artículos que no coincidan con el criterio de búsqueda de los elementos,
    // teniendo en cuenta el método de comparación.
    // 'articulos' es la lista de artículos.
    // 'articulos_clave' la clave que se tomará en cuenta para comparar los elementos.
    // 'elementos' son los objetos que se utilizarán para compararlos con los artículos.
    // 'comparacion' especifica la forma en que se hará la comparación:
    //    0: comparar (texto contra texto, o números) mediante el operador de comparación ==
    //    1: buscar un elemento en una lista de objetos mediante includes()
    //    2: comparar (texto contra texto) utilizando una expresión regular
    // creación de una variable temporal, que contendrá los artículos que coinciden con el parametro.
    var borrado_segun_param = new Array();
    for (let elemento of elementos) {
        // concantenación sobre 'borrado_segun_param' aquellos artículos que coincidan con el parámetro
        // Si la clave del articulo 'parametro_articulo' coincide con el elemento de comparación, entonces
        // se lo acepta y acaba incluído en la lista.
        switch (comparacion) {
            case 0:
                borrado_segun_param = borrado_segun_param.concat(articulos.filter(articulo => articulo[articulos_clave] == elemento));
                break;
            case 1:
                borrado_segun_param = borrado_segun_param.concat(articulos.filter(articulo => articulo[articulos_clave].includes(elemento)));
                break;
            case 2:
                const expresion_regular = new RegExp(elemento, "i");
                borrado_segun_param = borrado_segun_param.concat(articulos.filter(articulo => articulo[articulos_clave].match(expresion_regular)));
                break;
        }
    }
    // finalmente, se devuelve la lista de artículos que coincidieron.
    return borrado_segun_param;
}

async function borrarSegunTexto(articulos, elementos, permitir_acentos) {
    // función que borra TODOS los artículos que no coincidan con el texto de los elementos,
    // 'articulos' es la lista de artículos.
    // 'elementos' son los textos que DEBEN estar en los artículos.
    // creación de una variable temporal, que contendrá los artículos que coinciden con los textos.
    var borrado_segun_param = new Array();

    // concantenación sobre 'borrado_segun_param' aquellos artículos que coincidan con el texto del elemento
    // Si el texto del articulo coincide con el texto del elemento, entonces
    // se lo acepta y acaba incluído en la lista.
    if (permitir_acentos) {
        const expresion_regular = new RegExp(elementos.join('|'), "i");

        for (let articulo of articulos) {
            // a continuación se descarga el artículo entero para poder leer el texto,
            // para ello primero se separa las partes del artículo según elementos
            // por lo que el texto del artículo se encontrará en el índice 7
            // dicho texto se comparará con los elementos. si la comparación es exitosa,
            // entonces se acepta el artículo y acaba incluído en la lista.
            if (((await leerContenido(articulo.URL)).split(/<.*?>|<\/.*?>/))[7].match(expresion_regular)) {
                borrado_segun_param = borrado_segun_param.concat(articulo);
            }
        }
    } else {
        //  lo mismo que arriba, pero borrando los acentos
        const expresion_regular = new RegExp(quitarAcentos(elementos.join('|')), "i");

        for (let articulo of articulos) {
            if (quitarAcentos(((await leerContenido(articulo.URL)).split(/<.*?>|<\/.*?>/))[7]).match(expresion_regular)) {
                borrado_segun_param = borrado_segun_param.concat(articulo);
            }
        }
    }

    // finalmente, se devuelve la lista de artículos que coincidieron.
    return borrado_segun_param;
}
// #endregion