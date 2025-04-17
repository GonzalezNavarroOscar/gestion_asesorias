document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nombreMateria = urlParams.get('materia');
    const nombreTema = urlParams.get('tema');

    if (nombreMateria && nombreTema) {
        const nombreDecodificadoMateria = decodeURIComponent(nombreMateria);
        const nombreDecodificadoTema = decodeURIComponent(nombreTema)

        document.getElementById('subject').value = nombreDecodificadoMateria
        document.getElementById('topic').value = nombreDecodificadoTema

    }
})

document.getElementById("date").min = new Date().toISOString().split("T")[0];