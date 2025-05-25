document.addEventListener('DOMContentLoaded', () => {
    const switchBox = document.getElementById('switch_box');
    const formStudent = document.getElementById('register_form_student');
    const formAsesor = document.getElementById('register_form_asesor');

    const url = 'http://localhost:3000/api/registro';

    switchBox.addEventListener('change', () => {
        if (switchBox.checked) {
            formStudent.classList.remove('fade-in');
            formStudent.classList.add('fade-out');
            setTimeout(() => {
                formStudent.style.display = 'none';
                formAsesor.style.display = 'block';
                formAsesor.classList.remove('fade-out');
                formAsesor.classList.add('fade-in');
            }, 400);
        } else {
            formAsesor.classList.remove('fade-in');
            formAsesor.classList.add('fade-out');
            setTimeout(() => {
                formAsesor.style.display = 'none';
                formStudent.style.display = 'block';
                formStudent.classList.remove('fade-out');
                formStudent.classList.add('fade-in');
            }, 400);
        }
    });

    // Animación de entrada al cargar el formulario visible
    if (formStudent.style.display !== 'none') {
        formStudent.classList.add('slide-fade-in');
    } else {
        formAsesor.classList.add('slide-fade-in');
    }

    // Registro de estudiante
    formStudent.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('name').value;
        const matricula = document.getElementById('matricula').value;
        const correo = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            return alert('Las contraseñas no coinciden');
        }

        const body = { nombre, matricula, correo, contraseña: password, rol: 'alumno' };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (!response.ok) {
            document.getElementById('error').innerText = data.message;
            document.getElementById('error').style.display = 'block';
            return;
        }
        alert(data.message);
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    });

    // Registro de asesor
    formAsesor.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('name_asesor').value;
        const correo = document.getElementById('email_asesor').value;
        const password = document.getElementById('password_asesor').value;
        const confirmPassword = document.getElementById('confirm-password_asesor').value;

        if (password !== confirmPassword) {
            return alert('Las contraseñas no coinciden');
        }

        const body = { nombre, correo, contraseña: password, rol: 'asesor' };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        alert(data.message);
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    });
});
