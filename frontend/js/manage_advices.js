let AsesoriasEnProceso = [];

const setupDeleteButtons = () => {
    document.querySelectorAll('.decline').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation();

            const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta asesoría?. Este cambio es irreversible');

            if (!confirmacion) return;

            const asesoriaDiv = e.target.closest('.advice');
            const idAsesoria = e.target.dataset.asesoriaId;

            try {
                const response = await fetch(`http://localhost:3000/api/eliminar-asesorias/${idAsesoria}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error en la respuesta');

                asesoriaDiv.classList.add('fade-out');

                setTimeout(() => {
                    asesoriaDiv.remove();
                    if (document.querySelectorAll('.advice').length === 0) {
                        document.querySelector('.advices-container').innerHTML = '<p>No hay asesorías en proceso.</p>';
                    }
                    document.dispatchEvent(new CustomEvent('asesoria-eliminada'));
                }, 300);

            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('No se pudo eliminar la asesoría');
            }

            e.preventDefault();
        });
    });
};

export async function cargarAsesorias() {
    try {
        const response = await fetch('http://localhost:3000/api/asesorias-proceso');
        const data = await response.json();

        AsesoriasEnProceso = data.data;

        if (data.success) {
            mostrarAsesorias(data.data);
        } else {
            console.error('Error al cargar asesorías:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export function mostrarAsesorias(asesorias) {
    const contenedor = document.querySelector('.advices-container');
    contenedor.innerHTML = '';

    asesorias.forEach(asesoria => {
        const fecha = new Date(asesoria.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const asesoriaCard = document.createElement('div');
        asesoriaCard.className = 'advice';

        asesoriaCard.innerHTML = `
            <div class="advice_content">
                <div class="state_complete">
                    <h4>${asesoria.estado}</h4>
                </div>
                <h3>${asesoria.alumno}</h3>
                <h4>Materia: ${asesoria.materia}</h4>
                <h4>Tema: ${asesoria.tema}</h4>
                <h4>Fecha: ${fechaFormateada}</h4>
                <h4>Hora: ${asesoria.hora}</h4>
                <h4>Modalidad: ${asesoria.modalidad}</h4>
            </div>
            <div class="modify_buttons">
                <div class="request_btn">
                    <button class="accept" onClick="location.href='modify_advice.html?id_asesoria=${encodeURIComponent(asesoria.id_asesoria)}'">Modificar</button>
                </div>
                <div class="request_btn">
                    <button class="decline" data-asesoria-id="${asesoria.id_asesoria}">Eliminar</button>
                </div>
            </div>
        `;

        contenedor.appendChild(asesoriaCard);
    });

    setupDeleteButtons();
}
