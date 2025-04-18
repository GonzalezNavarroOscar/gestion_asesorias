document.addEventListener('DOMContentLoaded', function () {
    const popupConfig = [
        {
            btnId: 'messages_btn',
            popupClass: 'messages_popup',
            contentClass: 'messages_content',
            defaultIconClass: 'default-icon',
            notificationIconClass: 'notification-icon',
        },
        {
            btnId: 'bell-btn',
            popupClass: 'notificacion_popup',
            contentClass: 'notificacion_content',
            defaultIconClass: 'default-icon',
            notificationIconClass: 'notification-icon',
        },
        {
            btnId: 'settings_btn',
            popupClass: 'settings_popup',
            contentClass: 'settings_content',
            defaultIconClass: 'default-icon',
            notificationIconClass: 'notification-icon',
        }
    ];

    const allPopups = [];

    popupConfig.forEach(config => {
        const btn = document.getElementById(config.btnId);
        const popup = btn.parentElement.querySelector(`.${config.popupClass}`);
        const defaultIcon = btn.querySelector(`.${config.defaultIconClass}`);
        const notificationIcon = btn.querySelector(`.${config.notificationIconClass}`);

        allPopups.push({
            popup,
            btn,
            isVisible: false,
            togglePopup: function () {
                if (this.isVisible) {
                    this.popup.style.display = 'none';
                    this.isVisible = false;
                } else {
                    allPopups.forEach(p => {
                        p.popup.style.display = 'none';
                        p.isVisible = false;
                    });
                    this.popup.style.display = 'flex';
                    this.isVisible = true;
                }
            }
        });

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const popupObj = allPopups.find(p => p.btn === btn);
            popupObj.togglePopup();
        });

        popup.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    async function hasNotifications() {
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!userData?.id_usuario) {
            console.warn('ID de usuario no encontrado');
            return false;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/notificaciones/unread-count/${userData.id_usuario}`);
            const data = await response.json();

            return data.count > 0;
        } catch (error) {
            console.error('Error al verificar notificaciones:', error);
            return false;
        }
    }

    const updateNotificationIcon = async () => {
        const bellButton = document.getElementById('bell-btn');
        const defaultIcon = bellButton.querySelector('.default-icon');
        const notificationIcon = bellButton.querySelector('.notification-icon');

        const noti = await hasNotifications();

        if (noti) {
            if (notificationIcon) notificationIcon.style.display = 'block';
            if (defaultIcon) defaultIcon.style.display = 'none';
        } else {
            if (notificationIcon) notificationIcon.style.display = 'none';
            if (defaultIcon) defaultIcon.style.display = 'block';
        }
    }

    updateNotificationIcon();

    document.addEventListener('notification-deleted', updateNotificationIcon);

    document.addEventListener('click', function () {
        allPopups.forEach(p => {
            p.popup.style.display = 'none';
            p.isVisible = false;
        });
    });

    document.getElementById('logout_btn').addEventListener('click', function () {
        localStorage.clear();
        window.location.href = '../index.html';
    });
});
