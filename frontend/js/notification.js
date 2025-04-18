(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const notiContent = document.querySelector('.notificacion_content');
    const bellIcon = document.querySelector('.notification-icon');

    if (!userData || !notiContent || !bellIcon) return;

    const checkEmptyNotifications = () => {
        if (document.querySelectorAll('.notificacion').length === 0) {
            notiContent.innerHTML = '<p class="no-notifications">No tienes notificaciones.</p>';
                    bellIcon.style.display = 'none';
        }
    };

    const setupDeleteButtons = () => {
        document.querySelectorAll('.delete_noti_btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation();
                const notificationDiv = e.target.closest('.notificacion');
                const notificationId = notificationDiv.dataset.notificationId;

                try {
                    const response = await fetch(`http://localhost:3000/api/notificaciones/${notificationId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) throw new Error('Error en la respuesta');

                    notificationDiv.classList.add('fade-out');
                    
                    setTimeout(() => {
                        notificationDiv.remove();
                        checkEmptyNotifications();
                        document.dispatchEvent(new CustomEvent('notification-deleted'));
                    }, 300);

                } catch (error) {
                    console.error('Error al eliminar:', error);
                    alert('No se pudo eliminar la notificación');
                }
            });
        });
    };

    const loadNotifications = () => {

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
                        notiDiv.dataset.notificationId = noti.id_notificacion;

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

                    setupDeleteButtons();
                }
            })
            .catch(err => {
                console.error('Error al cargar notificaciones:', err);
                notiContent.innerHTML = `<p>Error al cargar notificaciones: ${err.message}</p>`;
            });
        }
    
        loadNotifications();
    
        setInterval(loadNotifications, 60000);

})();