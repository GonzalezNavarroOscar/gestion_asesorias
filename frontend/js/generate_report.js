document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idAsesoria = urlParams.get('id_asesoria');

    if (!idAsesoria) {
        alert('No se proporcionó ID de asesoría');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/reportes/${idAsesoria}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la asesoría');

        const result = await response.json();
        const asesoria = result.data[0];

        if (!asesoria) {
            alert('No se encontró la asesoría con ese ID');
            return;
        }

        // Llenar los campos del formulario
        document.getElementById('id_asesoria').value = asesoria.id_asesoria;
        document.getElementById('nombre_alumno').value = `${asesoria.alumno}`;
        document.getElementById('nombre_asesor').value = `${asesoria.asesor}`;
        document.getElementById('materia').value = `${asesoria.materia}`;
        document.getElementById('tema').value = `${asesoria.tema}`;

        const fecha = new Date(asesoria.fecha);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        
        document.getElementById('fecha').value = fechaFormateada;

        document.getElementById('hora_inicial').value = asesoria.hora;
        document.getElementById('hora_final').value = asesoria.hora;
        document.getElementById('total_horas').value = 1;
        document.getElementById('porcentaje').value = 0; 
        const porcentajeInput = document.getElementById('porcentaje');
        const mensaje = document.getElementById('mensaje_porcentaje');

        porcentajeInput.addEventListener('input', () => {
            let valor = porcentajeInput.value;
        
            if (valor === '') {
                mensaje.textContent = '';
                return;
            }
        
            valor = parseInt(valor);
        
            if (isNaN(valor)) {
                mensaje.textContent = 'Por favor, introduce un número válido.';
                porcentajeInput.value = '';
            } else if (valor > 100) {
                porcentajeInput.value = 100;
                mensaje.textContent = 'Máximo permitido: 100.';
            } else if (valor < 0) {
                porcentajeInput.value = 0;
                mensaje.textContent = 'Mínimo permitido: 0.';
            } else {
                mensaje.textContent = '';
            }
        });

        const horaFinalInput = document.getElementById('hora_final');
        horaFinalInput.addEventListener('input', () => {
            calcularTotalHoras(asesoria.hora, horaFinalInput.value);
        });

        document.getElementById('form-reporte').addEventListener('submit', async function (e) {
            e.preventDefault();

            const confirmar = confirm("¿Deseas descargar el reporte en PDF?");

            if (confirmar) {
                generarPDF(asesoria);
            }

            const porcentaje = document.getElementById('porcentaje').value;
            const estado = document.getElementById('estado_asesoria').value;

            const datos = {
                id_asesoria: asesoria.id_asesoria,
                nombre: document.getElementById('nombre_reporte').value || 'Reporte_asesoria',
                descripcion: document.getElementById('descripcion').value || '',
                fecha: document.getElementById('fecha').value,
                hora_inicial: document.getElementById('hora_inicial').value,
                hora_final: document.getElementById('hora_final').value,
                total_horas: document.getElementById('total_horas').value,
                porcentaje: porcentaje,
                estado_asesoria: estado,
                id_asesor: asesoria.id_asesor,
                id_alumno: asesoria.id_alumno,
                id_materia: asesoria.id_materia,
                id_tema: asesoria.id_tema,
                id_usuario: asesoria.id_alumno,
                nombre_tema: asesoria.tema
            };

            try {
                const response = await fetch('http://localhost:3000/api/generar-reporte', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });
    
                if (!response.ok) throw new Error('Error al crear solicitud');
    
                alert('¡Reporte realizado con éxito!');
                window.location.href = 'home_adviser.html';
            } catch (error) {
                console.error(error);
                alert('Error al realizar reporte');
            }
        });

    } catch (error) {
        console.error('Error al cargar detalles de la asesoría:', error);
        alert('No se pudo cargar la información de la asesoría');
    }
});

