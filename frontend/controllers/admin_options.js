import { cargarUsuarios } from '../js/view_users.js';
import { cargarAsesorias } from '../js/manage_advices.js';
import { cargarMaterias } from '../js/manage_subjects.js';

document.addEventListener("DOMContentLoaded", () => {
    const buttons = {
        users: document.getElementById('gestUsu'),
        advices: document.getElementById('gestAse'),
        subjects: document.getElementById('gestMat'),
        stats: document.getElementById('estad')
    };

    const contentSection = document.querySelector('.content-section');
    
    const sectionTemplates = {
        users: `
            <div class="section" id="users-section">
                <h2>Gestión de Usuarios</h2>
                <div class="users-container"></div>
            </div>
        `,
        advices: `
            <div class="section" id="advices-section">
                <h2>Gestión de Asesorías</h2>
                <div class="advices-container"></div>
            </div>
        `,
        subjects: `
            <div class="section" id="subjects-section">
                <h2>Gestión de Materias</h2>
                <div class="subjects-container"></div>
            </div>
        `,
        stats: `
            <div class="section" id="stats-section">
                <h2>Estadísticas</h2>
                <div class="graphs-container">
                    <div class="graph">
                        <img src="../images/Graficadeejemplo.png">
                    </div>
                    <div class="graph_content">
                        <h4>Asesorias pendientes</h4>
                        <h4>Asesorias en proceso</h4>
                        <h4>Asesorias completadas</h4>
                    </div>
                </div>
            </div>
        `
    };

    function loadSection(section) {
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        if (!document.getElementById(`${section}-section`)) {
            contentSection.innerHTML = sectionTemplates[section];
        }
        
        const currentSection = document.getElementById(`${section}-section`);
        if (currentSection) {
            currentSection.classList.add('active');
            
            switch(section) {
                case 'users':
                    cargarUsuarios();
                    break;
                case 'advices':
                    cargarAsesorias();
                    break;
                case 'subjects':
                    cargarMaterias();
                    break;
                case 'stats':
                    // Contenido ya está en la plantilla
                    break;
            }
        }
    }

    buttons.users.addEventListener('click', () => loadSection('users'));
    buttons.advices.addEventListener('click', () => loadSection('advices'));
    buttons.subjects.addEventListener('click', () => loadSection('subjects'));
    buttons.stats.addEventListener('click', () => loadSection('stats'));

    loadSection('users');
});