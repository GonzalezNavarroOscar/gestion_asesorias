document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLogin(e);
        });
    }
});

function showLoading(show) {
    const submitButton = document.querySelector('#loginForm button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = show;
        submitButton.innerHTML = show ? 
            'Procesando...' : 
            'Iniciar sesión';
    }
}

function showError(message) {
    const errorElement = document.getElementById('loginError') || createErrorElement();
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Crear elemento de error si no existe
function createErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.id = 'loginError';
    errorElement.style.cssText = `
        color: red;
        margin: 10px 0;
        padding: 10px;
        background: #ffeeee;
        border-radius: 5px;
        display: none;
    `;
    document.querySelector('#loginForm').prepend(errorElement);
    return errorElement;
}

// Redirección por rol
function redirectByRole(rol) {
    const roleMappings = {
        'administrador': '/frontend/home_admin.html',
        'asesor': '/frontend/home_adviser.html',
        'alumno': '/frontend/home_student.html'
    };
    
    const targetPage = roleMappings[rol.toLowerCase()] || '/frontend/index.html';
    console.log('Redirigiendo a:', targetPage);
    window.location.href = targetPage;
}
// Función principal de login
async function handleLogin(e) {
    showLoading(true);
    showError('');
    
    const correo = document.getElementById('correo').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();
    
    if (!correo || !contraseña) {
        showError('Por favor complete todos los campos');
        showLoading(false);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contraseña }),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Error en autenticación');
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        redirectByRole(data.user.rol);

    } catch (error) {
        console.error('Error en login:', error);
        showError(error.message || 'Error al conectar con el servidor');
    } finally {
        showLoading(false);
    }
}