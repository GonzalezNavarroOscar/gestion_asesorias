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
                    return;
                }

                allPopups.forEach(p => {
                    p.popup.style.display = 'none';
                    p.isVisible = false;
                });

                this.popup.style.display = 'flex';
                this.isVisible = true;

                if (notificationIcon) {
                    notificationIcon.style.display = 'none';
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

    document.addEventListener('click', function () {
        allPopups.forEach(p => {
            p.popup.style.display = 'none';
            p.isVisible = false;
        });
    });

});