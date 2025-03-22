require('dotenv').config();
const mysql = require('mysql2');

console.log('DB_HOST:', process.env.DB_HOST);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err.stack);
      return;
    }
    console.log('Conectado a la base de datos');
  });
};

module.exports = connectDB;
