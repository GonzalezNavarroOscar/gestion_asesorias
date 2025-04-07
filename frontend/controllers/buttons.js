document.addEventListener('DOMContentLoaded', function () {
    const popupConfig = [
        {
            btnId: 'bell-btn',
            popupClass: 'notificacion_popup',
            contentClass: 'notificacion_content',
            defaultIconClass: 'default-icon',
            notificationIconClass: 'notification-icon',
            emptyMessage: 'No tienes notificaciones.'
        },
        {
            btnId: 'messages_btn',
            popupClass: 'messages_popup',
            contentClass: 'messages_content',
            defaultIconClass: 'default-icon',
            notificationIconClass: 'notification-icon',
            emptyMessage: 'Aún no tienes mensajes.'
        },
        {
            btnId: 'settings_btn',
            popupClass: 'settings_popup',
            contentClass: 'settings_content',
            defaultIconClass: 'default-icon',
            notificationIconClass: 'notification-icon',
            emptyMessage: ''
        }
    ];

    const allPopups = [];

    popupConfig.forEach(config => {
        const btn = document.getElementById(config.btnId);
        const popup = btn.parentElement.querySelector(`.${config.popupClass}`);
        const defaultIcon = btn.querySelector(`.${config.defaultIconClass}`);
        const notificationIcon = btn.querySelector(`.${config.notificationIconClass}`);
        const content = popup.querySelector(`.${config.contentClass}`);

        let hasNotifications = false;
        let popupVisible = false;

        allPopups.push({
            popup,
            btn,
            togglePopup: () => {
                allPopups.forEach(p => {
                    p.popup.style.display = 'none';
                    p.popupVisible = false;
                });

                popupVisible = true;
                popup.style.display = 'flex';

                if (popupVisible && hasNotifications) {
                    hasNotifications = false;
                    notificationIcon.style.display = 'none';
                    defaultIcon.style.display = 'block';
                }
            }
        });

        const updateIcons = () => {
            notificationIcon.style.display = hasNotifications ? 'block' : 'none';
            defaultIcon.style.display = hasNotifications ? 'none' : 'block';
        };

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            allPopups.find(p => p.btn === btn).togglePopup();
        });

        popup.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        updateIcons();
        content.textContent = config.emptyMessage;
    });

    document.addEventListener('click', function () {
        allPopups.forEach(p => {
            p.popup.style.display = 'none';
            p.popupVisible = false;
        });
    });
});