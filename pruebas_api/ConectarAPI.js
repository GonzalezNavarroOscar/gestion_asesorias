const api_url = 'https://ahur7lk7jb.execute-api.us-east-2.amazonaws.com/dev'

const datosParaEnviar = {
    id: "1",
};

fetch(api_url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosParaEnviar)
})
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta de la API:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });