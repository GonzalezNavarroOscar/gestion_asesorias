import { cargarUsuarios } from '../js/view_users.js';
import { cargarAsesorias } from '../js/manage_advices.js';
import { cargarMaterias } from '../js/manage_subjects.js';
import { cargarTemas } from '../js/manage_topics.js';
import { generarGraficoEstadistica } from '../js/stats.js';

document.addEventListener("DOMContentLoaded", () => {

    const filter_usuarios = document.getElementById('filter_usuarios')
    const filter_asesorias = document.getElementById('filter_asesorias')
    const filter_materias = document.getElementById('filter_materias')
    const filter_temas = document.getElementById('filter_temas')
    const filter_estadisticas = document.getElementById('filter_estadisticas')


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

            switch (section) {
                case 'users':
                    cargarUsuarios();
                    filter_usuarios.classList.remove('hidden')
                    filter_asesorias.classList.add('hidden')
                    filter_materias.classList.add('hidden')
                    filter_temas.classList.add('hidden')
                    filter_estadisticas.classList.add('hidden')
                    break;
                case 'advices':
                    cargarAsesorias();
                    filter_usuarios.classList.add('hidden')
                    filter_asesorias.classList.remove('hidden')
                    filter_materias.classList.add('hidden')
                    filter_temas.classList.add('hidden')
                    filter_estadisticas.classList.add('hidden')
                    break;
                case 'subjects':
                    cargarMaterias();
                    filter_usuarios.classList.add('hidden')
                    filter_asesorias.classList.add('hidden')
                    filter_materias.classList.remove('hidden')
                    filter_temas.classList.add('hidden')
                    filter_estadisticas.classList.add('hidden')
                    break;
                case 'topics':
                    cargarTemas();
                    filter_usuarios.classList.add('hidden')
                    filter_asesorias.classList.add('hidden')
                    filter_materias.classList.add('hidden')
                    filter_temas.classList.remove('hidden')
                    filter_estadisticas.classList.add('hidden')
                    break;
                case 'stats':

                    generarGraficoEstadistica('todos');
                    const filtroSelect = document.getElementById('filter_estadisticas');
                    const canvas = document.getElementById('estadisticasGrafico');

                    if (canvas) {
                        filtroSelect.onchange = function () {
                            generarGraficoEstadistica(filtroSelect.value);
                        };
                    } else {
                        console.error("No se encontró el select o el canvas para estadísticas.");
                    }

                    filter_usuarios.classList.add('hidden');
                    filter_asesorias.classList.add('hidden');
                    filter_materias.classList.add('hidden');
                    filter_temas.classList.add('hidden');
                    filter_estadisticas.classList.remove('hidden');
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
