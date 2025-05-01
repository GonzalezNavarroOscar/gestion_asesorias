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
            console.log(todosLosChats)

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

        contentDiv.innerHTML = chats.map(chat =>
            `
            <a class='a_link' href='../pages/chat.html?chat=${encodeURIComponent(chat.id_chat)}&nombre=${encodeURIComponent(chat.nombre)}'>
                <div class="chat_preview" data-chat-id="${chat.id_chat} style='text-decoration:none;'">
                    <div class='chat_content'> 
                        <div class='chat_user'>
                            <img src='../images/user.png'>
                            <p><strong>${chat.nombre}</strong></p>
                        </div>
                    </div>
                        <p>${chat.tema}</p>
                    <p><strong>Último mensaje:</strong> ${chat.ultimo_mensaje || 'Sin mensajes'}</p>
                    <div class='chat_date'>
                        <p> ${new Date(chat.fecha_mensaje).toLocaleDateString('es-ES') || '---'}</p>
                        <p> ${chat.hora_mensaje || '---'}</p>
                    </div>
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
