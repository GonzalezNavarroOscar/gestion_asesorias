document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idSolicitud = urlParams.get('id_solicitud');

    const userData = JSON.parse(localStorage.getItem('userData'));
    const idUsuario = userData?.id_usuario;

    if (!idSolicitud) {
        alert('ID de solicitud no proporcionado en la URL');
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

    function agregarAGoogleCalendar(titulo, descripcion, lugar, fechaInicio, horaInicio, correoInvitado = '') {
        const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
        const inicio = new Date(`${fechaInicio}T${horaInicio}`);
        const formatoGoogle = (fecha) =>
            fecha.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const googleInicio = formatoGoogle(inicio);
    
        let url = `${baseUrl}&text=${encodeURIComponent(titulo)}&details=${encodeURIComponent(descripcion)}&location=${encodeURIComponent(lugar)}&dates=${googleInicio}/${googleInicio}`;
        
        if (correoInvitado) {
            url += `&add=${encodeURIComponent(correoInvitado)}`;
        }
    
        window.open(url, '_blank');
    }

    try {
        const response = await fetch(`http://localhost:3000/api/solicitudes/${idSolicitud}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la solicitud');

        const result = await response.json();
        const solicitud = result.data[0];

        if (!solicitud) {
            alert('No se encontró la solicitud con ese ID');
            return;
        }

        document.getElementById('nombre_alumno').value = solicitud.alumno;
        document.getElementById('materia').value = solicitud.materia;
        document.getElementById('tema').value = solicitud.tema;
        const fecha = new Date(solicitud.fecha_solicitud);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        document.getElementById('fecha').value = fechaFormateada;

        document.getElementById('hora').value = solicitud.hora;

        document.getElementById('mode').value = solicitud.modalidad;

        document.querySelector('input[name="id_solicitud"]').value = idSolicitud;

        console.log(solicitud);

    } catch (error) {
        console.error('Error al cargar detalles de la asesoría:', error);
        alert('No se pudo cargar la información de la solicitud');
    }

    //Manejo del formulario
    document.getElementById('form_accept').addEventListener('submit', async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:3000/api/solicitudes/${idSolicitud}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la solicitud');

        const result = await response.json();
        const solicitud = result.data[0];

        const idAsesor = await obtenerIdAsesor(idUsuario);

        const fecha = new Date(solicitud.fecha_solicitud);
        const fechaFormateada = fecha.toISOString().split('T')[0];

        const correoAlumno = `al${solicitud.matricula}@ite.edu.mx`;

        const asesoriaData = {
            id_solicitud: solicitud.id_solicitud,
            id_usuario: solicitud.id_alumno,
            id_alumno: solicitud.id_alumno,
            id_asesor: idAsesor,
            id_materia: solicitud.id_materia,
            id_tema: solicitud.id_tema,
            nombre_tema: solicitud.tema,
            fecha_solicitud: fechaFormateada,
            hora: solicitud.hora,
            estado: 'En proceso',
            aula: document.getElementById('aula').value,
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

            agregarAGoogleCalendar(
                `Asesoría de ${solicitud.materia}`,
                `Tema: ${solicitud.tema}`,
                `Aula: ${document.getElementById('aula').value}`,
                fechaFormateada,
                solicitud.hora,
                correoAlumno
            );

            setTimeout(() => {
                window.location.href = 'home_adviser.html';
            }, 500);

        } catch (error) {
            console.error(error);
            alert('Error al aceptar asesoría');
        }
    });
});
