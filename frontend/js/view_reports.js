let reportes = [];

const userData = JSON.parse(localStorage.getItem('userData'));
const id_usuario = userData?.id_usuario;

async function cargarReportes() {
    try {
        console.log("ID del usuario:", id_usuario);
        const response = await fetch(`http://localhost:3000/api/ver-reportes/${id_usuario}`);
        const data = await response.json();

        reportes = data.data;

        if (data.success) {
            mostrarReportes(data.data);
        } else {
            console.error('Error al cargar reportes:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const setupDeleteButtons = () => {
    document.querySelectorAll('.delete_rep_btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation();

            const reporteDiv = e.target.closest('.carta');
            const idReporte = reporteDiv.dataset.idReporte;

            try {
                const response = await fetch(`http://localhost:3000/api/eliminar-reportes/${idReporte}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error en la respuesta del servidor');

                reporteDiv.classList.add('fade-out');

                setTimeout(() => {
                    reporteDiv.remove();
                    document.dispatchEvent(new CustomEvent('reporte-eliminado'));
                }, 300);

            } catch (error) {
                console.error('Error al eliminar reporte:', error);
                alert('No se pudo eliminar el reporte');
            }
        });
    });
};

function mostrarReportes(reportes) {
    console.log("Datos recibidos para mostrar:", reportes);
    const contenedor = document.querySelector('.contenedor-cartas');
    contenedor.innerHTML = '';

    reportes.forEach(reporte => {
        const fecha = new Date(reporte.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const ReporteCard = document.createElement('div');
        ReporteCard.className = 'carta';

        ReporteCard.setAttribute('data-id-reporte', reporte.id_reporte);

        ReporteCard.innerHTML = `
            <h3>${reporte.nombre}</h3>
            <p><strong>Descripción:</strong> ${reporte.descripción}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
            <p><strong>Avance:</strong> ${reporte.porcentaje}%</p>
            <p><strong>Estado:</strong> <span class="estado">${reporte.estado_asesoria}</span></p>
            <button class="delete_rep_btn">
                    <img src="../images/trash_icon.png" alt="Eliminar">
            </button>
        `;

        contenedor.appendChild(ReporteCard);
    });
    setupDeleteButtons();
}

window.addEventListener('DOMContentLoaded', cargarReportes);
