const form = document.getElementById('form_message');
const userData = JSON.parse(localStorage.getItem('userData'));


const urlParams = new URLSearchParams(window.location.search);
let chatId = urlParams.get('chat');
let encabezado = urlParams.get('nombre');

if (!chatId) {
    chatId = ''
}

if (!encabezado) {
    const encabezado = ''
}

async function enviarMensaje(id_chat, mensaje, id_remitente) {
    const response = await fetch('http://localhost:3000/api/agregar-mensaje', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_chat, mensaje, id_remitente }),
    })

    const data = await response.json();
    mostrarMensajes(id_chat)
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const mensaje = form.elements['message'].value;

    enviarMensaje(chatId, mensaje, userData.id_usuario)

    form.elements['message'].value = '';
});

async function mostrarMensajes(id_chat, mensajero) {
    const response = await fetch('http://localhost:3000/api/mostrar-mensajes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_chat }),
    });

    chatId = id_chat;

    const data = await response.json();
    let mensajes = data.data;

    const messages_container = document.getElementById('messages_container');
    messages_container.innerHTML = '';

    if (!encabezado) {
        const encabezado_chat = document.getElementById('encabezado_chat');
        encabezado_chat.innerHTML = `<h5>${mensajero}</h5>`;
        encabezado = mensajero;
    }

    for (let i = 0; i < mensajes.length; i++) {
        if (userData.id_usuario != mensajes[i].id_remitente) {
            messages_container.innerHTML += `
                <div class="my_received_messages" id="my_received_messages">
                    <p>${mensajes[i].contenido}</p>
                </div>
            `;
        } else {
            messages_container.innerHTML += `
                <div class="my_messages" id="my_messages">
                    <p>${mensajes[i].contenido}</p>
                </div>
            `;
        }
    }

    messages_container.scrollTop = messages_container.scrollHeight;

    setInterval(() => {
        mostrarMensajes(chatId);
    }, 3000);
}



window.onload = () => {
    if (chatId && encabezado) {
        mostrarMensajes(chatId, encabezado);
    }
};


async function mostrarChats() {
    const response = await fetch(`http://localhost:3000/api/chats/${userData.id_usuario}`)
    const data = await response.json()
    let chats = data.data
    const chats_container = document.getElementById('chats_container')

    for (let i = 0; i < chats.length; i++) {

        chats_container.innerHTML = `
        <div class='chat'>
        <button onclick='mostrarMensajes(${chats[i].id_chat},"${chats[i].nombre}")'>
        <h4>${chats[i].nombre}</h4>
        <p>${chats[i].tema}</p>
        </button>
        </div>
        `
    }
}

mostrarChats()