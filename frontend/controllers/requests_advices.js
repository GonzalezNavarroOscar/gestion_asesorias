var checkbox = document.getElementById('switch_box')


checkbox.addEventListener('change', () => {
    var requests_div = document.getElementById('requests-div')
    var advices_div = document.getElementById('advices-div')
    if (checkbox.checked) {
        advices_div.style.display = 'grid'
        requests_div.style.display = 'none'
    } else {
        advices_div.style.display = 'none'
        requests_div.style.display = 'grid'
    }
})