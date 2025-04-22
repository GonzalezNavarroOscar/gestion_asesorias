const checkbox = document.getElementById('switch_box');
const requests = document.getElementById('requests_container')
const subjects = document.getElementById('materias_container')


checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        requests.style.display = 'flex'
        subjects.style.display = 'none'
    } else {
        requests.style.display = 'none'
        subjects.style.display = 'flex'
    }
});