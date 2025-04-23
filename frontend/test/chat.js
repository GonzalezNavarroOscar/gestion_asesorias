const usuario = JSON.parse(localStorage.getItem("usuario")); 


const chatBox = document.getElementById("chatBox");
const mensajeInput = document.getElementById("mensaje");
const enviarBtn = document.getElementById("enviar");
const userRol = document.getElementById("userRol");


userRol.textContent = `Rol: ${usuario.rol}`;

let id_alumno = null;
let id_asesor = null;

if (usuario.rol === "alumno") {
  id_alumno = usuario.id_usuario;
  id_asesor = 1; 
} else if (usuario.rol === "asesor") {
  id_asesor = usuario.id_usuario;
  id_alumno = 2; 
}

async function cargarMensajes() {
  const res = await fetch(`/api/mensajes?id_alumno=${id_alumno}&id_asesor=${id_asesor}`);
  const mensajes = await res.json();

  chatBox.innerHTML = "";
  mensajes.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.emisor === usuario.rol ? "emisor" : "receptor";
    div.textContent = msg.mensaje;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

enviarBtn.addEventListener("click", async () => {
  const texto = mensajeInput.value.trim();
  if (!texto) return;

  const nuevoMensaje = {
    id_alumno,
    id_asesor,
    mensaje: texto,
    emisor: usuario.rol
  };

  await fetch("/api/enviar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoMensaje)
  });

  mensajeInput.value = "";
  cargarMensajes();
});


setInterval(cargarMensajes, 2000);
cargarMensajes();
