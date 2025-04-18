form = document.getElementById('schedule_form')

form.addEventListener('submit', function (event) {
    event.preventDefault()
    const formData = new FormData(this);

    console.log('Datos del formulario:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
})