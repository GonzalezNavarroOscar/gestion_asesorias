const form = document.getElementById('Form');
const errorDiv = document.getElementById('error')

async function enviarDatos(email) {
    try {
        const response = await fetch('http://localhost:3000/api/forgot_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            errorDiv.classList.remove('no_mostrar')
            errorDiv.classList.add('ok')
            errorDiv.innerHTML = data.message

            setTimeout(() => {
                window.location.href = '../index.html'
            }, 5000);
        }

    } catch (error) {

        let mensaje = ''

        if (error.message == 'Failed to fetch') {
            mensaje = 'No se pudo establecer conexion con el servidor.'
        } else {
            mensaje = error.message;
        }

        errorDiv.classList.remove('no_mostrar')
        errorDiv.classList.add('error')
        errorDiv.innerHTML = mensaje
        setTimeout(() => {
            errorDiv.classList.remove('error')
            errorDiv.classList.add('no_mostrar')
        }, 9000);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = document.getElementById('correo')

    enviarDatos(email.value)
});
