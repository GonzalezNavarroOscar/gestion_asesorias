let Todosusuarios = [];

export async function cargarUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/api/usuarios');
        const data = await response.json();

        Todosusuarios = data.data;

        if (data.success) {
            mostrarUsuarios(data.data);
        } else {
            console.error('Error al cargar usuarios:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const setupDeleteButtons = () => {
    document.querySelectorAll('.delete_user_btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            const userDiv = e.target.closest('.user');
            const userId = userDiv.dataset.userId;

            const userName = userDiv.querySelector('h3')?.textContent || 'este usuario';

            const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar a ${userName}?`);
            if (!confirmar) return;

            try {
                const response = await fetch(`http://localhost:3000/api/borrar-usuario/${userId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error en la respuesta');

                userDiv.classList.add('fade-out');

                setTimeout(() => {
                    userDiv.remove();
                    document.dispatchEvent(new CustomEvent('user-eliminado'));
                }, 300);

            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('No se pudo eliminar el usuario');
            }
        });
    });
};

export function mostrarUsuarios(usuarios) {
    const contenedor = document.querySelector('.users-container');
    contenedor.innerHTML = '';

    const addUserCard = document.createElement('div');
    addUserCard.className = 'user add-user';
    addUserCard.innerHTML = `
        <a href="add_user.html? class="add-user-link">
            <div class="user_content">
                <h3>Agregar Nuevo Usuario</h3>
                <button class="add_user_btn">
                    <img src="../images/add_icon.png" alt="Agregar">
                </button>
            </div>
        </a>
    `;
    contenedor.appendChild(addUserCard);

    usuarios.forEach(usuario => {
        const usuarioCard = document.createElement('div');
        usuarioCard.className = 'user';

        let nombreMostrado = '';
        if (usuario.rol === 'alumno') {
            nombreMostrado = usuario.alumno || '(Nombre no disponible)';
        } else if (usuario.rol === 'asesor') {
            nombreMostrado = usuario.asesor || '(Nombre no disponible)';
        } else {
            nombreMostrado = '(Sin rol válido)';
        }

        usuarioCard.setAttribute('data-user-id', usuario.id_usuario);

        usuarioCard.innerHTML = `
            <div class="user_content">
                <h3>${nombreMostrado}</h3>
                <h4>Correo: ${usuario.correo}</h4>
                <h4>Rol: ${usuario.rol.toUpperCase()}</h4>
            </div>
            <button class="delete_user_btn">
                <img src="../images/trash_icon.png" alt="Eliminar">
            </button>
        `;

        contenedor.appendChild(usuarioCard);
    });


    setupDeleteButtons();
}

const opcion = () => {
    const select = filter.selectedIndex
    let usuarios = Todosusuarios
    switch (select) {
        case 1:
            usuarios.sort((a, b) => {
                const nombreA = a.alumno || a.asesor
                const nombreB = b.alumno || b.asesor
                return nombreA.localeCompare(nombreB)
            })
            break
        case 2:
            usuarios.sort((a, b) => {
                const nombreA = a.alumno || a.asesor
                const nombreB = b.alumno || b.asesor
                return nombreB.localeCompare(nombreA)
            })
            break
        case 3:
            usuarios = usuarios.filter(value => value.rol === 'alumno')
            break
        case 4:
            usuarios = usuarios.filter(value => value.rol === 'asesor')
            break
    }
    mostrarUsuarios(usuarios)
}

const filter = document.getElementById('filter_usuarios')
filter.addEventListener('change', opcion)