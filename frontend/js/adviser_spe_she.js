form = document.getElementById('schedule_form')
const userData = JSON.parse(localStorage.getItem('userData'));
const idAsesor = userData.id_usuario

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const horarios = [];
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const idAsesor = userData.id_usuario

    dias.forEach(dia => {
        if (formData.get(`${dia}_checkbox`) === 'on') {
            let i = 0;
            while (formData.has(`${dia}_inicio_${i}`)) {
                const inicio = formData.get(`${dia}_inicio_${i}`);
                const fin = formData.get(`${dia}_fin_${i}`);

                if (inicio && fin) {
                    horarios.push({ dia, inicio, fin });
                }
                i++;
            }
        }
    });

    try {
        const response = await fetch(`http://localhost:3000/api/horario/${idAsesor}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ horarios })
        });

        const result = await response.json();
        if (result.success) {
            alert("Horarios guardados correctamente");
        } else {
            alert("Error al guardar horarios");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de red al guardar horarios");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const days = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    days.forEach(day => {
        const checkbox = document.getElementById(`${day}_checkbox`);
        const dateDiv = document.getElementById(`date_${day}`);
        const schedule = dateDiv.querySelector(".schedule");
        const addBtn = dateDiv.querySelector(".add_time");
        const inputs = schedule.querySelectorAll("input[type='time']")

        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                schedule.classList.remove("hidden");
                addBtn.classList.remove("hidden");
                inputs.forEach(input => input.required = true);
            } else {
                schedule.classList.add("hidden");
                addBtn.classList.add("hidden");
                inputs.forEach(input => input.required = false);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    cargarHorariosGuardados(userData.id_usuario);
});

async function cargarHorariosGuardados(idAsesor) {
    const res = await fetch(`http://localhost:3000/api/consultar_horario/${idAsesor}`);
    const data = await res.json();

    if (data.success) {
        const horarios = data.data;

        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const horariosPorDia = {};
        dias.forEach(d => horariosPorDia[d] = []);

        horarios.forEach(h => {
            const dia = h.dia_inicio.toLowerCase();
            if (horariosPorDia[dia]) {
                horariosPorDia[dia].push({
                    inicio: h.horario_inicio,
                    fin: h.horario_fin
                });
            }
        });

        Object.keys(horariosPorDia).forEach(dia => {
            const bloque = horariosPorDia[dia];
            if (bloque.length === 0) return;

            const dateDiv = document.getElementById(`date_${dia}`);
            const scheduleDiv = dateDiv.querySelector('.schedule');
            const addBtn = dateDiv.querySelector('.add_time');

            dateDiv.querySelector(`#${dia}_checkbox`).checked = true;
            scheduleDiv.classList.remove('hidden');
            addBtn.classList.remove('hidden');

            const original = scheduleDiv.querySelector('.time');
            original.remove();

            bloque.forEach((horario, index) => {
                const clone = original.cloneNode(true);

                const inputs = clone.querySelectorAll('input[type="time"]');
                inputs[0].value = horario.inicio;
                inputs[1].value = horario.fin;

                const id_inicio = `${dia}_inicio_${index}`;
                const id_fin = `${dia}_fin_${index}`;

                inputs[0].id = id_inicio;
                inputs[0].name = id_inicio;
                clone.querySelector(`label[for^="${dia}_inicio"]`).setAttribute('for', id_inicio);

                inputs[1].id = id_fin;
                inputs[1].name = id_fin;
                clone.querySelector(`label[for^="${dia}_fin"]`).setAttribute('for', id_fin);

                if (bloque.length > 1) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.classList.add('delete_time');
                    deleteBtn.innerHTML = '<img src="../images/trash_icon.png" alt="Eliminar bloque">';
                    deleteBtn.style.marginLeft = '10px';

                    deleteBtn.addEventListener('click', () => {
                        clone.remove();
                        addBtn.style.display = 'inline-block';
                    });

                    clone.appendChild(deleteBtn);
                }

                scheduleDiv.appendChild(clone);
            });

            if (bloque.length >= 3) {
                addBtn.style.display = 'none';
            }
        });
    }
}

specialities_form = document.getElementById('specialities_form')

specialities_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const checkboxes = document.querySelectorAll('input[name=especialidad]:checked')
    const selecionados = Array.from(checkboxes).map(checkbox => checkbox.value)

    let especialidades = ''

    selecionados.forEach((value) => {
        especialidades = especialidades + value + ','
    })

    try {
        const response = await fetch(`http://localhost:3000/api/insertar_especialidades/${idAsesor}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ especialidades })
        });

        const result = await response.json();
        if (result.success) {
            alert("Guardado correctamente");
        } else {
            alert("No se pudo guardar");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de red al guardar horarios");
    }



});