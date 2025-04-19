function finalizarAsesoria() {
    document.getElementById("pantalla-inicial").classList.add("hidden");
    document.getElementById("pantalla-espera").classList.remove("hidden");
  
    let segundos = 5;
    const cuentaElemento = document.getElementById("cuenta");
  
    const intervalo = setInterval(() => {
      segundos--;
      cuentaElemento.textContent = segundos;
  
      if (segundos <= 0) {
        clearInterval(intervalo);
        window.location.href = "https://forms.gle/jHebtNPXdg8KrVzg9";
      }
    }, 1000);
  }
  