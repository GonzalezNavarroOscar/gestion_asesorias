export async function generarGraficoEstadistica(tipo) {
    try {
        let url = '';
        let labels = [];
        let datasetLabel = 'Estadísticas';
        let backgroundColor = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];
        let borderColor = ['#C70039', '#39C700', '#0033C7', '#C70089'];

        switch(tipo) {
            case 'todos':
                url = 'http://localhost:3000/api/estadisticas-contadores';
                labels = ['Usuarios', 'Asesorías', 'Materias', 'Temas'];
                break;
            case 'usuarios':
                url = 'http://localhost:3000/api/estadisticas-usuarios-activos';
                labels = ['Estudiantes', 'Tutores', 'Administradores'];
                backgroundColor = ['#4BC0C0', '#9966FF', '#FF9F40'];
                borderColor = ['#36A2EB', '#8A2BE2', '#FF7F50'];
                datasetLabel = 'Usuarios Activos';
                break;
            case 'asesorias':
                url = 'http://localhost:3000/api/estadisticas-asesorias-ultimo-mes';
                labels = ['Última semana', 'Últimos 15 días', 'Último mes'];
                backgroundColor = ['#FFCD56', '#4BC0C0', '#FF6384'];
                borderColor = ['#FFA500', '#36A2EB', '#FF0000'];
                datasetLabel = 'Asesorías Recientes';
                break;
            case 'materias':
                url = 'http://localhost:3000/api/estadisticas-asesorias-por-materia';
                backgroundColor = generateRandomColors(10); 
                borderColor = backgroundColor.map(color => shadeColor(color, -20));
                datasetLabel = 'Asesorías por Materia';
                break;
            case 'modalidades':
                url = 'http://localhost:3000/api/estadisticas-modalidades';
                backgroundColor = generateRandomColors(10);
                borderColor = backgroundColor.map(color => shadeColor(color, -20));
                datasetLabel = 'Modalidades más usadas';
                break;
        }
        

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            let dataValues = [];

            if (tipo === 'materias') {
                labels = result.data.map(item => item.materia);
                dataValues = result.data.map(item => item.popularidad);
            } else if (tipo === 'modalidades') {
                labels = result.data.map(item => item.modalidad);
                dataValues = result.data.map(item => item.total);
            } else {
                dataValues = Object.values(result.data);
            }

            const data = {
                labels: labels,
                datasets: [{
                    label: datasetLabel,
                    data: dataValues,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1
                }]
            };

            const config = {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: tipo !== 'materias',
                            position: 'top'
                        }
                    }
                }
            };

            const ctx = document.getElementById('estadisticasGrafico').getContext('2d');
            if (window.chartInstance) {
                window.chartInstance.destroy();
            }

            window.chartInstance = new Chart(ctx, config);
        } else {
            console.error('Error al obtener estadísticas:', result.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Funcion para generar ms colores a las graficas
function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }
    return colors;
}

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3), 16);
    let G = parseInt(color.substring(3,5), 16);
    let B = parseInt(color.substring(5,7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
}