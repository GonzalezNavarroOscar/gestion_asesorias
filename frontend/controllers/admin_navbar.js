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
                        <div class="settings_popup" id="settings_popup">
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

        this.addEventListeners();
    }

    addEventListeners() {
        const settingsBtn = this.querySelector('#settings_btn');
        const settingsPopup = this.querySelector('#settings_popup');
        const accountBtn = this.querySelector('#account_btn');
        const logoutBtn = this.querySelector('#logout_btn');

        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPopup.style.display = settingsPopup.style.display === 'none' ? 'flex' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!settingsPopup.contains(e.target) && e.target !== settingsBtn) {
                settingsPopup.style.display = 'none';
            }
        });

        accountBtn.addEventListener('click', () => {
            window.location.href = './profile.html';
        });

        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../index.html';
        });
    }
}

customElements.define('main-navbar', Navbar);