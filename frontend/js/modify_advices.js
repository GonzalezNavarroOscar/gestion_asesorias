document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idAsesoria = urlParams.get('id_asesoria');

    const userData = JSON.parse(localStorage.getItem('userData'));
    const idUsuario = userData?.id_usuario;

    if (!idAsesoria) {
        alert('ID de Asesoría no proporcionado en la URL');
        return;
    }

    async function obtenerIdAsesor(idUsuario) {
        try {
            const response = await fetch(`http://localhost:3000/api/asesor/${idUsuario}`);
            if (!response.ok) throw new Error('Error al obtener el asesor');
            
            const result = await response.json();
    
            if (result.length === 0) {
                alert('No se encontró el asesor con ese ID de usuario');
                return null;
            }
    
            return result[0].id_asesor;
        } catch (error) {
            console.error(error);
            alert('No se pudo obtener el ID del asesor');
            return null;
        }
    }

    try {
        const response = await fetch(`http://localhost:3000/api/detalles-asesoria/${idAsesoria}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la solicitud');

        const result = await response.json();
        const asesoria = result.data[0];

        if (!asesoria) {
            alert('No se encontró la asesoría con ese ID');
            return;
        }

        document.getElementById('nombre_alumno').value = asesoria.alumno;
        document.getElementById('nombre_asesor').value = asesoria.asesor;
        document.getElementById('materia').value = asesoria.materia;
        document.getElementById('tema').value = asesoria.tema;
        const fecha = new Date(asesoria.fecha);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        document.getElementById('fecha').value = fechaFormateada;

        document.getElementById('hora').value = asesoria.hora;

        document.getElementById('mode').value = asesoria.modalidad;

        document.getElementById('aula').value = asesoria.aula;

        document.querySelector('input[name="id_asesoria"]').value = idAsesoria;

        console.log(asesoria);

    } catch (error) {
        console.error('Error al cargar detalles de la asesoría:', error);
        alert('No se pudo cargar la información de la solicitud');
    }

    //Manejo del formulario
    document.getElementById('form_accept').addEventListener('submit', async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:3000/api/modificar-asesoria/${idAsesoria}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la asesoria');

        const result = await response.json();
        const asesoria = result.data[0];

        const idAsesor = await obtenerIdAsesor(idUsuario);

        const fecha = new Date(solicitud.fecha_solicitud);
        const fechaFormateada = fecha.toISOString().split('T')[0];

        const correoAlumno = `al${asesoria.matricula}@ite.edu.mx`;

        const asesoriaData = {
            id_usuario_alumno: asesoria.id_alumno,
            id_usuario_asesor: idAsesor,
            id_alumno: asesoria.id_alumno,
            id_asesor: idAsesor,
            id_materia: asesoria.id_materia,
            id_tema: asesoria.id_tema,
            nombre_tema: asesoria.tema,
            fecha: fechaFormateada,
            hora: asesoria.hora,
            aula: asesoria.getElementById('aula').value,
            modalidad: solicitud.modalidad
        };

        console.log(asesoriaData);

        try {
            const response = await fetch('http://localhost:3000/api/asesoria', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(asesoriaData)
            });

            if (!response.ok) throw new Error('Error al crear solicitud');

            alert('¡Asesoría aceptada con éxito!');

            setTimeout(() => {
                window.location.href = 'home_adviser.html';
            }, 500);

        } catch (error) {
            console.error(error);
            alert('Error al aceptar asesoría');
        }
    });
});
