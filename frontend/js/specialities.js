document.addEventListener('DOMContentLoaded', function () {
    cargarMaterias();
});

async function cargarMaterias() {
    try {
        const response = await fetch('http://localhost:3000/api/materias');
        const data = await response.json();
        todasLasMaterias = data.data
        if (data.success) {
            mostrarMaterias(data.data);
        } else {
            console.error('Error al cargar materias:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarMaterias(materias) {
    const contenedor = document.getElementById('specialities');
    contenedor.innerHTML = ''

    contador = 0

    materias.forEach(materia => {
        contador = contador + 1
        const materiaCard = document.createElement('div');

        materiaCard.className = 'card';

        materiaCard.innerHTML = `
            <label>${materia.nombre}</label>
            <input type="checkbox" id='especialidad_${contador}'>
        `;
        contenedor.appendChild(materiaCard);
    });
}

