import { cargarUsuarios } from '../js/view_users.js';
import { cargarAsesorias } from '../js/manage_advices.js';
import { cargarMaterias } from '../js/manage_subjects.js';
import { cargarTemas } from '../js/manage_topics.js';
import { generarGraficoEstadistica } from '../js/stats.js';

document.addEventListener("DOMContentLoaded", () => {
    const buttons = {
        users: document.getElementById('gestUsu'),
        advices: document.getElementById('gestAse'),
        subjects: document.getElementById('gestMat'),
        topics: document.getElementById('gestTem'),
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
        topics: `
            <div class="section" id="topics-section">
                <h2>Gestión de Temas</h2>
                <div class="topics-container"></div>
            </div>
        `,
        stats: `
        <div class="section" id="stats-section">
            <h2>Estadísticas</h2>
            <div class="stats-container">
                <label for="tipo-estadistica">Seleccionar Tipo de Estadística:</label>
                <select id="tipo-estadistica">
                    <option value="todos">Todos</option>
                    <option value="usuarios">Usuarios</option>
                    <option value="asesorias">Asesorías</option>
                    <option value="materias">Materias</option>
                    <option value="temas">Temas</option>
                </select>
                <div class="graphs-container">
                    <canvas id="estadisticasGrafico" width="400" height="200"></canvas>
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
                case 'topics':
                    cargarTemas();
                    break;
                case 'stats':
                    generarGraficoEstadistica('todos');
                    break;
            }
        }
    }

    buttons.users.addEventListener('click', () => loadSection('users'));
    buttons.advices.addEventListener('click', () => loadSection('advices'));
    buttons.subjects.addEventListener('click', () => loadSection('subjects'));
    buttons.topics.addEventListener('click', () => loadSection('topics'));
    buttons.stats.addEventListener('click', () => loadSection('stats'));

    loadSection('users');
});