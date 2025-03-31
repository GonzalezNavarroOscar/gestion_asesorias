const api_url = 'http://localhost:3000/api/login';

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password')

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = emailInput.value;

    const password = passwordInput.value;

    const datosParaEnviar = { email,password };

    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaEnviar)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta de la API:", data);
        if (data.message === "Login exitoso") {
            alert("Bienvenido " + data.usuario.correo);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
