document.addEventListener('DOMContentLoaded', function() {
    const specialitiesForm = document.getElementById('specialities_form');
    const specialitiesContainer = document.getElementById('specialities');
    
    specialitiesContainer.innerHTML = `
        <div class="specialities-controls">
            <div class="tag-input-group">
                <input type="text" id="tag-input" placeholder="Escribe una especialidad">
                <button type="button" id="add-tag-btn">Agregar</button>
            </div>
            <div class="tags" id="tags-container"></div>
        </div>
        <div class="existing-specialities" id="existing-specialities">
            <h4>Tus especialidades actuales</h4>
            <div class="current-tags" id="current-tags"></div>
        </div>
    `;
    
    const tagInput = document.getElementById('tag-input');
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagsContainer = document.getElementById('tags-container');
    const currentTagsContainer = document.getElementById('current-tags');
    
    loadExistingSpecialities();

    addTagBtn.addEventListener('click', function() {
        if (tagInput.value.trim() !== '') {
            addTag(tagInput.value.trim());
            tagInput.value = '';
            tagInput.focus();
        }
    });

    tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTagBtn.click();
        }
    });

    specialitiesForm.addEventListener('submit', handleFormSubmit);
});

let currentTags = [];
let existingSpecialities = [];

function addTag(text) {
    const tagsContainer = document.getElementById('tags-container');
    const normalizedText = text.trim().toLowerCase();
    
    if ([...currentTags, ...existingSpecialities].some(tag => tag.toLowerCase() === normalizedText)) {
        alert('Esta especialidad ya existe');
        return;
    }

    currentTags.push(text.trim());
    
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        ${text.trim()}
        <span class="delete-tag">×</span>
    `;
    
    tag.querySelector('.delete-tag').addEventListener('click', () => {
        tag.remove();
        currentTags = currentTags.filter(t => t !== text.trim());
    });
    
    tagsContainer.appendChild(tag);
}

function displayExistingSpecialities(specialities) {
    const container = document.getElementById('current-tags');
    container.innerHTML = '';
    
    if (specialities.length === 0) {
        container.innerHTML = '<p>No tienes especialidades registradas aún</p>';
        return;
    }
    
    specialities.forEach(especialidad => {
        if (especialidad.trim() !== '') {
            const tag = document.createElement('div');
            tag.className = 'existing-tag';
            tag.innerHTML = `
                ${especialidad.trim()}
                <span class="delete-existing-tag" data-especialidad="${especialidad.trim()}">×</span>
            `;
            
            tag.querySelector('.delete-existing-tag').addEventListener('click', async (e) => {
                e.stopPropagation();
                const especialidad = e.target.dataset.especialidad;
                if (confirm(`¿Seguro que quieres eliminar la especialidad "${especialidad}"?`)) {
                    await removeSpeciality(especialidad);
                }
            });
            
            container.appendChild(tag);
        }
    });
}

async function removeSpeciality(especialidad) {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.id_usuario) return;

        const response = await fetch(`http://localhost:3000/api/eliminar_especialidad/${userData.id_usuario}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({ especialidad })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Especialidad eliminada correctamente');
            await loadExistingSpecialities();
        } else {
            alert(result.message || 'Error al eliminar especialidad');
        }
    } catch (error) {
        console.error('Error al eliminar especialidad:', error);
        alert('Error de conexión al eliminar');
    }
}

async function loadExistingSpecialities() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.id_usuario) return;

        const response = await fetch(`http://localhost:3000/api/consultar_especialidades/${userData.id_usuario}`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
            existingSpecialities = data.data.filter(e => e.trim() !== '');
            displayExistingSpecialities(existingSpecialities);
        }
    } catch (error) {
        console.error('Error al cargar especialidades:', error);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData?.id_usuario) {
        alert('No se encontraron datos de usuario');
        return;
    }

    const tags = currentTags.filter(tag => tag.trim() !== '');

    if (tags.length === 0) {
        alert('Por favor agrega al menos una especialidad');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/insertar_especialidades/${userData.id_usuario}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({ especialidades: tags })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert("Especialidades actualizadas correctamente");
            loadExistingSpecialities();
            currentTags = [];
            document.getElementById('tags-container').innerHTML = '';
        } else {
            alert(result.message || 'Error al guardar especialidades');
        }
    } catch (error) {
        console.error('Error completo:', error);
        alert('Error de conexión al guardar');
    }
}