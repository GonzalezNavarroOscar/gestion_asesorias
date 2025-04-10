document.addEventListener('DOMContentLoaded', function() {
    cargarMaterias();
});

async function cargarMaterias() {
    try {
        const response = await fetch('http://localhost:3000/api/materias');
        const data = await response.json();
        
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
    const contenedor = document.getElementById('materias');

    materias.forEach(materia => {
        const materiaCard = document.createElement('div');
        materiaCard.className = 'card';

        materiaCard.innerHTML = `
            <div class="card-image">
                <img src="${materia.imagen}" alt="${materia.nombre}">
            </div>
            <div class="card-content">
                <div class="card-text">${materia.nombre}</div>
                <div class="card-description">${materia.descripción}</div>
                <button onclick="location.href='advice_request.html?materia=${encodeURIComponent(materia.nombre)}'">Ver más</button>
            </div>
        `;

        contenedor.appendChild(materiaCard);
    });
}