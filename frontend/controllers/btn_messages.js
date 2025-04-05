document.addEventListener('DOMContentLoaded', function () {
    const bellBtn = document.getElementById('messages_btn');
    const notificationPopup = document.querySelector('.messages_popup');
    const defaultIcon = bellBtn.querySelector('.default-icon');
    const notificationIcon = bellBtn.querySelector('.notification-icon');

    let hasNotifications = false;
    let popupVisible = false;

    function updateIcons() {
        if (hasNotifications) {
            defaultIcon.style.display = 'none';
            notificationIcon.style.display = 'block';
        } else {
            defaultIcon.style.display = 'block';
            notificationIcon.style.display = 'none';
        }
    }

    function togglePopup() {
        popupVisible = !popupVisible;
        notificationPopup.style.display = popupVisible ? 'flex' : 'none';

        if (popupVisible && hasNotifications) {
            hasNotifications = false;
            updateIcons();
        }
    }


    updateIcons();
    notificationPopup.style.display = 'none';

    bellBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePopup();
    });

    document.addEventListener('click', function () {
        if (popupVisible) {
            togglePopup();
        }
    });

    notificationPopup.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});