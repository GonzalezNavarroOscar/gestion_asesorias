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
    console.log(result);

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