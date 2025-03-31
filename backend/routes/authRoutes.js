const express = require('express');
const router = express.Router();
const db = require('../db');

//GET para pruebas
router.get('/login', (req, res) => {
    res.status(200).json({ message: "Ruta GET funcionando correctamente" });
});

// Ruta para el login
router.post('/login', (req, res) => {
    const correo = req.body.correo; 

    // Consulta SQL para buscar el correo en la base de datos
    const query = 'SELECT * FROM Usuario WHERE correo = ?';

    db.query(query, [correo], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Correo no encontrado' });
        }

        res.json({
            message: 'Login exitoso',
            usuario: results[0],
        });
    });
});

module.exports = router;
