let todasLasSolicitudes = [];

async function cargarSolicitudes() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
        const response = await fetch(`http://localhost:3000/api/solicitudes_alumno/${userData.id_usuario}`);
        const data = await response.json();

        todasLasSolicitudes = data.data;

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
    const contenedor = document.getElementById('requests');
    contenedor.innerHTML = '';

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
            <div class="card">
            <div class="card-content">
                <div class="state">
                    <div class="${solicitud.estado == 'Aceptada' ? 'state_complete' : 'state_no_acepted'}">
                        <h4>${solicitud.estado}</h4>
                    </div>
                </div>  
                <div class="card-text">${solicitud.materia}</div>
                <div class="request_content">
                    <h3>${solicitud.tema}</h3>
                    ${solicitud.asesor != null ? `<h4>Asesor: ${solicitud.asesor}</h4>` : ''}
                    <h4>Modalidad: ${solicitud.modalidad}</h4>
                    <h4>Fecha: ${fechaFormateada}</h4>
                    <h4>Hora: ${solicitud.hora}</h4>
                    <h4>${solicitud.observaciones}</h4>
                </div>
                ${solicitud.estado === 'Aceptada' ? '<button>Ver detalles</button>' : ''}
            </div>
        </div>
        `;

        contenedor.appendChild(solicitudCard);
    });
}

window.onload = cargarSolicitudes;

const opcion_filter = () => {
    const select = filter_request.selectedIndex
    let solicitudes = todasLasSolicitudes;
    switch (select) {
        case 1:
            solicitudes.sort((a, b) => {
                return a.materia.localeCompare(b.materia)
            })
            break
        case 2:
            solicitudes.sort((a, b) => {
                return b.materia.localeCompare(a.materia)
            })
            break
        case 3:
            solicitudes = solicitudes.filter(solicitud => solicitud.modalidad === 'En Linea')
            break
        case 4:
            solicitudes = solicitudes.filter(solicitud => solicitud.Presencial === 'Presencial')
            break
        case 5:
            solicitudes = solicitudes.sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud))
            break
        case 6:
            solicitudes = solicitudes.sort((a, b) => new Date(a.fecha_solicitud) - new Date(b.fecha_solicitud))
            break
        case 7:
            solicitudes = solicitudes.filter(solicitud => solicitud.estado === 'Aceptada')
            break
        case 8:
            solicitudes = solicitudes.filter(solicitud => solicitud.estado === 'Pendiente')
            break
    }
    mostrarSolicitudes(solicitudes)
}

const filter_request = document.getElementById('filter_request')
filter_request.addEventListener('change', opcion_filter)

