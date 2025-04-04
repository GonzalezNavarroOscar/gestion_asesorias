const api_url = 'http://localhost:3000/api/login';

const form = document.getElementById('register_form')
const name = document.getElementById('name')
const matricula = document.getElementById('matricula')
const email = document.getElementById('email')
const password = document.getElementById('password')
const confirm_password = document.getElementById('confirm-password')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const error = document.getElementById('error')

    if (password.value === confirm_password.value) {

        const name = name.value
        const matricula = matricula.value
        const email = email.value
        const password = password.value

        const datosParaEnviar = { name, matricula, email, password }

        fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosParaEnviar)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error("Error:", error);
            });
    } else {
        //Si no, se muestra un mensaje de error
        error.classList.add('visible');
        //El mensaje se quita despues de 5 segundos
        setTimeout(() => {
            error.classList.remove('visible');
        }, 5000);
    }
})