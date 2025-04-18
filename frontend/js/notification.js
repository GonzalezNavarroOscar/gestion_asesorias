(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log('userData:', userData);
    const notiContent = document.querySelector('.notificacion_content');
    const bellIcon = document.querySelector('.notification-icon');

    if (!userData || !notiContent || !bellIcon) return;

    console.log('userData:', userData);

    fetch(`http://localhost:3000/api/notificaciones/${userData.id_usuario}`)
        .then(res => res.json())
        .then(data => {
            notiContent.innerHTML = '';
            if (data.length === 0) {
                notiContent.innerHTML = '<p>No tienes notificaciones.</p>';
                bellIcon.style.display = 'none';
            } else {

                data.forEach(noti => {
                    const notiDiv = document.createElement('div');
                    notiDiv.className = 'notificacion';

                    const fecha = new Date(noti.fecha_envio).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    notiDiv.innerHTML = `
                        <img src="../images/Campana_Notificacion.png" class="noti-icon">
                        <div class="noti-info">
                            <a class="noti-mensaje">${noti.mensaje}</a>
                            <p class="noti-fecha">${fecha}</p>
                        </div>
                        <button class="delete_noti_btn">
                            <img src="../images/trash_icon.png" alt="Eliminar">
                        </button>
                    `;

                    notiContent.appendChild(notiDiv);
                });
            }
        })
        .catch(err => {
            console.error('Error al cargar notificaciones:', err);
            notiContent.innerHTML = `<p>Error al cargar notificaciones: ${err.message}</p>`;
        });
})();