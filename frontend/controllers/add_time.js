let timeBlockCounter = 1;

document.querySelectorAll('.add_time').forEach(button => {
    button.addEventListener('click', function () {


        const dateDiv = this.closest('.date');
        const scheduleDiv = dateDiv.querySelector('.schedule');
        const existingTimeBlocks = scheduleDiv.querySelectorAll('.time');

        if (existingTimeBlocks.length >= 3) return;

        const originalTime = existingTimeBlocks[0];
        const clone = originalTime.cloneNode(true);
        const oldDelete = clone.querySelector('.delete_time');
        if (oldDelete) oldDelete.remove();

        const timeInputs = clone.querySelectorAll('input[type="time"]');
        timeInputs.forEach((input, index) => {
            const dayLabel = dateDiv.querySelector('label').textContent.trim().replace(':', '');
            const type = index === 0 ? 'inicio' : 'fin';
            const uniqueId = `${dayLabel.toLowerCase()}_${type}_${timeBlockCounter}`;

            input.value = '';
            input.id = uniqueId;
            input.name = uniqueId;

            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.setAttribute('for', uniqueId);
            }
        });

        timeBlockCounter++;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('delete_time');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            clone.remove();

            const updatedBlocks = scheduleDiv.querySelectorAll('.time');
            if (updatedBlocks.length < 3) {
                this.style.display = 'inline-block';
            }
        });

        const trashIcon = document.createElement('img');
        trashIcon.src = '../images/trash_icon.png';
        trashIcon.alt = 'Eliminar';
        trashIcon.style.width = '20px';
        trashIcon.style.height = '20px';

        deleteBtn.appendChild(trashIcon);
        clone.appendChild(deleteBtn);
        scheduleDiv.appendChild(clone);

        const updatedBlocks = scheduleDiv.querySelectorAll('.time');
        if (updatedBlocks.length >= 3) {
            this.style.display = 'none';
        }
    });
});
