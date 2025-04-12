(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const bellIcon = document.querySelector('.notifications.default-icon');
    const bellIconNotification = document.querySelector('.notifications.notification-icon');

    if (!userData || !bellIcon || !bellIconNotification) return;

    fetch(`http://localhost:3000/api/notificaciones/${userData.id_usuario}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                bellIcon.style.display = 'none';
                bellIconNotification.style.display = 'block';
            } else {
                bellIcon.style.display = 'block';
                bellIconNotification.style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Error al cargar las notificaciones:', err);
        });
})();