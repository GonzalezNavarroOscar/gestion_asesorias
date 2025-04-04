datos = {
  subject: "Algebra Lineal",
  description: "El álgebra lineal es una rama de las matemáticas que se encarga del estudio de vectores, matrices,espacios vectoriales y transformaciones lineales.",
  image: "images/algebra_lineal.jpg"
}

for (let i = 0; i < 4;) {
  materias.innerHTML += `
    <div class='card'>
      <div class='card-image'>
        <img src='${datos.image}'>
      </div>
      <div class='card-content'>
        <div class='card-text'>${datos.subject}</div>
        <div class='card-description'>${datos.description}</div>
        <button>Ingresar</button>
      </div>
    </div>
  `;
  i = i + 1
}

