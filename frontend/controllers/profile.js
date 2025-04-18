document.addEventListener('DOMContentLoaded', function() {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData.id_usuario;
    
    fetch(`http://localhost:3000/api/perfil/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('profile-name').textContent = data.data.nombre;
            document.getElementById('profile-role').textContent = data.data.rol.toUpperCase();
            document.getElementById('profile-email').textContent = data.data.correo;
        } else {
            console.error('Error al cargar el perfil:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

});