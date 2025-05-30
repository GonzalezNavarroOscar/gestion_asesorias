let todosLosTemas = [];
let materiaGlobal = null
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreMateria = urlParams.get('materia');
    const id_materia = urlParams.get('num');

    if (nombreMateria) {
        const nombreDecodificado = decodeURIComponent(nombreMateria);
        document.getElementById('nombreMateria').textContent = nombreDecodificado;

        cargarTemas(nombreDecodificado);
        materiaGlobal = nombreDecodificado
    } else {
        mostrarError("No se especificó una materia.");
    }
    document.getElementById('personalized_btn').innerHTML = `<button onclick="window.location='custom_request.html?materia=${encodeURIComponent(nombreMateria)}&num=${encodeURIComponent(id_materia)}'">Crear una solicitud personalizada</button>`
});

async function cargarTemas(nombreMateria) {
    const listaTemas = document.getElementById('listaTemas');
    listaTemas.innerHTML = '<li>Cargando temas...</li>';

    try {
        const apiUrl = new URL('http://localhost:3000/api/temas');
        apiUrl.searchParams.append('materia', nombreMateria);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const { success, data, message } = await response.json();

        if (!success) {
            throw new Error(message || 'Respuesta no exitosa del servidor');
        }

        todosLosTemas = data
        mostrarTemas(data, nombreMateria)

    } catch (error) {
        console.error('Error al cargar temas:', error);
        mostrarError(error.message);
    }
}

function mostrarTemas(temas, materia) {
    const listaTemas = document.getElementById('listaTemas');
    listaTemas.innerHTML = '';
    if (temas.length === 0) {
        listaTemas.innerHTML = '<li class="empty">No hay temas disponibles.</li>';
        return;
    }

    temas.forEach(tema => {
        const item = document.createElement('li');
        item.innerHTML = `
            <div class='topic_content'>
                <h3>${tema.nombre}</h3>
                <h5>${tema.descripción}</h5>
            </div>
            <button  type='button' class="btn-request" onclick="location.href='request_advice.html?tema=${encodeURIComponent(tema.nombre)}&materia=${encodeURIComponent(materia)}'">Solicitar</button>
        `;
        listaTemas.appendChild(item);
    });
}

function mostrarError(mensaje) {
    const listaTemas = document.getElementById('listaTemas');
    listaTemas.innerHTML = `<li class="error">${mensaje}</li>`;
}

const opcion = () => {
    const select = filter.selectedIndex
    switch (select) {
        case 1:
            todosLosTemas.sort((a, b) => b.popularidad - a.popularidad);
            break
        case 2:
            todosLosTemas.sort((a, b) => a.popularidad - b.popularidad);
            break
        case 3:
            todosLosTemas.sort((a, b) => {
                return a.nombre.localeCompare(b.nombre);
            })
            break
        case 4:
            todosLosTemas.sort((a, b) => {
                return b.nombre.localeCompare(a.nombre);
            })
            break
    }
    mostrarTemas(todosLosTemas, materiaGlobal)
}

const filter = document.getElementById('filter')
filter.addEventListener('change', opcion)
