document.addEventListener("DOMContentLoaded", () => {
    const messagesBtn = document.getElementById("messages_btn");
    const popup = document.querySelector(".messages_popup");
    const contentDiv = document.getElementById("chat_preview_list");

    const userData = JSON.parse(localStorage.getItem('userData'));
    const idUsuario = userData?.id_usuario;

    let todosLosChats = [];

    async function cargarChats() {
        try {
            const response = await fetch(`http://localhost:3000/api/chats/${idUsuario}`);
            const data = await response.json();

            todosLosChats = data.data;

            if (data.success) {
                mostrarChats(data.data);
            } else {
                console.error('Error al cargar Chats:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    messagesBtn.addEventListener("click", () => {
        popup.style.display = popup.style.display === "none" ? "block" : "none";
        cargarChats();
    });

    function mostrarChats(chats) {
        const contentDiv = document.getElementById("chat_preview_list");
        if (!chats || chats.length === 0) {
            contentDiv.innerHTML = '<p>No tienes chats disponibles.</p>';
            return;
        }

        contentDiv.innerHTML = chats.map(chat => `
            <a href='../pages/chat.html?chat=${encodeURIComponent(chat.id_chat)}&nombre=${encodeURIComponent(chat.nombre)}'>
                <div class="chat_preview" data-chat-id="${chat.id_chat}">
                <p><strong>ID Chat:</strong> ${chat.id_chat}</p>
                <p><strong>ID Alumno:</strong> ${chat.id_alumno}</p>
                <p><strong>ID Asesor:</strong> ${chat.id_asesor}</p>
                <p><strong>ID Asesoría:</strong> ${chat.id_asesoria}</p>
                <p><strong>Último mensaje:</strong> ${chat.ultimo_mensaje?.contenido || 'Sin mensajes'}</p>
                <p><strong>Fecha:</strong> ${chat.ultimo_mensaje?.fecha || '---'}</p>
                <p><strong>Hora:</strong> ${chat.ultimo_mensaje?.hora || '---'}</p>
            </div>
            </a>
        `).join('');

        document.querySelectorAll('.chat_preview').forEach(preview => {
            preview.addEventListener('click', () => {
                const chatId = preview.getAttribute('data-chat-id');
                console.log('Chat seleccionado:', chatId);
            });
        });
    }

    cargarChats();
    setInterval(cargarChats, 60000);
});
