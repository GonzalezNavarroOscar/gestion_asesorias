function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', async function () {
    const id_materia = getQueryParam('id_materia');

    const idTema = getQueryParam('id_tema');
    const nombreTema = decodeURIComponent(getQueryParam('tema') || '');
    const descripcionTema = decodeURIComponent(getQueryParam('des') || '');

    if (idTema != null) {
        const Title = document.getElementById('title');
        Title.innerHTML = '<h2>Editar Tema</h2>';
        document.getElementById('temaNombre').value = nombreTema;
        document.getElementById('temaDescripcion').value = descripcionTema;
    }
    document.getElementById('temaForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        if (id_materia != null) {
            const nombre = document.getElementById('temaNombre').value;
            const descripcion = document.getElementById('temaDescripcion').value;

            const data = {
                id_materia: id_materia,
                nombre: nombre,
                descripcion: descripcion,
                agregado_admin: true
            };

            try {
                const response = await fetch('http://localhost:3000/api/agregar-temas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    alert("Tema registrado exitosamente.");
                    window.location.href = 'home_admin.html';
                } else {
                    alert("Error: " + result.message);
                }

            } catch (error) {
                console.error(error);
                alert("Error al conectar con el servidor.");
            }
        } else if (idTema != null) {
            const nombre = document.getElementById('temaNombre').value;
            const descripcion = document.getElementById('temaDescripcion').value;

            const data = {
                id_tema: idTema,
                nombre: nombre,
                descripcion: descripcion,
            };

            try {
                const response = await fetch('http://localhost:3000/api/editar-tema', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    alert("Tema registrado exitosamente.");
                    window.location.href = 'home_admin.html';
                } else {
                    alert("Error: " + result.message);
                }

            } catch (error) {
                console.error(error);
                alert("Error al conectar con el servidor.");
            }
        }
    });
})

