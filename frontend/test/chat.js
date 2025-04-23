const usuario = JSON.parse(sessionStorage.getItem('usuario'));
if (!usuario) {
  window.location.href = '../pages/login.html';
}

const emisor = usuario.rol;
const emisorId = usuario.id_usuario;

const id_alumno = emisor === 'alumno' ? emisorId : 1;
const id_asesor = emisor === 'asesor' ? emisorId : 1;

const chatBox = document.getElementById('chatBox');
const input = document.getElementById('mensaje');
const enviar = document.getElementById('enviar');

function cargarMensajes() {
  fetch(`/mensajes?id_alumno=${id_alumno}&id_asesor=${id_asesor}`)
    .then(res => res.json())
    .then(data => {
      chatBox.innerHTML = "";
      data.forEach(msg => {
        const div = document.createElement("div");
        div.textContent = `${msg.emisor}: ${msg.mensaje}`;
        div.style.textAlign = msg.emisor === emisor ? 'right' : 'left';
        chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

enviar.onclick = () => {
  const mensaje = input.value;
  if (mensaje.trim() === "") return;

  fetch('/enviar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_alumno,
      id_asesor,
      mensaje,
      emisor
    })
  }).then(() => {
    input.value = "";
    cargarMensajes();
  });
};

setInterval(cargarMensajes, 2000);
cargarMensajes();
