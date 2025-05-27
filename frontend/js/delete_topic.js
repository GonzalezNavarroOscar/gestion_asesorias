async function eliminarTema(id_tema) {
    const response = await fetch('http://localhost:3000/api/borrar-tema', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_tema })
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = 'home_admin.html'
    }
}

async function actualizarSolicitudes(id_tema_old, id_tema_new) {
    const response = await fetch('http://localhost:3000/api/temas_actualizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_tema_old, id_tema_new })
    });
    const result = await response.json();
    if (result.success) {
        eliminarTema(id_tema_old)
    }
}

async function cargarListaTemas() {
    const temas = await cargarTemas();

    const selectDiv = document.getElementById('select_div');
    selectDiv.innerHTML = '';

    if (!Array.isArray(temas)) {
        console.error('Los datos recibidos no son un array:', temas);
        return;
    }

    selectDiv.innerHTML += `
    <select id="materiaSelect" class="filter">
        <option value="" disabled selected>Selecciona un tema</option>
        ${temas.map(tema => `<option value="${tema.id_tema}">${tema.nombre}</option>`).join('')}
    </select>
    `;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function cargarTemas() {
    const id_materia = getQueryParam('id_materia');

    const response = await fetch('http://localhost:3000/api/temas_admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_materia })
    });

    const data = await response.json();
    console.log(data.data)
    return data.data;
}

document.getElementById('materiaForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const id_tema = getQueryParam('id_tema');
    const selected = document.getElementById('materiaSelect')
    await actualizarSolicitudes(id_tema, selected.value)
})

window.onload = cargarListaTemas;
