const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

        if (!correo || !contraseña) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son requeridos'
            });
        }

        const results = await queryAsync(
            'SELECT id_usuario, correo, rol FROM Usuario WHERE correo = ? AND contraseña = ?',
            [correo, contraseña]
        );

        if (!results || results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        if (results.length === 1) {
            const user = results[0];
            const token = jwt.sign(
                { id: user.id_usuario, email: user.correo },
                'secret_key_placeholder',
                { expiresIn: '1h' }
            );
            return res.json({
                success: true,
                message: 'Login exitoso',
                user,
                token
            });
        }

        const roles = results.map(user => ({
            id_usuario: user.id_usuario,
            correo: user.correo,
            rol: user.rol
        }));

        return res.json({
            success: true,
            message: 'Múltiples roles encontrados',
            multipleRoles: true,
            roles
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Obtener la información del usuario según el rol
router.get('/perfil/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario || isNaN(id_usuario)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        const usuario = await queryAsync(
            `SELECT rol FROM Usuario WHERE id_usuario = ? LIMIT 1`,
            [id_usuario]
        );

        if (!usuario || usuario.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const rol = usuario[0]?.rol;

        if (!rol) {
            return res.status(500).json({
                success: false,
                message: 'El usuario no tiene rol asignado'
            });
        }

        let query, data;

        switch (rol.toLowerCase()) {
            case 'alumno':
                query = `SELECT a.matricula, a.nombre, u.correo, u.rol
                         FROM Alumno a
                         JOIN Usuario u ON a.id_usuario = u.id_usuario
                         WHERE a.id_usuario = ?`;
                break;

            case 'asesor':
                query = `SELECT a.nombre, u.correo, u.rol
                         FROM Asesor a
                         JOIN Usuario u ON a.id_usuario = u.id_usuario
                         WHERE a.id_usuario = ?`;
                break;

            case 'administrador':
                query = `SELECT a.nombre, u.correo, u.rol
                         FROM Administrador a
                         JOIN Usuario u ON a.id_usuario = u.id_usuario
                         WHERE a.id_usuario = ?`;
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Rol no válido'
                });
        }

        const [result] = await queryAsync(query, [id_usuario]);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Datos adicionales no encontrados'
            });
        }

        data = result;

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Error en /perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
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

// Obtener alumno por ID de usuario
router.get('/alumno/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const query = 'SELECT * FROM Alumno WHERE id_usuario = ?';
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            console.error('Error al obtener alumno:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});

// Obtener número de notificaciones
router.get('/notificaciones/unread-count/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    db.query(
        'SELECT COUNT(*) AS count FROM Notificacion WHERE id_usuario = ?',
        [id_usuario],
        (err, results) => {
            if (err) {
                console.error('Error contando notificaciones:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            res.json({ count: results[0].count });
        }
    );
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

// Registrar solicitudes en la base de datos a partir del formulario y aumentar popularidad
router.post('/solicitud', (req, res) => {
    const {
        id_usuario,
        id_alumno,
        id_materia,
        id_tema,
        fecha_solicitud,
        hora,
        modalidad,
        observaciones,
        estado
    } = req.body;

    const query = `
        INSERT INTO Solicitud (
            id_usuario, id_alumno, id_materia, id_tema,
            fecha_solicitud, hora, modalidad, observaciones,
            estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id_usuario,
        id_alumno,
        id_materia,
        id_tema,
        fecha_solicitud,
        hora,
        modalidad,
        observaciones,
        estado
    ];

    console.log(id_tema);

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar la solicitud:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        console.log('ID del tema recibido:', id_tema);

        db.query(
            'UPDATE Tema SET popularidad = popularidad + 1 WHERE id_tema = ?',
            [id_tema],
            (err2, result2) => {
                if (err2) {
                    console.error('Error al actualizar popularidad:', err2);
                    return res.status(500).json({
                        error: 'Error al aumentar popularidad del tema',
                        message: 'Solicitud creada pero no se pudo actualizar la popularidad'
                    });
                }

                res.status(201).json({
                    message: 'Solicitud creada exitosamente',
                    id: result.insertId
                });
            }
        );
    });
});

//Obtener todas las solicitudes con estado 'Pendiente'
router.get('/solicitudes-pendientes', async (req,res) => {

    try{

        const solicitudesPendientes = await queryAsync(`
            SELECT al.nombre AS alumno, m.nombre AS materia,m.imagen AS imagen, t.nombre AS tema, 
                   s.fecha_solicitud, s.hora, s.modalidad, s.observaciones,s.estado
            FROM Solicitud AS s
            JOIN Alumno AS al ON s.id_alumno = al.id_alumno
            JOIN Materia AS m ON s.id_materia = m.id_materia
            JOIN Tema AS t ON s.id_tema = t.id_tema
            WHERE s.estado = 'Pendiente'
        `);
    
        res.json({
            success: true,
            data: solicitudesPendientes
        });

    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las solicitudes'
        });
    }

});

//Verificación de contraseñas
router.post('/verify-password/:userId', async (req, res) => {
    try {
        const { currentPassword } = req.body;
        const { userId } = req.params;

        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, 'secret_key_placeholder');

        if (decoded.id !== parseInt(userId)) {
            return res.status(403).json({
                success: false,
                message: 'No autorizado'
            });
        }

        const [user] = await queryAsync(
            'SELECT contraseña FROM Usuario WHERE id_usuario = ? LIMIT 1',
            [userId]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (currentPassword !== user.contraseña) {
            return res.json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Error al verificar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

//Cambiar contraseñas
router.post('/change-password/:userId', async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { userId } = req.params;

        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, 'secret_key_placeholder');

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        await queryAsync(
            'UPDATE Usuario SET contraseña = ? WHERE id_usuario = ?',
            [newPassword, userId]
        );

        res.json({ success: true, message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

//Enviar correo con contraseña temporal
router.post('/forgot_password', async (req, res) => {
    try {
        const emailInstance = require('../mail');
        const generatePassword = require('../generate_pass')

        if (!req.is('application/json')) {
            return res.status(415).json({
                success: false,
                message: 'Se requiere Content-Type: application/json'
            });
        }

        const { email } = req.body;

        const verify = await queryAsync(
            'SELECT id_usuario FROM Usuario WHERE correo = ?;',
            [email]
        );

        if (!verify || verify.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Tu correo no está registrado.'
            });
        }

        const password = generatePassword.generatePassword()

        const results = await queryAsync(
            'UPDATE Usuario SET contraseña = ? WHERE correo = ?;',
            [password, email]
        );

        emailInstance.enviarEmail(email, password);

        res.json({ success: true, message: 'Correo enviado. Seras redirigido a iniciar sesion.' });

    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al enviar el correo'
        });
    }
})


module.exports = router;