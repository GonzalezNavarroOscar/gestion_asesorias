document.addEventListener('DOMContentLoaded', () => {
    const chats_hidden = document.getElementById('chats_hidden');
    let value = true

    chats_hidden.addEventListener('click', () => {
        const chats_container = document.getElementById('chats_container')
        const container_menu = document.getElementById('container_menu')
        if (value == true) {
            chats_container.classList.remove('chat')
            chats_container.classList.add('hidden_chat')
            chats_container.classList.remove('container_menu')
            container_menu.classList.add('hidden')
            value = false
        } else {
            container_menu.classList.remove('hidden')
            container_menu.classList.add('container_menu')
            chats_container.classList.remove('hidden_chat')
            chats_container.classList.add('chat')
            value = true
        }
    })
})
