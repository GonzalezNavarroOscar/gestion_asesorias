document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idAsesoria = urlParams.get('id_asesoria');

    let asesoria = null;
    try {
        const response = await fetch(`http://localhost:3000/api/detalles-asesoria/${idAsesoria}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la solicitud');

        const result = await response.json();
        asesoria = result.data[0];

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

    // Manejo del formulario
    document.getElementById('form_accept').addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!asesoria) {
            alert('Los datos de la asesoría no están disponibles');
            return;
        }

        const fecha = new Date(document.getElementById('fecha').value);
        const fechaFormateada = fecha.toISOString().split('T')[0];

        const asesoriaData = {
            id_asesoria: idAsesoria,
            id_alumno: asesoria.id_alumno,
            id_asesor: asesoria.id_asesor,
            id_materia: asesoria.id_materia,
            id_tema: asesoria.id_tema,
            nombre_tema: asesoria.tema,
            fecha: fechaFormateada,
            hora: document.getElementById('hora').value,
            aula: document.getElementById('aula').value,
            modalidad: document.getElementById('mode').value
        };

        try {
            const response = await fetch(`http://localhost:3000/api/modificar-asesoria/${idAsesoria}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(asesoriaData)
            });

            if (!response.ok) throw new Error('Error al modificar la asesoría');

            alert('¡Asesoría modificada con éxito!');

            setTimeout(() => {
                window.location.href = 'home_admin.html';
            }, 500);

        } catch (error) {
            console.error(error);
            alert('Error al modificar asesoría');
        }
    });
});