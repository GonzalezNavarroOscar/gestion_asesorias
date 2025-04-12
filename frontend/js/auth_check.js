const token = localStorage.getItem('authToken');
const user = localStorage.getItem('userData');

if (!token || !user) {
  window.location.href = '../index.html';
}