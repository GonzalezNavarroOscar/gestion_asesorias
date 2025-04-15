var checkbox = document.getElementById('switch_box')


checkbox.addEventListener('change', () => {
    var form_asesor = document.getElementById('register_form_asesor')
    var form_student = document.getElementById('register_form_student')
    if (checkbox.checked) {
        form_asesor.style.display = 'grid'
        form_student.style.display = 'none'
    } else {
        form_asesor.style.display = 'none'
        form_student.style.display = 'grid'
    }
})