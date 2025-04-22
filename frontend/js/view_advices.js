let AsesoriasEnProceso = [];

async function cargarAsesorias() {
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

function mostrarAsesorias(asesorias) {
    const contenedor = document.querySelector('.advices');
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
                <div class="state_complete"}">
                    <h4>${asesoria.estado}</h4>
                </div>
                <h3>${asesoria.alumno}</h3>
                <h4>Materia: ${asesoria.materia}</h4>
                <h4>Tema: ${asesoria.tema}</h4>
                <h4>Fecha: ${fechaFormateada}</h4>
                <h4>Hora: ${asesoria.hora}</h4>
                <h4>Modalidad: ${asesoria.modalidad}</h4>
            </div>
            <div class="request_btn">
                <button class="accept" onClick="location.href='generate_report.html?id_asesoria=${encodeURIComponent(asesoria.id_asesoria)}'">Generar Reporte</button>
            </div>
        `;

        contenedor.appendChild(asesoriaCard);
    });
}

window.cargarAsesorias = cargarAsesorias;

const opcion_filter_advices = () => {
    const select = filter_advices_adviser.selectedIndex
    let solicitudes = AsesoriasEnProceso;
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
            solicitudes = solicitudes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            break
        case 8:
            solicitudes = solicitudes.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            break
    }
    mostrarAsesorias(solicitudes)
}

const filter_advices_adviser = document.getElementById('filter_advices')
filter_advices_adviser.addEventListener('change', opcion_filter_advices)
