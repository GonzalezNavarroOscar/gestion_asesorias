let todasLasSolicitudes = [];

async function cargarSolicitudes() {
    try {
        const response = await fetch('http://localhost:3000/api/solicitudes-pendientes');
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
    const contenedor = document.querySelector('.requests');
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
                <h4>Hora: ${solicitud.hora}</h4>
            </div>
            <div class="request_btn">
                <button class="accept" onclick="location.href='accept_request.html?id_solicitud=${encodeURIComponent(solicitud.id_solicitud)}'">Aceptar</button>
            </div>
        `;

        contenedor.appendChild(solicitudCard);
    });
}

window.cargarSolicitudes = cargarSolicitudes;

const opcion_filter_request = () => {
    const select = filter_request_adviser.selectedIndex
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
            solicitudes.sort((a, b) => {
                return a.tema.localeCompare(b.tema)
            })
            break
        case 4:
            solicitudes.sort((a, b) => {
                return b.tema.localeCompare(a.tema)
            })
            break
        case 5:
            solicitudes.sort((a, b) => {
                return a.alumno.localeCompare(b.alumno)
            })
            break
        case 6:
            solicitudes.sort((a, b) => {
                return b.alumno.localeCompare(a.alumno)
            })
            break
        case 7:
            solicitudes = solicitudes.sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud))
            break
        case 8:
            solicitudes = solicitudes.sort((a, b) => new Date(a.fecha_solicitud) - new Date(b.fecha_solicitud))
            break
    }
    mostrarSolicitudes(solicitudes)
}

const filter_request_adviser = document.getElementById('filter_request')
filter_request_adviser.addEventListener('change', opcion_filter_request)

