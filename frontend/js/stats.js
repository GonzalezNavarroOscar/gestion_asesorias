// Función para obtener y mostrar estadísticas dinámicamente
export async function generarGraficoEstadistica(tipo) {
    try {
        let url = '';  // La URL será determinada dependiendo del tipo

        // Determinar qué ruta usar según el tipo de estadística
        if (tipo === 'todos') {
            url = 'http://localhost:3000/api/estadisticas-contadores';  // Total de usuarios, asesorías, materias y temas
        } else if (tipo === 'usuarios') {
            url = 'http://localhost:3000/api/estadisticas-usuarios-activos';  // Usuarios activos por rol
        } else if (tipo === 'asesorias') {
            url = 'http://localhost:3000/api/estadisticas-asesorias-ultimo-mes';  // Asesorías en el último mes
        } else if (tipo === 'materias') {
            url = 'http://localhost:3000/api/estadisticas-asesorias-por-materia';  // Asesorías por materia
        }

        // Realizar la solicitud a la API de estadísticas
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            // Datos para el gráfico
            const data = {
                labels: ['Usuarios', 'Asesorías', 'Materias', 'Temas'],
                datasets: [{
                    label: 'Estadísticas',
                    data: [
                        tipo === 'todos' || tipo === 'usuarios' ? result.data.usuarios : 0,
                        tipo === 'todos' || tipo === 'asesorias' ? result.data.asesorias : 0,
                        tipo === 'todos' || tipo === 'materias' ? result.data.materias : 0,
                        tipo === 'todos' || tipo === 'temas' ? result.data.temas : 0
                    ],
                    backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
                    borderColor: ['#C70039', '#39C700', '#0033C7', '#C70089'],
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
                    }
                }
            };

            // Crear el gráfico si no existe, o actualizarlo si ya existe
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

