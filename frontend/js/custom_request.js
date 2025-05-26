const userData = JSON.parse(localStorage.getItem('userData'));
const idUsuario = userData?.id_usuario;
var materiaGlobal = ''
var idMateriaGlobal = ''

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreMateria = urlParams.get('materia');
    const idMateria = urlParams.get('num')

    if (nombreMateria) {
        const nombreDecodificado = decodeURIComponent(nombreMateria);
        const idDecodificado = decodeURIComponent(idMateria);
        document.getElementById('subject').value = nombreDecodificado;
        materiaGlobal = nombreDecodificado
        idMateriaGlobal = idDecodificado
    } else {
        mostrarError("No se especificó una materia.");
    }
});

async function obtenerIdAlumno(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/api/alumno/${idUsuario}`);
        if (!response.ok) throw new Error('Error al obtener el alumno');

        const result = await response.json();

        if (result.length === 0) {
            alert('No se encontró el alumno con ese ID de usuario');
            return null;
        }

        return result[0].id_alumno;
    } catch (error) {
        console.error(error);
        alert('No se pudo obtener el ID del alumno');
        return null;
    }
}

document.getElementById('form_request').addEventListener('submit', async function (e) {
    e.preventDefault()

    async function agregarTema(id_materia) {
        const tema = document.getElementById('topic')
        const data = {
            id_materia: id_materia,
            nombre: tema.value,
            descripcion: 'Agregado por un alumno.',
            agregado_admin: false
        };

        try {
            const response = await fetch('http://localhost:3000/api/agregar-temas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log(result);

            if (result.success) {
                alert("Tema registrado exitosamente.");
            } else {
                alert("Error: " + result.message);
            }

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor.");
        }
    }

    agregarTema(idMateriaGlobal)
    const idAlumno = await obtenerIdAlumno(idUsuario)

    const solicitudData = {
        id_usuario: idUsuario,
        id_alumno: idAlumno,
        id_materia: idMateriaGlobal,
        id_tema: idTema,
        fecha_solicitud: document.getElementById('date').value,
        estado: 'Pendiente',
        observaciones: document.getElementById('Observations').value,
        hora: document.getElementById('initial_hour').value,
        modalidad: document.getElementById('mode').value
    };

})