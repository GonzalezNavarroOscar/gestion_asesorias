document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreMateria = urlParams.get('materia');
    const nombreTema = urlParams.get('tema');

    const userData = JSON.parse(localStorage.getItem('userData'));
    const idUsuario = userData?.id_usuario;

    const inputMateria = document.getElementById('subject');
    const inputTema = document.getElementById('topic');

    document.getElementById("date").min = new Date().toISOString().split("T")[0];

    if (nombreMateria && nombreTema) {
        inputMateria.value = decodeURIComponent(nombreMateria);
        inputTema.value = decodeURIComponent(nombreTema);
    }

    async function obtenerIdAlumno(idUsuario) {
        try {
            const response = await fetch(`http://localhost:3000/api/alumno/${idUsuario}`);
            if (!response.ok) throw new Error('Error al obtener el alumno');
            
            const result = await response.json();
    
            if (result.length === 0) {
                alert('No se encontró el alumno con ese ID de usuario');
                return null;
            }

            console.log(result)
    
            return result[0].id_alumno;
        } catch (error) {
            console.error(error);
            alert('No se pudo obtener el ID del alumno');
            return null;
        }
    }

    async function obtenerTemasPorMateria(nombreMateria) {
        try {
            const response = await fetch(`http://localhost:3000/api/temas?materia=${encodeURIComponent(nombreMateria)}`);
            if (!response.ok) throw new Error('Error al obtener los temas');
            
            const result = await response.json();
    
            if (result.count === 0) {
                alert('No se encontraron temas para esa materia');
                return [];
            }

            console.log("Temas obtenidos:", result.data);
    
            return result.data;
        } catch (error) {
            console.error(error);
            alert('No se pudo obtener los temas');
            return [];
        }
    }

    async function llenarTemas(nombreMateria, nombreTema) {
        const temas = await obtenerTemasPorMateria(nombreMateria);
        
        if (temas.length > 0) {
            console.log("Temas disponibles:", temas);
            const temaSeleccionado = temas.find(tema => tema.nombre === nombreTema);
            
            if (temaSeleccionado) {
                inputTema.value = temaSeleccionado.nombre;
                
                const idMateria = temaSeleccionado.id_materia;
                const idTema = temaSeleccionado.id_tema;

                console.log('idMateria:', idMateria);
                console.log('idTema:', idTema);

                return { idMateria, idTema };
            } else {
                alert('No se encontró el tema con ese nombre');
            }
        } else {
            alert('No hay temas disponibles para esta materia');
        }

        return null;
    }

    // Manejo del formulario de solicitud
    document.getElementById('form_request').addEventListener('submit', async (e) => {
        e.preventDefault();

        const idAlumno = await obtenerIdAlumno(idUsuario);
        console.log(idAlumno);
        
        if (!idAlumno || !nombreMateria || !nombreTema) {
            alert('Faltan datos para completar la solicitud');
            return;
        }

        const { idMateria, idTema } = await llenarTemas(nombreMateria, nombreTema);

        if (!idMateria || !idTema) {
            alert('No se pudo obtener el ID de la materia o tema');
            return;
        }

        const solicitudData = {
            id_usuario: idUsuario,
            id_alumno: idAlumno,
            id_materia: idMateria,
            id_tema: idTema,
            fecha_solicitud: document.getElementById('date').value,
            estado: 'Pendiente',
            observaciones: document.getElementById('Observations').value,
            hora: document.getElementById('initial_hour').value,
            modalidad: document.getElementById('mode').value
        };

        console.log(solicitudData);
        try {
            const response = await fetch('http://localhost:3000/api/solicitud', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(solicitudData)
            });

            if (!response.ok) throw new Error('Error al crear solicitud');

            alert('¡Solicitud enviada con éxito!');
            window.location.href = 'home_student.html';
        } catch (error) {
            console.error(error);
            alert('Error al enviar solicitud');
        }
    });
});
