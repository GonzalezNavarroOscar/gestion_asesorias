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
            </div>
            <div class="request_btn">
                <button class="accept" onClick="location.href='generate_report.html?id_asesoria=${encodeURIComponent(asesoria.id_asesoria)}'">Generar Reporte</button>
            </div>
        `;

        contenedor.appendChild(asesoriaCard);
    });
}

window.cargarAsesorias = cargarAsesorias;
