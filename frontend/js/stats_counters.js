document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('http://localhost:3000/api/estadisticas-contadores');
        const result = await response.json();

        if (result.success) {
            document.getElementById('user-count').textContent = result.data.usuarios;
            document.getElementById('asesorias-count').textContent = result.data.asesorias;
            document.getElementById('materias-count').textContent = result.data.materias;
            document.getElementById('temas-count').textContent = result.data.temas;
        } else {
            console.error('Error al obtener contadores:', result.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
});