document.addEventListener('DOMContentLoaded', function() {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData.id_usuario;
    
    fetch(`http://localhost:3000/api/perfil/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
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

    const passwordModal = document.getElementById('password-modal');
    const changePasswordModal = document.getElementById('change-password-modal');
    const changePasswordBtn = document.querySelector('.btn-outline');
    const verifyPasswordBtn = document.getElementById('verify-password-btn');
    const submitNewPasswordBtn = document.getElementById('submit-new-password');
    const closeButtons = document.querySelectorAll('.close');

    changePasswordBtn.addEventListener('click', function() {
        passwordModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            passwordModal.style.display = 'none';
            changePasswordModal.style.display = 'none';
        });
    });

    verifyPasswordBtn.addEventListener('click', async function() {
        const currentPassword = document.getElementById('current-password').value;
        
        try {
            const response = await fetch(`http://localhost:3000/api/verify-password/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify({
                    currentPassword: currentPassword
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                passwordModal.style.display = 'none';
                changePasswordModal.style.display = 'block';
            } else {
                alert(data.message || 'Contraseña incorrecta');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al verificar contraseña');
        }
    });

    submitNewPasswordBtn.addEventListener('click', async function() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/api/change-password/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify({
                    newPassword: newPassword
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Contraseña cambiada exitosamente');
                changePasswordModal.style.display = 'none';
                // Limpiar campos
                document.getElementById('current-password').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('confirm-password').value = '';
            } else {
                alert(data.message || 'Error al cambiar contraseña');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cambiar contraseña');
        }
    });
});