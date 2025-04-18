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
            'SELECT id_materia, nombre, descripción,imagen,popularidad FROM Materia'
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

//Obtener temas de una materia específica
router.get('/temas', async (req, res) => {
    try {
        const nombreMateria = req.query.materia;

        if (!nombreMateria) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro "materia" es requerido'
            });
        }

        const nombreDecodificado = decodeURIComponent(nombreMateria);

        const temas = await queryAsync(
            `SELECT T.id_tema, T.id_materia, T.nombre, T.descripción, T.popularidad
             FROM Tema AS T
             JOIN Materia AS M ON T.id_materia = M.id_materia
             WHERE M.nombre = ?`,
            [nombreDecodificado]
        );

        res.json({
            success: true,
            data: temas,
            count: temas.length
        });

    } catch (error) {
        console.error('Error en GET /temas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al consultar temas',
            error: error.message
        });
    }
});

// Obtener notificaciones por ID de usuario
router.get('/notificaciones/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const query = 'SELECT * FROM Notificacion WHERE id_usuario = ? ORDER BY fecha_envio DESC';
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            console.error('Error al obtener notificaciones:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

// Eliminar notificación por ID
router.delete('/notificaciones/:id_notificacion', (req, res) => {
    const { id_notificacion } = req.params;

    const query = 'DELETE FROM Notificacion WHERE id_notificacion = ?';
    db.query(query, [id_notificacion], (err, results) => {
        if (err) {
            console.error('Error al eliminar notificación:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.json({ message: 'Notificación eliminada correctamente' });
    });
});

// Registrar usuarios en la base de datos dependiendo el rol
router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, contraseña, rol, matricula } = req.body;

        if (!nombre || !correo || !contraseña || !rol) {
            return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
        }

        // Insertar en Usuario primero
        const result = await queryAsync(
            'INSERT INTO Usuario (correo, contraseña, rol) VALUES (?, ?, ?)',
            [correo, contraseña, rol]
        );

        const id_usuario = result.insertId;

        if (rol === 'alumno') {
            if (!matricula) {
                return res.status(400).json({ success: false, message: 'Matrícula es requerida para estudiantes' });
            }

            await queryAsync(
                'INSERT INTO Alumno (id_usuario, nombre, matricula) VALUES (?, ?, ?)',
                [id_usuario, nombre, matricula]
            );
        } else if (rol === 'asesor') {
            await queryAsync(
                'INSERT INTO Asesor (id_usuario, nombre) VALUES (?, ?)',
                [id_usuario, nombre]
            );
        } else {
            return res.status(400).json({ success: false, message: 'Rol inválido' });
        }

        res.json({
            success: true,
            message: 'Registro exitoso',
            id_usuario
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

module.exports = router;