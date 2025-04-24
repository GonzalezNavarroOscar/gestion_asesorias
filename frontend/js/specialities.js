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

async function mostrarMaterias(materias) {
    const especialidades = await consultar_especialidades()
    const contenedor = document.getElementById('specialities');
    contenedor.innerHTML = ''

    materias.forEach(materia => {
        const materiaCard = document.createElement('div');

        materiaCard.className = 'speciality';

        materiaCard.innerHTML = `

            <label for='especialidad_${materia.nombre}'>${materia.nombre}</label>
            <input type="checkbox" id='especialidad_${materia.nombre}' name='especialidad' value='${materia.nombre}' ${especialidades.includes(materia.nombre) ? 'checked' : ''}>
     
        `;
        contenedor.appendChild(materiaCard);
    });
}

async function consultar_especialidades() {
    try {
        const idAsesor = userData.id_usuario
        const response = await fetch(`http://localhost:3000/api/consultar_especialidades/${idAsesor}`)

        const result = await response.json();
        if (result.success) {
            let especialidades = result.data[0].especialidad
            especialidades = especialidades.split(',')
            let valores = []
            especialidades.forEach(value => {
                if (value.trim() !== '') {
                    valores.push(value)
                }
            })
            return valores
        } else {
            console.log('hola')
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de red al guardar horarios");
    }
}
