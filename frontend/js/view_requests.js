let todasLasSolicitudes = []
document.addEventListener('DOMContentLoaded', function () {
    cargarSolicitudes();
});

async function cargarSolicitudes() {
    try {
        const response = await fetch('http://localhost:3000/api/solicitudes-pendientes');

        const data = await response.json();

        todasLasSolicitudes = data.data

        if (data.success) {
            mostrarSolicitudes(data.data);
        } else {
            console.error('Error al cargar solicitudes:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarSolicitudes(solicitudes) {
    const contenedor = document.querySelector('.requests');

    contenedor.innerHTML = ''

    solicitudes.forEach(solicitud => {
        const fecha = new Date(solicitud.fecha_solicitud);
        const fechaFormateada = fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const solicitudCard = document.createElement('div');
        solicitudCard.className = 'request';
    
        solicitudCard.innerHTML = `
            <div class="request_img">
                <img src="../${solicitud.imagen}">
            </div>
            <div class="request_content">
                <div class="${solicitud.estado === 'Aceptado' ? 'state_complete' : 'state_no_acepted'}">
                    <h4>${solicitud.estado}</h4>
                </div>
                <h3>${solicitud.alumno}</h3>
                <h4>Materia: ${solicitud.materia}</h4>
                <h4>Tema: ${solicitud.tema}</h4>
                <h4>Fecha: ${fechaFormateada}</h4>
            </div>
            <div class="request_btn">
                ${solicitud.estado === 'Aceptado' 
                    ? `<button class="complete">Completar</button>` 
                    : `<button class="accept">Aceptar</button>`
                }
            </div>
        `;
    
        contenedor.appendChild(solicitudCard);
    });
    
}