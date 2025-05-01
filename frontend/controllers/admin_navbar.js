class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar">
            <ul class="navbar-list">
                <li><img src="../images/LOGO_sin_fondo.png" class="logo" id="logo_btn"></li>
                
                <li class="navbar-title">Panel Administrativo</li>
                
                <div class="options">
                    <li id="settings">
                        <button class="icon-btn" id="settings_btn">
                            <img src="../images/Menu.png" class="menu default-icon">
                        </button>
                        <div class="settings_popup" style="display: none;">
                            <div class="settings_content">
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
    }
}

customElements.define('main-navbar', Navbar);
