
let timeBlockCounter = 1

document.querySelectorAll('.add_time').forEach(button => {
    button.addEventListener('click', function () {
        const dateDiv = this.closest('.date')
        const scheduleDiv = dateDiv.querySelector('.schedule')
        const originalTime = scheduleDiv.querySelector('.time')

        const clone = originalTime.cloneNode(true);

        const timeInputs = clone.querySelectorAll('input[type="time"]')
        timeInputs.forEach((input, index) => {
            const dayLabel = dateDiv.querySelector('label').textContent.trim().replace(':', '')
            const type = index === 0 ? 'inicio' : 'fin';
            //id creado para cada uno ej. lunes_inicio_1, martes_inicio_1,martes_inicio_2
            const uniqueId = `${dayLabel.toLowerCase()}_${type}_${timeBlockCounter}`

            input.value = ''
            input.id = uniqueId
            input.name = uniqueId

            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.setAttribute('for', uniqueId)
            }
        });

        timeBlockCounter++;

        const deleteBtn = document.createElement('button')
        deleteBtn.type = 'button'
        deleteBtn.classList.add('delete_time')
        deleteBtn.style.marginLeft = '10px'
        deleteBtn.addEventListener('click', function () {
            clone.remove();
        });

        const trashIcon = document.createElement('img')
        trashIcon.src = '../images/trash_icon.png'
        trashIcon.alt = 'Eliminar'
        trashIcon.style.width = '20px'
        trashIcon.style.height = '20px'

        deleteBtn.appendChild(trashIcon)

        clone.appendChild(deleteBtn)

        scheduleDiv.appendChild(clone)
    });
});

