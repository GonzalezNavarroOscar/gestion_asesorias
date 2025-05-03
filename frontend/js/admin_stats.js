const chartInstances = {};

async function generarGraficoEstadistica(tipo) {
    let url = '';
    let data, labels, config;

    try {
        switch (tipo) {
            case 'contadores':
                url = 'http://localhost:3000/api/estadisticas-contadores';
                const res1 = await fetch(url);
                const json1 = await res1.json();

                labels = ['Usuarios', 'Asesorías', 'Materias', 'Temas'];
                data = [json1.data.usuarios, json1.data.asesorias, json1.data.materias, json1.data.temas];

                config = crearConfigBarra('Totales Generales', labels, data);
                break;

            case 'usuarios-activos':
                url = 'http://localhost:3000/api/estadisticas-usuarios-activos';
                const res2 = await fetch(url);
                const json2 = await res2.json();

                labels = ['Alumnos', 'Asesores', 'Administradores'];
                data = [json2.data.alumnos, json2.data.asesores, json2.data.administradores];

                config = crearConfigPastel('Usuarios Activos', labels, data);
                break;

            case 'asesorias-mes':
                url = 'http://localhost:3000/api/estadisticas-asesorias-ultimo-mes';
                const res3 = await fetch(url);
                const json3 = await res3.json();

                labels = ['Último Mes'];
                data = [json3.data.asesoriasUltimoMes];

                config = crearConfigBarra('Asesorías Recientes', labels, data);
                break;

            case 'asesorias-materia':
                url = 'http://localhost:3000/api/estadisticas-asesorias-por-materia';
                const res4 = await fetch(url);
                const json4 = await res4.json();

                labels = json4.data.map(item => item.materia);
                data = json4.data.map(item => item.total_asesorias);

                config = crearConfigBarra('Asesorías por Materia', labels, data);
                break;

            default:
                return;
        }

        const ctx = document.getElementById('estadisticasGrafico').getContext('2d');

        if (chartInstances[tipo]) {
            chartInstances[tipo].destroy();
        }

        chartInstances[tipo] = new Chart(ctx, config);

    } catch (err) {
        console.error('Error cargando gráfico:', err);
    }
}

function crearConfigBarra(label, labels, data) {
    return {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: '#4e73df',
                borderColor: '#2e59d9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
}

function crearConfigPastel(label, labels, data) {
    return {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: ['#1cc88a', '#36b9cc', '#f6c23e'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById('tipo-estadistica');
    generarGraficoEstadistica(select.value);
    select.addEventListener('change', () => generarGraficoEstadistica(select.value));
});
