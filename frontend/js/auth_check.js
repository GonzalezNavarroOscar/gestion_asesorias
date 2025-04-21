const token = localStorage.getItem('authToken');
const user = localStorage.getItem('userData');

if (!token || !user) {
  alert('Debes iniciar sesión!');
  window.location.href = '../index.html';
}