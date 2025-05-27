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

async function eliminarTema(id_tema, id_materia) {
    const response = await fetch('http://localhost:3000/api/borrar-tema', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_tema })
    });

    const result = await response.json();
    cargarTemasPorMateria(id_materia);
}

function mostrarTemas(temas, id_materia) {
    const topics = document.getElementById('topics');
    topics.innerHTML = '';
    if (temas.length === 0) {
        topics.innerHTML += `
        <div class="topics-card-content">
                <div class="card-text"><strong>No existen temas para esta materia.</strong></div>
        </div>
        <div class="topics-card-content">
            <div class="card-text">¿Quieres agregar un nuevo tema?</div>
            <button id="agregar-tema-btn" onclick="window.location.href = 'add_topic.html?id_materia=${id_materia}'">Agregar nuevo tema</button>
        </div>
        `;
        const agregarBtn = document.getElementById('agregar-tema-btn');
        agregarBtn.addEventListener('click', () => {
            window.location.href = `add_topic.html?id_materia=${id_materia}`;
        });
        return;
    }

    topics.innerHTML += `
            <div class="topics-card-content">
                <div class="card-text">¿Quieres agregar un nuevo tema?</div>
                <button id="agregar-tema-btn" onclick="window.location.href = 'add_topic.html?id_materia=${id_materia}'">Agregar nuevo tema</button>\
            </div>
    `;

    temas.forEach(tema => {
        topics.innerHTML += `
            <div class="topics-card-content">
                <div class="card-text"><strong>${tema.nombre}</strong></div>
                <div class="card-description">${tema.descripción}</div>
                ${tema.descripción === 'Agregado por un alumno.' ? `<button style="background-color: #28a745;" onclick="location.href='add_topic.html?id_tema=${tema.id_tema}&tema=${encodeURIComponent(tema.nombre)}&des=${encodeURIComponent(tema.descripción)}'">Agregar tema</button>` : `<button onclick="location.href='add_topic.html?id_tema=${tema.id_tema}&tema=${encodeURIComponent(tema.nombre)}&des=${encodeURIComponent(tema.descripción)}'">Editar</button>`}
                <button class="eliminar-btn" data-id-tema="${tema.id_tema}" data-id-materia="${id_materia}" style="background-color:red">Eliminar</button>
            </div>`
    })

    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idTema = btn.getAttribute('data-id-tema');
            const idMateria = btn.getAttribute('data-id-materia');
            eliminarTema(idTema, idMateria);
        });
    });

}