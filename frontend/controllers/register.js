const checkbox = document.getElementById('switch_box');

checkbox.addEventListener('change', () => {
    const formAsesor = document.getElementById('register_form_asesor');
    const formStudent = document.getElementById('register_form_student');
    
    if (checkbox.checked) {
        formStudent.classList.add('inactive');
        formAsesor.classList.add('active');
        formStudent.classList.remove('active');
        formAsesor.classList.remove('inactive');
    } else {
        formStudent.classList.remove('inactive');
        formAsesor.classList.remove('active');
        formStudent.classList.add('active');
        formAsesor.classList.add('inactive');
    }
});