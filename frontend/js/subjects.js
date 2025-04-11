let todasLasMaterias = []
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
    const contenedor = document.getElementById('materias');
    contenedor.innerHTML = ''

    materias.forEach(materia => {
        const materiaCard = document.createElement('div');

        materiaCard.className = 'card';

        materiaCard.innerHTML = `
            <div class="card-image">
                <img src="../${materia.imagen}" alt="${materia.nombre}">
            </div>
            <div class="card-content">
                <div class="card-text">${materia.nombre}</div>
                <div class="card-description">${materia.descripción}</div>
                <button onclick="location.href='advice_list.html?materia=${encodeURIComponent(materia.nombre)}'">Ver más</button>
            </div>
        `;
        contenedor.appendChild(materiaCard);
    });
}

const opcion = () => {
    const select = filter.selectedIndex
    switch (select) {
        case 1:
            todasLasMaterias.sort((a, b) => b.popularidad - a.popularidad);
            break
        case 2:
            todasLasMaterias.sort((a, b) => a.popularidad - b.popularidad);
            break
        case 3:
            todasLasMaterias.sort((a, b) => {
                return a.nombre.localeCompare(b.nombre);
            })
            break
        case 4:
            todasLasMaterias.sort((a, b) => {
                return b.nombre.localeCompare(a.nombre);
            })
            break
    }
    mostrarMaterias(todasLasMaterias)
}

const filter = document.getElementById('filter')
filter.addEventListener('change', opcion)