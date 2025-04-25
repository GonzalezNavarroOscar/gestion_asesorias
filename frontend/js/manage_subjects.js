let todasLasMaterias = []
document.addEventListener('DOMContentLoaded', function () {
    cargarMaterias();
});

export async function cargarMaterias() {
    try {
        const response = await fetch('http://localhost:3000/api/materias');
        const data = await response.json();
        todasLasMaterias = data.data;
        if (data.success) {
            const section = document.getElementById('subjects-section');
            if (section) {
                mostrarMaterias(data.data);
            }
        } else {
            console.error('Error al cargar materias:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export function mostrarMaterias(materias) {
    const contenedor = document.querySelector('.subjects-container');
    if (!contenedor) {
        console.error("No se encontró el contenedor de materias.");
        return;
    }
    contenedor.innerHTML = '';

    const agregarMateriaCard = document.createElement('div');
    agregarMateriaCard.className = 'card agregar-materia';

    agregarMateriaCard.innerHTML = `
        <div class="card-image">
            <img src="../images/plus.png" alt="Agregar Materia">
        </div>
        <div class="card-content">
            <div class="card-text">Agregar nueva materia</div>
            <button onclick="location.href='add_subject.html'">Agregar</button>
        </div>
    `;

    contenedor.appendChild(agregarMateriaCard);

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

const filter = document.getElementById('filter_materias')
filter.addEventListener('change', opcion)