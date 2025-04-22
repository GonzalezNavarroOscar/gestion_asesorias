const checkbox = document.getElementById('switch_box');
const requests_div = document.getElementById('requests-div');
const advices_div = document.getElementById('advices-div');

// Flags para saber si ya se cargaron
let scriptRequestsLoaded = false;
let scriptAdvicesLoaded = false;

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.body.appendChild(script);
}

function showRequests() {
    advices_div.style.display = 'none';
    requests_div.style.display = 'grid';

    if (!scriptRequestsLoaded) {
        loadScript('../js/view_requests.js', () => {
            scriptRequestsLoaded = true;
            cargarSolicitudes();
        });
    } else {
        cargarSolicitudes();
    }
}

function showAdvices() {
    requests_div.style.display = 'none';
    advices_div.style.display = 'grid';

    if (!scriptAdvicesLoaded) {
        loadScript('../js/view_advices.js', () => {
            scriptAdvicesLoaded = true;
            cargarAsesorias();
        });
    } else {
        cargarAsesorias();
    }
}

if (checkbox.checked) {
    showAdvices();
} else {
    showRequests();
}

const filter_request = document.getElementById('filter_request_container')
const filter_advices = document.getElementById('filter_advices_container')

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        showAdvices()
        filter_request.style.display = 'none'
        filter_advices.style.display = 'flex'
    } else {
        showRequests()
        filter_request.style.display = 'flex'
        filter_advices.style.display = 'none'
    }
});
