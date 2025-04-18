class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <nav class="navbar">
        <ul>
            <li><img src="../images/LOGO_sin_fondo.png" class="logo" id="logo_btn"></li>
            <div class="options">
                <li id="message">
                    <button class="icon-btn" id="messages_btn">
                        <img src="../images/Mensajes.png" class="messages default-icon">
                    </button>
                    <div class="messages_popup" style="display: none;">
                        <div>
                            <h1>Mensajes</h1>
                        </div>
                        <div class="messages_content">Aun no tienes mensajes.</div>
                    </div>
                </li>
                <li id="bell">
                    <button class="icon-btn" id="bell-btn">
                        <img src="../images/Campana.png" class="notifications default-icon">
                        <img src="../images/Campana_Notificacion.png" class="notifications notification-icon"
                            style="display: none;">
                    </button>
                    <div class="notificacion_popup" style="display: none;">
                        <div>
                            <h1>Notificaciones</h1>
                        </div>
                        <div class="notificacion_content">No tienes notificaciones.</div>
                    </div>
                </li>
                <li id="settings">
                    <button class="icon-btn" id="settings_btn">
                        <img src="../images/Menu.png" class="menu default-icon">
                        <img src="#" class="menu notification-icon" style="display: none;">
                    </button>
                    <div class="settings_popup" style="display: none;">
                        <div>
                            <h1>Configuracion</h1>
                            <div class="settings_content_btn">
                                <button id="account_btn">Mi cuenta</button>
                            </div>
                            <div class="settings_content_btn">
                                <button id="logout_btn">Salir de la cuenta</button>
                            </div>
                        </div>
                    </div>
                </li>
            </div>
        </ul>
    </nav>
    `;

        const script = document.createElement('script');
        script.src = '../js/notification.js';
        document.body.appendChild(script);

        const checkNotificationScript = document.createElement('script');
        checkNotificationScript.src = '../js/notification_check.js';
        document.body.appendChild(checkNotificationScript);
    }
    
}

customElements.define('main-navbar', Navbar);