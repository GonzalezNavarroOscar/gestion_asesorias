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

    setTimeout(() => {
        const roleMappings = {
            'administrador': '/frontend/pages/home_admin.html',
            'asesor': '/frontend/pages/home_adviser.html',
            'alumno': '/frontend/pages/home_student.html'
        };

        const targetPage = roleMappings[rol.toLowerCase()] || '/frontend/index.html';
        window.location.href = targetPage;
    }, 1000);
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

        if (data.multipleRoles) {
            const selectedRol = await promptUserRole(data.roles.map(r => r.rol));
            if (!selectedRol) {
                showError('Debes seleccionar un rol para continuar');
                return;
            }
        
            const user = data.roles.find(r => r.rol === selectedRol);
            if (!user) {
                showError('Rol seleccionado no válido');
                return;
            }

            localStorage.setItem('authToken', data.token);
        
            localStorage.setItem('userData', JSON.stringify(data.user));

            redirectByRole(selectedRol);
        
            return;
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

function promptUserRole(roles) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        `;
        box.innerHTML = `<h3>Selecciona tu cuenta</h3>`;

        roles.forEach(role => {
            const btn = document.createElement('button');
            btn.textContent = role.charAt(0).toUpperCase() + role.slice(1);
            btn.style.cssText = 'margin: 10px; padding: 10px 20px;';
            btn.onclick = () => {
                document.body.removeChild(modal);
                resolve(role);
            };
            box.appendChild(btn);
        });

        modal.appendChild(box);
        document.body.appendChild(modal);
    });
}