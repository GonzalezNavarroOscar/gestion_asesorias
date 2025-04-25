document.getElementById('materiaForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log("Formulario enviado y preventDefault ejecutado");

    const formData = new FormData();
    formData.append('nombre', document.getElementById('materiaNombre').value);
    formData.append('descripcion', document.getElementById('materiaDescripcion').value);
    formData.append('imagen', document.getElementById('materiaImagen').files[0]);

    try {
        const response = await fetch('http://localhost:3000/api/agregar-materias', {
            method: 'POST',
            body: formData
        });
    
        const result = await response.json();
        console.log(result);
    
        if (result.success) {
            alert("Materia registrada exitosamente.");
            window.location.href = '/pages/home_admin.html';
        } else {
            alert("Error: " + result.message);
        }
    
    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor.");
    }
});