document.addEventListener("DOMContentLoaded", () => {
  const messagesBtn = document.getElementById("messages_btn");
  const popup = document.querySelector(".messages_popup");
  const contentDiv = document.getElementById("chat_preview_list");

  function cargarMensajes() {
      fetch(`http://localhost:3000/api/mensajes`)
          .then(res => res.json())
          .then(data => {
              if (!Array.isArray(data) || data.length === 0) {
                  contentDiv.innerHTML = "Aún no tienes mensajes.";
                  return;
              }

              contentDiv.innerHTML = data.map(msg => `
                  <div class="mensaje_preview" data-chat="${msg.id_chat}" data-nombre="${msg.nombre_otro_usuario}">
                      <strong>${msg.nombre_otro_usuario}</strong><br>
                      <span>${msg.ultimo_mensaje}</span>
                  </div>
              `).join('');

              document.querySelectorAll('.mensaje_preview').forEach(div => {
                  div.addEventListener('click', () => {
                      const chatId = div.getAttribute('data-chat');
                      const nombre = div.getAttribute('data-nombre');
                      abrirChatFlotante(chatId, nombre);
                  });
              });
          })
          .catch(error => {
              console.error("Error cargando mensajes:", error);
              contentDiv.innerHTML = "Error al cargar mensajes.";
          });
  }

  messagesBtn.addEventListener("click", () => {
      popup.style.display = popup.style.display === "none" ? "block" : "none";
      cargarMensajes();
  });

  function abrirChatFlotante(chatId, nombre) {
      if (document.querySelector(`#chat_${chatId}`)) {
          return;
      }

      const chatPopup = document.createElement("div");
      chatPopup.className = "chat_popup";
      chatPopup.id = `chat_${chatId}`;
      chatPopup.innerHTML = `
          <div class="chat_header">
              <span>${nombre}</span>
              <button class="close_chat">&times;</button>
          </div>
          <div class="chat_messages" id="messages_${chatId}"></div>
          <div class="chat_input">
              <input type="text" placeholder="Escribe un mensaje..." id="input_${chatId}">
              <button data-chat="${chatId}" class="send_chat">Enviar</button>
          </div>
      `;

      document.body.appendChild(chatPopup);
      cargarMensajesChat(chatId);

      chatPopup.querySelector('.send_chat').addEventListener('click', () => {
          const contenido = document.getElementById(`input_${chatId}`).value;
          if (!contenido.trim()) return;

          fetch(`http://localhost:3000/api/chat/${chatId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contenido }) // El servidor obtiene el id_usuario por sesión
          })
              .then(() => {
                  document.getElementById(`input_${chatId}`).value = "";
                  cargarMensajesChat(chatId);
              });
      });

      chatPopup.querySelector('.close_chat').addEventListener('click', () => {
          chatPopup.remove();
      });
  }

  function cargarMensajesChat(chatId) {
      fetch(`http://localhost:3000/api/chat/${chatId}`)
          .then(res => res.json())
          .then(data => {
              const messagesDiv = document.getElementById(`messages_${chatId}`);
              if (messagesDiv) {
                  messagesDiv.innerHTML = data.map(msg => `
                      <div class="chat_msg ${msg.es_mio ? 'yo' : 'ellos'}">${msg.contenido}</div>
                  `).join('');
                  messagesDiv.scrollTop = messagesDiv.scrollHeight;
              }
          });
  }
});
