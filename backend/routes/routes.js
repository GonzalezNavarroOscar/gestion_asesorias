const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Helper para ejecutar queries con promesas
function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

// Login
router.post('/login', async (req, res) => {
  try {
      if (!req.is('application/json')) {
          return res.status(415).json({
              success: false,
              message: 'Se requiere Content-Type: application/json'
          });
      }

      const { correo, contraseña } = req.body;

      // Validación básica
      if (!correo || !contraseña) {
          return res.status(400).json({
              success: false,
              message: 'Correo y contraseña son requeridos'
          });
      }

      const results = await queryAsync(
          'SELECT id_usuario, correo, rol, contraseña FROM Usuario WHERE correo = ?',
          [correo]
      );

      if (!results || results.length === 0) {
          return res.status(401).json({
              success: false,
              message: 'Credenciales inválidas'
          });
      }

      const user = results[0];

      if (contraseña !== user.contraseña) {
          return res.status(401).json({
              success: false,
              message: 'Contraseña incorrecta'
          });
      }

      // Crear token
      const token = jwt.sign(
          { id: user.id_usuario, email: user.correo },
          process.env.JWT_SECRET || 'secret_key_placeholder',
          { expiresIn: '1h' }
      );

      const { contraseña: _, ...userData } = user;

      // Respuesta exitosa
      return res.json({
          success: true,
          message: 'Login exitoso',
          user: userData,
          token
      });

  } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
      });
  }
});

// Obtener todas las materias
router.get('/materias', async (req, res) => {
  try {
      const materias = await queryAsync(
          'SELECT id_materia, nombre, descripción, imagen FROM Materia'
      );
      
      res.json({
          success: true,
          data: materias
      });
  } catch (error) {
      console.error('Error al obtener materias:', error);
      res.status(500).json({
          success: false,
          message: 'Error al obtener las materias'
      });
  }
});

module.exports = router;