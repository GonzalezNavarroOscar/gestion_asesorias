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
        }, 300); // Espera antes de hacer la petición
    });
}

async function obtenerTemasPorMateria(nombreMateria) {
    try {
        const response = await fetch(`http://localhost:3000/api/temas?materia=${encodeURIComponent(nombreMateria)}`);
        const data = await response.json();

        if (data.success) {
            temasMateria = data.data;
            renderTemas(temasMateria);
        } else {
            console.warn('No se encontraron temas:', data.message);
            renderTemas([]);
        }
    } catch (error) {
        console.error('Error al obtener temas por materia:', error);
    }
}

function renderTemas(temas) {
    const contenedor = document.querySelector('.topics-container');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (temas.length === 0) {
        contenedor.innerHTML = `
            <p>No se encontraron temas para la materia "${materiaActual}".</p>
            <div class="card agregar-tema">
                <div class="card-content">
                    <div class="card-text">¿Quieres agregar un nuevo tema?</div>
                    <button id="agregar-tema-btn">Agregar tema</button>
                </div>
            </div>
        `;
        
        // Agregar evento al botón para redirigir a la página de agregar tema
        const agregarBtn = document.getElementById('agregar-tema-btn');
        agregarBtn.addEventListener('click', () => {
            // Podrías usar una URL diferente según la estructura de tu app
            window.location.href = 'add_topic.html?materia=' + encodeURIComponent(materiaActual);
        });

        return;
    }

    temas.forEach(tema => {
        const temaCard = document.createElement('div');
        temaCard.className = 'card';

        temaCard.innerHTML = `
            <div class="topics-card-content">
                <div class="card-text"><strong>${tema.nombre}</strong></div>
                <div class="card-description">${tema.descripción}</div>
                <button onclick="location.href='edit_topic.html?id=${tema.id_tema}'">Editar</button>
            </div>
        `;

        contenedor.appendChild(temaCard);
    });

    const agregarCard = document.createElement('div');
    agregarCard.className = 'card agregar-tema';

    agregarCard.innerHTML = `
        <div class="topics-card-content">
            <div class="card-text">Agregar nuevo tema</div>
            <button onclick="location.href='add_topic.html?materia=${encodeURIComponent(materiaActual)}'">Agregar</button>
        </div>
    `;

    contenedor.appendChild(agregarCard);
}
