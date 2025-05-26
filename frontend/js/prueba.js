

let temasMateria = [];
let materiaActual = '';

export function cargarTemas() {
    agregarBarraBusqueda();
}

function agregarBarraBusqueda() {
    const topicsSection = document.getElementById('topics-section');
    if (!topicsSection) return;

    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('search-wrapper');

    searchWrapper.innerHTML = `
        <input type="text" id="busqueda-materia" placeholder="Buscar materia por nombre..." />
    `;

    topicsSection.prepend(searchWrapper);

    const inputBusqueda = document.getElementById('busqueda-materia');
    let timeout;

    inputBusqueda.addEventListener('input', (e) => {
        clearTimeout(timeout);
        const filtro = e.target.value.trim();

        timeout = setTimeout(() => {
            if (filtro.length > 2) {
                materiaActual = filtro;
                obtenerTemasPorMateria(filtro);
            }
        }, 300);
    });
}

async function obtenerTemasPorMateria(nombreMateria) {
    try {
        const materia = await obtenerMateriaPorNombre(nombreMateria);
        if (!materia) {
            renderMateriaInexistente();
            return;
        }

        const response = await fetch(`http://localhost:3000/api/temas?materia=${encodeURIComponent(nombreMateria)}`);
        const data = await response.json();

        if (data.success) {
            temasMateria = data.data;
            renderTemas(temasMateria, materia.id_materia);
        } else {
            console.warn('No se encontraron temas:', data.message);
            renderTemas([], materia.id_materia);
        }
    } catch (error) {
        console.error('Error al obtener temas por materia:', error);
    }
}

async function obtenerMateriaPorNombre(nombreMateria) {
    try {
        const response = await fetch('http://localhost:3000/api/materias');
        const data = await response.json();

        if (data.success) {
            const materia = data.data.find(m => m.nombre.toLowerCase() === nombreMateria.toLowerCase());
            return materia;
        } else {
            console.warn('Error al obtener las materias');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener materia por nombre:', error);
        return null;
    }
}

function renderTemas(temas, id_materia) {
    const contenedor = document.querySelector('.topics-container');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (temas.length === 0) {
        contenedor.innerHTML = `
            <p>No se encontraron temas para la materia "${materiaActual}".</p>
            <div class="card agregar-tema">
                <div class="topics-card-content">
                    <div class="card-text">¿Quieres agregar un nuevo tema?</div>
                    <button id="agregar-tema-btn">Agregar tema</button>
                </div>
            </div>
        `;

        const agregarBtn = document.getElementById('agregar-tema-btn');
        agregarBtn.addEventListener('click', () => {
            window.location.href = `add_topic.html?id_materia=${id_materia}`;
        });

        return;
    }

    const agregarCard = document.createElement('div');
    agregarCard.className = 'card agregar-tema';

    agregarCard.innerHTML = `
        <div class="topics-card-content">
            <div class="card-text">Agregar nuevo tema</div>
            <button onclick="location.href='add_topic.html?id_materia=${id_materia}'">Agregar</button>
        </div>
    `;

    contenedor.appendChild(agregarCard);

    temas.forEach(tema => {
        const temaCard = document.createElement('div');
        temaCard.className = 'card';

        temaCard.innerHTML = `
            <div class="topics-card-content">
                <div class="card-text"><strong>${tema.nombre}</strong></div>
                <div class="card-description">${tema.descripción}</div>
                <button onclick="location.href='edit_topic.html?id=${tema.id_tema}'">Editar</button>
                ${tema.descripción.trim() === 'Agregado por un alumno.' ? '<button>Agregar tema</button>' : ''}
            </div>
        `;

        contenedor.appendChild(temaCard);
    });

}

function renderMateriaInexistente() {
    const contenedor = document.querySelector('.topics-container');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <p>La materia "${materiaActual}" no existe en el sistema.</p>
    `;
}