function calcularTotalHoras(horaInicial, horaFinal) {
    if (!horaInicial || !horaFinal) return;

    const [hiHoras, hiMinutos] = horaInicial.split(':').map(Number);
    const [hfHoras, hfMinutos] = horaFinal.split(':').map(Number);

    if (isNaN(hiHoras) || isNaN(hfHoras)) return;

    const fechaInicio = new Date(0, 0, 0, hiHoras, hiMinutos);
    const fechaFin = new Date(0, 0, 0, hfHoras, hfMinutos);

    let diferenciaMs = fechaFin - fechaInicio;

    if (diferenciaMs < 0) {
        fechaFin.setDate(fechaFin.getDate() + 1);
        diferenciaMs = fechaFin - fechaInicio;
    }

    const totalHoras = diferenciaMs / 1000 / 60 / 60;
    document.getElementById('total_horas').value = totalHoras.toFixed(2);
}

function generarPDF(asesoria) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 40;
    
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };
    
    const generatePDF = (img = null) => {
        doc.setFont('helvetica');
        doc.setTextColor(0);
        
        // --- ENCABEZADO ---
        if (img) {
            doc.addImage(img, 'PNG', margin, 10, 40, 20);
            doc.setFontSize(18);
            doc.text('REPORTE DE ASESORÍA', pageWidth / 2, 25, { align: 'center' });
        } else {
            doc.setFontSize(20);
            doc.setTextColor(40, 53, 147);
            doc.text('REPORTE DE ASESORÍA ACADÉMICA', pageWidth / 2, 25, { align: 'center' });
        }
        
        // Línea divisoria
        doc.setDrawColor(40, 53, 147);
        doc.setLineWidth(0.5);
        doc.line(margin, y - 5, pageWidth - margin, y - 5);
        
        // --- DATOS DE LA ASESORÍA ---
        const fecha = new Date(asesoria.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-ES');
        
        doc.setFontSize(12);
        
        // Columna Izquierda
        doc.setFont('helvetica', 'bold');
        doc.text('Información General', margin, y);
        doc.setFont('helvetica', 'normal');
        
        const col1Data = [
            `Alumno: ${asesoria.alumno}`,
            `Asesor: ${asesoria.asesor}`,
            `Materia: ${asesoria.materia}`,
            `Tema: ${asesoria.tema}`
        ];
        
        col1Data.forEach(line => {
            doc.text(line, margin, y += 7);
        });
        
        // Columna Derecha
        y = 40;
        const col2X = pageWidth / 2 + 10;
        
        const col2Data = [
            `Fecha: ${fechaFormateada}`,
            `Hora Inicio: ${document.getElementById('hora_inicial').value}`,
            `Hora Fin: ${document.getElementById('hora_final').value}`,
            `Duración: ${document.getElementById('total_horas').value} hrs`,
            `Estado: ${document.getElementById('estado_asesoria').value}`,
            `Avance: ${document.getElementById('porcentaje').value}%`
        ];
        
        col2Data.forEach(line => {
            doc.text(line, col2X, y += 7);
        });
        
        y += 15;
        
        // --- DESCRIPCIÓN ---
        doc.setFont('helvetica', 'bold');
        doc.text('Descripción:', margin, y);
        doc.setFont('helvetica', 'normal');
        
        const descripcion = document.getElementById('descripcion').value || 'No se proporcionó descripción';
        const splitText = doc.splitTextToSize(descripcion, pageWidth - 2 * margin);
        doc.text(splitText, margin, y += 7);
        y += splitText.length * 7 + 10;
        
        // --- FIRMAS ---
        doc.setFontSize(10);
        doc.text('________________________', margin, y);
        doc.text('Firma del Asesor', margin, y + 5);
        
        // --- PIE DE PÁGINA ---
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('© Sistema de Asesorías Académicas - ' + new Date().getFullYear(), 
                pageWidth / 2, 285, { align: 'center' });
        
        const nombreReporte = document.getElementById('nombre_reporte').value || 'Reporte_Asesoria';
        doc.save(`${nombreReporte.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    };
    
    loadImage('../images/LOGO.png')
        .then(img => {
            generatePDF(img);
        })
        .catch(err => {
            console.warn('No se pudo cargar el logo, generando PDF sin él', err);
            generatePDF();
        });
}