const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'GestionAsesorias',
  database: 'gestion-asesorias'
});

app.post('/enviar', (req, res) => {
    const { id_alumno, id_asesor, mensaje, emisor } = req.body;
    const sql = 'INSERT INTO chat (id_alumno, id_asesor, mensaje, emisor) VALUES (?, ?, ?, ?)';
    db.query(sql, [id_alumno, id_asesor, mensaje, emisor], (err) => {
      if (err) return res.status(500).send(err);
      res.send({ status: 'ok' });
    });
  });
  
  app.get('/mensajes', (req, res) => {
    const { id_alumno, id_asesor } = req.query;
    const sql = 'SELECT * FROM chat WHERE id_alumno = ? AND id_asesor = ? ORDER BY fecha ASC';
    db.query(sql, [id_alumno, id_asesor], (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
  });
  

app.listen(port, () => {
  console.log(`Servidor Node escuchando en http://localhost:${port}`);
});
