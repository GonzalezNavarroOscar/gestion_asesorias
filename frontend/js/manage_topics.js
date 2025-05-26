export function cargarTemas() {
    cargarListaMaterias();
}

async function cargarMaterias() {
    try {
        const response = await fetch('http://localhost:3000/api/materias_nombres');
        const data = await response.json();

        if (data.success) {
            return data.data
        } else {
            console.warn('Error al obtener las materias');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener materia por nombre:', error);
        return null;
    }
}

async function cargarTemasPorMateria(id_materia) {
    const response = await fetch('http://localhost:3000/api/temas_admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_materia })
    });

    const result = await response.json();
    mostrarTemas(result.data, id_materia);
}

async function cargarListaMaterias() {
    const materias = await cargarMaterias();
    const topicsSection = document.getElementById('topics-section');
    if (!topicsSection) return;

    const selectDiv = document.getElementById('select_div');
    selectDiv.innerHTML = '';
    selectDiv.innerHTML += `
    <select id="materiaSelect" class="filter">
        <option value="" disabled selected>Selecciona una materia</option>
        ${materias.map(materia => `<option value="${materia.id_materia}">${materia.nombre}</option>`).join('')}
    </select>
    `;

    const materiaSelect = document.getElementById('materiaSelect');
    if (materiaSelect) {
        materiaSelect.addEventListener('change', () => {
            cargarTemasPorMateria(materiaSelect.value);
        });
    }
}

function mostrarTemas(temas, id_materia) {
    const topics = document.getElementById('topics');
    topics.innerHTML = '';
    if (temas.length === 0) {
        topics.innerHTML += `
        <p>No hay temas disponibles para esta materia.</p>
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

    temas.forEach(tema => {
        topics.innerHTML += `
            <div class="topics-card-content">
                <div class="card-text"><strong>${tema.nombre}</strong></div>
                <div class="card-description">${tema.descripción}</div>
                ${tema.descripción === 'Agregado por un alumno.' ? '<button>Agregar tema</button>' : `<button onclick="location.href='edit_topic.html?id=${tema.id_tema}&tema=${tema.nombre}&des=${tema.descripción}'">Editar</button>`}
            </div>`
    })
}