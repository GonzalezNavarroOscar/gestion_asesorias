const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();


/*
*
* [###### Funciones de apoyo ######]
*
*/

// Helper para ejecutar queries con promesas
function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../frontend/images'));
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const filename = Date.now() + fileExtension;
        cb(null, filename);
    }
});

const upload = multer({ storage });

/*
*
* [###### Rutas de autenticación y registro ######]
*
*/

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
                { id: user.id_usuario, email: user.correo, rol: user.rol },
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

        const token = jwt.sign(
            {
                id: roles[0].id_usuario,
                email: roles[0].correo,
                rol: roles[0].rol
            },
            'secret_key_placeholder',
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            message: 'Múltiples roles encontrados',
            multipleRoles: true,
            roles,
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


/*
*
* [###### Rutas de perfil del usuario ######]
*
*/

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


/*
*
* [###### Rutas para manejo de materias ######]
*
*/

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

// Ruta para agregar una nueva materia
router.post('/agregar-materias', upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion } = req.body;
    const imagen = `images/${req.file.filename}`;
    const popularidad = 0;

    try {
        await queryAsync(
            'INSERT INTO Materia (nombre, descripción, imagen, popularidad) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, imagen, popularidad]
        );
        res.json({ success: true, message: 'Materia agregada exitosamente' });
    } catch (error) {
        console.error('Error al agregar materia:', error);
        res.status(500).json({ success: false, message: 'Error al agregar materia' });
    }
});


/*
*
* [###### Rutas para manejo de temas ######]
*
*/

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
             WHERE M.nombre = ? AND T.agregado_admin = 1;`,
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

// Ruta para agregar un nuevo tema 
router.post('/agregar-temas', async (req, res) => {
    const { id_materia, nombre, descripcion, agregado_admin } = req.body;
    const popularidad = 0;
    const agregado = agregado_admin ? 1 : 0;

    try {
        const tema = await queryAsync(`SELECT id_tema FROM Tema WHERE nombre = ?;`, [nombre])
        if (tema.length == 0) {
            await queryAsync(
                'INSERT INTO Tema (nombre, descripción, popularidad,id_materia,agregado_admin) VALUES (?, ?, ?, ?, ?)',
                [nombre, descripcion, popularidad, id_materia, agregado]
            );
            res.json({ success: true, message: 'Tema agregado exitosamente' });
        } else {
            res.json({ success: false, message: 'El tema ya existe' });
        }
    } catch (error) {
        console.error('Error al agregar tema:', error);
        res.status(500).json({ success: false, message: 'Error al agregar tema' });
    }
});

/*
*
* [###### Rutas para manejo de solicitudes ######]
*
*/

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

//Insertar solicitudes personalizadas
router.post('/solicitud_personalizada', async (req, res) => {
    const {
        id_usuario,
        id_alumno,
        id_materia,
        nombre_tema,
        fecha_solicitud,
        hora,
        modalidad,
        observaciones,
        estado
    } = req.body;

    await queryAsync(
        `INSERT INTO Solicitud (
            id_usuario, id_alumno, id_materia, id_tema,
            fecha_solicitud, hora, modalidad, observaciones,
            estado
        ) VALUES (?, ?, ?,
            (SELECT id_tema FROM Tema WHERE nombre = ? LIMIT 1),
            ?, ?, ?, ?, ?
        );`,
        [id_usuario, id_alumno, id_materia, nombre_tema, fecha_solicitud, hora, modalidad, observaciones, estado]
    );

    res.status(200).json({ message: 'Solicitud insertada correctamente' });
});


//Obtener todas las solicitudes con estado 'Pendiente'
router.get('/solicitudes-pendientes', async (req, res) => {

    try {

        const solicitudesPendientes = await queryAsync(`
            SELECT s.id_solicitud,al.id_alumno,al.nombre AS alumno,m.id_materia, m.nombre AS materia,m.imagen AS imagen,t.id_tema, t.nombre AS tema, 
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

//Obtener detalles de solicitudes específicas
router.get('/solicitudes/:id_solicitud', async (req, res) => {

    const { id_solicitud } = req.params

    try {

        const solicitud = await queryAsync(`
            SELECT s.id_solicitud,al.id_alumno,al.nombre AS alumno,al.matricula,m.id_materia, m.nombre AS materia,m.imagen AS imagen,t.id_tema, t.nombre AS tema, 
                   s.fecha_solicitud, s.hora, s.modalidad, s.observaciones,s.estado
            FROM Solicitud AS s
            JOIN Alumno AS al ON s.id_alumno = al.id_alumno
            JOIN Materia AS m ON s.id_materia = m.id_materia
            JOIN Tema AS t ON s.id_tema = t.id_tema
            WHERE s.id_solicitud = ?
        `, [id_solicitud]);

        res.json({
            success: true,
            data: solicitud
        });

    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las solicitudes'
        });
    }

});

//Solicitar solicitudes para el home de alumno
router.get('/solicitudes_alumno/:id_usuario', async (req, res) => {

    const { id_usuario } = req.params

    try {

        const solicitud = await queryAsync(`
             SELECT Solicitud.id_solicitud, Solicitud.fecha_solicitud, Solicitud.estado, Solicitud.hora, Solicitud.modalidad, Solicitud.observaciones, Tema.nombre AS tema, Materia.nombre AS materia
                FROM Solicitud 
                JOIN Tema ON Tema.id_tema = Solicitud.id_tema
                JOIN Materia ON Materia.id_materia = Solicitud.id_materia
                WHERE Solicitud.id_usuario = ?;
        `, [id_usuario]);

        res.json({
            success: true,
            data: solicitud
        });

    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las solicitudes'
        });
    }

});


/*
*
* [###### Rutas para manejo de asesorías ######]
*
*/

// Registrar asesorias en la base de datos a partir del formulario y enviar notificación
router.post('/asesoria', (req, res) => {
    const {
        id_solicitud,
        id_usuario,
        id_alumno,
        id_asesor,
        id_materia,
        id_tema,
        nombre_tema,
        fecha_solicitud,
        hora,
        estado,
        aula,
        modalidad
    } = req.body;

    const query = `
        INSERT INTO Asesoria (
            id_alumno, id_asesor, id_materia, id_tema,
            fecha, hora, estado, aula, modalidad
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id_alumno,
        id_asesor,
        id_materia,
        id_tema,
        fecha_solicitud,
        hora,
        estado,
        aula,
        modalidad
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar la asesoría:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const id_asesoria = result.insertId;

        //Actualización de el estado de la Solicitud
        db.query(
            `UPDATE Solicitud SET estado = 'Aceptada' WHERE id_solicitud = ?`,
            [id_solicitud],
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

        // Crear el chat asociado a la asesoría
        db.query(
            `INSERT INTO Chat (id_asesoria,id_alumno,id_asesor) VALUES (?, ?, ?)`,
            [id_asesoria, id_alumno, id_asesor],
            (err3) => {
                if (err3) console.error('Error al crear chat:', err3);
            }
        );

        //Parámetros para la Notificación
        const tipo = 'Solicitud Aceptada';
        const mensaje = `Tu solicitud de Asesoría de ${nombre_tema} ha sido aceptada.`;
        const fecha_envio = new Date();
        const estado = 'Enviada';

        db.query(
            `INSERT INTO Notificacion (id_usuario, tipo, mensaje, fecha_envio, estado) VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, tipo, mensaje, fecha_envio, estado],
            (err4) => {
                if (err4) console.error('Error al insertar notificación:', err4);
            }
        );

    });
});

// Modificar asesoría a partir del formulario y enviar notificación
router.put('/modificar-asesoria/:id_asesoria', (req, res) => {

    const { id_asesoria } = req.params;

    const {
        id_alumno,
        id_asesor,
        id_materia,
        id_tema,
        nombre_tema,
        fecha,
        hora,
        aula,
        modalidad
    } = req.body;

    const query = `
    UPDATE Asesoria SET
        id_alumno = ?,
        id_asesor = ?,
        id_materia = ?,
        id_tema = ?,
        fecha = ?,
        hora = ?,
        aula = ?,
        modalidad = ?
    WHERE id_asesoria = ?
    `;

    const values = [
        id_alumno,
        id_asesor,
        id_materia,
        id_tema,
        fecha,
        hora,
        aula,
        modalidad
    ];

    db.query(query, [...values, id_asesoria], (err, result) => {
        if (err) {
            console.error('Error al actualizar la asesoría:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        db.query('SELECT id_usuario FROM Alumno WHERE id_alumno = ?', [id_alumno], (err, alumnoResult) => {
            if (err) {
                console.error('Error al obtener id_usuario del alumno:', err);
                return res.status(500).json({ error: 'Error al obtener id_usuario del alumno' });
            }

            const id_usuario_alumno = alumnoResult[0]?.id_usuario;

            if (!id_usuario_alumno) {
                console.error('No se encontró el id_usuario para el alumno');
                return res.status(500).json({ error: 'No se encontró el id_usuario para el alumno' });
            }

            db.query('SELECT id_usuario FROM Asesor WHERE id_asesor = ?', [id_asesor], (err, asesorResult) => {
                if (err) {
                    console.error('Error al obtener id_usuario del asesor:', err);
                    return res.status(500).json({ error: 'Error al obtener id_usuario del asesor' });
                }

                const id_usuario_asesor = asesorResult[0]?.id_usuario;

                if (!id_usuario_asesor) {
                    console.error('No se encontró el id_usuario para el asesor');
                    return res.status(500).json({ error: 'No se encontró el id_usuario para el asesor' });
                }

                // Parámetros para la Notificación
                const tipo = 'Asesoría Modificada';
                const mensaje = `Tu Asesoría de ${nombre_tema} fue modificada por el administrador. Revísala`;
                const fecha_envio = new Date();
                const estado = 'Enviada';

                db.query(
                    `INSERT INTO Notificacion (id_usuario, tipo, mensaje, fecha_envio, estado) VALUES (?, ?, ?, ?, ?)`,
                    [id_usuario_alumno, tipo, mensaje, fecha_envio, estado],
                    (err4) => {
                        if (err4) console.error('Error al insertar notificación para el alumno:', err4);
                    }
                );

                db.query(
                    `INSERT INTO Notificacion (id_usuario, tipo, mensaje, fecha_envio, estado) VALUES (?, ?, ?, ?, ?)`,
                    [id_usuario_asesor, tipo, mensaje, fecha_envio, estado],
                    (err4) => {
                        if (err4) console.error('Error al insertar notificación para el asesor:', err4);
                    }
                );

                res.json({ success: true, message: 'Asesoría modificada y notificaciones enviadas' });
            });
        });
    });
});


//Obtener todas las asesorias con estado 'En proceso'
router.get('/asesorias-proceso', async (req, res) => {

    try {

        const asesoriasProceso = await queryAsync(`
            SELECT a.id_asesoria,al.nombre AS alumno, m.nombre AS materia,t.nombre AS tema, 
                   a.fecha, a.hora, a.estado,a.modalidad
            FROM Asesoria AS a
            JOIN Alumno AS al ON al.id_alumno = a.id_alumno
            JOIN Materia AS m ON a.id_materia = m.id_materia
            JOIN Tema AS t ON a.id_tema = t.id_tema
            WHERE a.estado = 'En proceso'
        `);

        res.json({
            success: true,
            data: asesoriasProceso
        });

    } catch (error) {
        console.error('Error al obtener Asesorias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las Asesorias'
        });
    }

});

//Obtener detalles de asesorías específicas
router.get('/detalles-asesoria/:id_asesoria', async (req, res) => {

    const { id_asesoria } = req.params

    try {

        const asesoria = await queryAsync(`
            SELECT a.id_asesoria,al.id_alumno,al.nombre AS alumno,ase.id_asesor,ase.nombre as asesor,a.id_materia, m.nombre AS materia,a.id_tema, t.nombre AS tema, a.fecha, a.hora, a.estado,a.modalidad,a.aula
            FROM Asesoria AS a
            JOIN Alumno AS al ON al.id_alumno = a.id_alumno
            JOIN Asesor AS ase ON ase.id_asesor = a.id_asesor
            JOIN Materia AS m ON a.id_materia = m.id_materia
            JOIN Tema AS t ON a.id_tema = t.id_tema
            WHERE a.id_asesoria = ?`, [id_asesoria]);

        res.json({
            success: true,
            data: asesoria
        });

    } catch (error) {
        console.error('Error al obtener asesoria:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la asesoria'
        });
    }

});

//Eliminar asesorías por ID y enviar notificaciones.
router.delete('/eliminar-asesorias/:id_asesoria', async (req, res) => {
    const { id_asesoria } = req.params;

    try {
        const asesoria = await queryAsync(`
            SELECT a.id_asesoria, a.id_alumno, al.id_usuario AS id_usuario_alumno, al.nombre AS alumno,
                   a.id_asesor, ase.id_usuario AS id_usuario_asesor, ase.nombre AS asesor,
                   m.nombre AS materia, t.nombre AS tema,
                   a.fecha, a.hora, a.estado, a.modalidad, a.aula
            FROM Asesoria AS a
            JOIN Alumno AS al ON al.id_alumno = a.id_alumno
            JOIN Asesor AS ase ON ase.id_asesor = a.id_asesor
            JOIN Materia AS m ON a.id_materia = m.id_materia
            JOIN Tema AS t ON a.id_tema = t.id_tema
            WHERE a.id_asesoria = ?`, [id_asesoria]);

        if (!asesoria || asesoria.length === 0) {
            return res.status(404).json({ message: 'Asesoría no encontrada' });
        }

        const datos = asesoria[0];

        await queryAsync('DELETE FROM Chat WHERE id_asesoria = ?', [id_asesoria]);

        await queryAsync('DELETE FROM Asesoria WHERE id_asesoria = ?', [id_asesoria]);

        const tipo = 'Asesoría Cancelada';
        const mensaje = `Tu asesoría de ${datos.tema} fue cancelada por el administrador. Lo sentimos mucho.`;
        const fecha_envio = new Date();
        const estado = 'Enviada';

        await queryAsync(`INSERT INTO Notificacion (id_usuario, tipo, mensaje, fecha_envio, estado) VALUES (?, ?, ?, ?, ?)`,
            [datos.id_usuario_alumno, tipo, mensaje, fecha_envio, estado]);

        await queryAsync(`INSERT INTO Notificacion (id_usuario, tipo, mensaje, fecha_envio, estado) VALUES (?, ?, ?, ?, ?)`,
            [datos.id_usuario_asesor, tipo, mensaje, fecha_envio, estado]);

        res.json({
            success: true,
            message: 'Asesoría eliminada correctamente',
            data: datos
        });

    } catch (err) {
        console.error('Error al eliminar asesoría:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


/*
*
* [###### Rutas para manejo de notificaciones ######]
*
*/

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


/*
*
* [###### Rutas para manejo de chats y mensajes ######]
*
*/

// Obtener chats por ID de usuario
router.get('/chats/:id_usuario', (req, res) => {

    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ success: false, message: 'ID de usuario requerido' });
    }

    const getUserRoleQuery = `SELECT rol FROM Usuario WHERE id_usuario = ?`;

    db.query(getUserRoleQuery, [id_usuario], (err, roleResult) => {
        if (err || roleResult.length === 0) {
            return res.status(500).json({ success: false, message: 'No se pudo obtener el rol del usuario' });
        }

        const rol = roleResult[0].rol;

        let getIdQuery, chatQuery;

        if (rol === 'alumno') {
            getIdQuery = `SELECT id_alumno AS id FROM Alumno WHERE id_usuario = ?`;
            chatQuery = `SELECT 
                        Chat.*, 
                        Tema.nombre AS tema,
                        Asesoria.aula AS aula, 
                        Asesoria.modalidad,
                        Asesor.nombre,
                        m.contenido AS ultimo_mensaje,
                        m.fecha AS fecha_mensaje,
                        m.hora AS hora_mensaje
                    FROM Chat
                    JOIN Asesoria ON Chat.id_asesoria = Asesoria.id_asesoria
                    JOIN Asesor ON Asesoria.id_asesor = Asesor.id_asesor
                    JOIN Tema ON Asesoria.id_tema = Tema.id_tema
                    LEFT JOIN (
                        SELECT m1.*
                        FROM Mensaje m1
                        JOIN (
                            SELECT id_chat, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora
                            FROM Mensaje
                            GROUP BY id_chat
                        ) m2 ON m1.id_chat = m2.id_chat AND CONCAT(m1.fecha, ' ', m1.hora) = m2.max_fecha_hora
                    ) m ON Chat.id_chat = m.id_chat
                    WHERE Chat.id_alumno = ?
                    `;
        } else if (rol === 'asesor') {
            getIdQuery = `SELECT id_asesor AS id FROM Asesor WHERE id_usuario = ?`;
            chatQuery = `SELECT 
                        Chat.*, 
                        Tema.nombre AS tema,
                        asesoria1.aula AS aula, 
                        asesoria1.modalidad,
                        Alumno.nombre,
                        m.contenido AS ultimo_mensaje,
                        m.fecha AS fecha_mensaje,
                        m.hora AS hora_mensaje
                    FROM Chat
                    JOIN Asesoria AS asesoria1 ON Chat.id_asesoria = asesoria1.id_asesoria
                    JOIN Alumno ON asesoria1.id_alumno = Alumno.id_alumno
                    JOIN Tema ON asesoria1.id_tema = Tema.id_tema
                    LEFT JOIN (
                        SELECT m1.*
                        FROM Mensaje m1
                        JOIN (
                            SELECT id_chat, MAX(CONCAT(fecha, ' ', hora)) AS max_fecha_hora
                            FROM Mensaje
                            GROUP BY id_chat
                        ) m2 ON m1.id_chat = m2.id_chat AND CONCAT(m1.fecha, ' ', m1.hora) = m2.max_fecha_hora
                    ) m ON Chat.id_chat = m.id_chat
                    WHERE Chat.id_asesor = ?
                    `;
        }
        else {
            return res.status(400).json({ error: 'Rol de usuario no válido para chats' });
        }

        db.query(getIdQuery, [id_usuario], (err2, idResult) => {
            if (err2 || idResult.length === 0) {
                return res.status(500).json({ error: 'No se pudo obtener ID del usuario' });
            }

            const id = idResult[0].id;

            db.query(chatQuery, [id], (err3, chats) => {
                if (err3) {
                    return res.status(500).json({ success: false, message: 'Error al obtener los chats' });
                }

                res.json({ success: true, data: chats, rol: rol });
            });
        });
    });
});

//insertar mensaje
router.post('/agregar-mensaje', async (req, res) => {
    const { id_chat, mensaje, id_remitente } = req.body;

    try {
        await queryAsync(
            'INSERT INTO Mensaje (id_chat,contenido,id_remitente) VALUES (?,?,?)',
            [id_chat, mensaje, id_remitente]
        );
        res.json({ success: true, message: 'Materia agregada exitosamente' });
    } catch (error) {
        console.error('Error al agregar materia:', error);
        res.status(500).json({ success: false, message: 'Error al agregar materia' });
    }
});

//Mostrar todos los mensajes de un chat 
router.post('/mostrar-mensajes', async (req, res) => {
    const { id_chat } = req.body;

    try {
        const result = await queryAsync(
            'SELECT contenido,fecha,hora,id_remitente FROM Mensaje WHERE id_chat = ?;',
            [id_chat]
        );
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error al agregar materia:', error);
        res.status(500).json({ success: false, message: 'Error al agregar materia' });
    }
});

/*
*
* [###### Rutas para manejo de horarios ######]
*
*/

//Ingresar horario de asesor
router.post('/horario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const horarios = req.body.horarios;

    if (!Array.isArray(horarios)) {
        return res.status(400).json({ success: false, message: 'Formato inválido' });
    }

    try {

        const [asesorRows] = await queryAsync(
            'SELECT id_asesor FROM Asesor WHERE id_usuario = ?', [id_usuario]
        );

        if (asesorRows.length === 0) {
            console.log(`No se encontró un asesor con id_usuario: ${id_usuario}`);
            return res.status(404).json({ success: false, message: 'No se encontró un asesor con ese id_usuario.' });
        }

        await queryAsync(
            `DELETE FROM Horario WHERE id_asesor = ?`,
            [asesorRows.id_asesor]
        );

        for (const h of horarios) {
            await queryAsync(`
                INSERT INTO Horario (horario_inicio, horario_fin, dia_inicio, dia_fin, id_asesor)
                VALUES (?, ?, ?, ?, ?)
            `, [h.inicio, h.fin, h.dia, h.dia, asesorRows.id_asesor]);
        }

        res.json({ success: true, message: 'Horarios guardados correctamente' });
    } catch (error) {
        console.error('Error al guardar horarios:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

//consultar horarios
router.get('/consultar_horario/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {

        const [asesorRows] = await queryAsync(
            'SELECT id_asesor FROM Asesor WHERE id_usuario = ?', [id_usuario]
        );

        const horario = await queryAsync(`
            SELECT * FROM Horario WHERE id_asesor = ?;
        `, [asesorRows.id_asesor]);

        res.json({
            success: true,
            data: horario
        });

    } catch (error) {
        console.error('Error al consultar horarios:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

//insertar especialidades de asesor
router.post('/insertar_especialidades/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const especialidades = req.body.especialidades;

    try {

        await queryAsync(`
            UPDATE Asesor SET especialidad = ? WHERE id_usuario = ?;
        `, [especialidades, id_usuario]);

        res.json({
            success: true,
            message: 'Completado'
        });

    } catch (error) {
        console.error('Error al consultar horarios:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

//consultar especialidades del asesor
router.get('/consultar_especialidades/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {

        const especialidades = await queryAsync(`
            SELECT especialidad FROM Asesor WHERE id_usuario = ?;
        `, [id_usuario]);

        res.json({
            success: true,
            data: especialidades
        });

    } catch (error) {
        console.error('Error al consultar horarios:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});


/*
*
* [###### Rutas para manejo de reportes ######]
*
*/

// Registrar reportes, cambiar el estado de las asesorías y enviar notificación
router.post('/generar-reporte', (req, res) => {
    const {
        id_asesoria,
        nombre,
        descripcion,
        fecha,
        hora_inicial,
        hora_final,
        total_horas,
        porcentaje,
        estado_asesoria,
        id_asesor,
        id_alumno,
        id_materia,
        id_tema,
        id_usuario,
        nombre_tema
    } = req.body;

    const query = `
        INSERT INTO Reporte (
            id_asesoria, nombre, descripción, fecha, 
            hora_inicial, hora_final, total_horas, porcentaje, 
            estado_asesoria, id_asesor, id_alumno, id_materia, id_tema
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id_asesoria,
        nombre,
        descripcion,
        fecha,
        hora_inicial,
        hora_final,
        total_horas,
        porcentaje,
        estado_asesoria,
        id_asesor,
        id_alumno,
        id_materia,
        id_tema
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar la reporte:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        console.log(estado_asesoria, porcentaje);

        if (estado_asesoria === "Completada" && parseInt(porcentaje) === 100) {

            db.query(
                `UPDATE Asesoria SET estado = 'Completada' WHERE id_asesoria = ?`,
                [id_asesoria],
                (err2, result2) => {
                    if (err2) {
                        console.error('Error al actualizar asesoria:', err2);
                        return res.status(500).json({
                            error: 'Error al actualizar el estado de la asesoria',
                            message: 'Solicitud creada pero no se pudo actualizar la asesoria'
                        });
                    }

                    res.status(201).json({
                        message: 'Asesoria finalizada exitosamente',
                        id: result.insertId
                    });
                }
            );

        }

        //Parámetros para la Notificación
        const tipo = 'Asesoria Finalizada';
        const mensaje = `Felicidades por finalizar tu asesoría en ${nombre_tema}!!`;
        const fecha_envio = new Date();
        const estado = 'Enviada';

        db.query(
            `INSERT INTO Notificacion (id_usuario, tipo, mensaje, fecha_envio, estado) VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, tipo, mensaje, fecha_envio, estado],
            (err4) => {
                if (err4) console.error('Error al insertar notificación:', err4);
            }
        );

    });
});

//Obtener detalles de asesorias específicas para reportes
router.get('/reportes/:id_asesoria', async (req, res) => {

    const { id_asesoria } = req.params

    try {

        const asesoria = await queryAsync(`
            SELECT a.id_asesoria,al.id_alumno,al.nombre AS alumno,ase.id_asesor,ase.nombre AS asesor,m.id_materia, m.nombre AS materia,t.id_tema,t.nombre AS tema, a.fecha, a.hora
            FROM Asesoria AS a
            JOIN Alumno AS al ON al.id_alumno = a.id_alumno
            JOIN Asesor AS ase ON a.id_asesor = ase.id_asesor
            JOIN Materia AS m ON a.id_materia = m.id_materia
            JOIN Tema AS t ON a.id_tema = t.id_tema
            WHERE a.id_asesoria = ?
        `, [id_asesoria]);

        res.json({
            success: true,
            data: asesoria
        });

    } catch (error) {
        console.error('Error al obtener asesoria:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la asesoria'
        });
    }

});

//Obtener detalles de reportes usando el id del usuario
router.get('/ver-reportes/:id_usuario', async (req, res) => {

    const { id_usuario } = req.params

    try {

        const id_asesor_result = await queryAsync(`SELECT id_asesor FROM Asesor WHERE id_usuario = ?`, [id_usuario]);

        if (id_asesor_result.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const id_asesor = id_asesor_result[0].id_asesor;

        const reporte = await queryAsync(`
            SELECT id_reporte,nombre,descripción,fecha,porcentaje,estado_asesoria FROM Reporte WHERE id_asesor = ?
        `, [id_asesor]);

        res.json({
            success: true,
            data: reporte
        });

    } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los reportes'
        });
    }

});

//Borrar reportes usando el ID
router.delete('/eliminar-reportes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await queryAsync(`DELETE FROM Reporte WHERE id_reporte = ?`, [id]);
        res.json({ success: true, message: 'Reporte eliminado' });
    } catch (error) {
        console.error('Error al eliminar el reporte:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el reporte' });
    }
});

/*
*
* [###### Rutas para manejo de información de usuarios ######]
*
*/

// Obtener todos los usuarios con nombre
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await queryAsync(
            `SELECT 
                u.id_usuario,
                a.nombre AS alumno,
                ase.nombre AS asesor,
                u.correo,
                u.rol
            FROM Usuario u
            LEFT JOIN Alumno a ON u.id_usuario = a.id_usuario
            LEFT JOIN Asesor ase ON u.id_usuario = ase.id_usuario
            WHERE u.rol IN ('alumno', 'asesor')`
        );

        res.json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios'
        });
    }
});

// Eliminar usuarios por ID
router.delete('/borrar-usuario/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await queryAsync(`DELETE FROM Usuario WHERE id_usuario = ?`, [userId]);
        res.json({ success: true, message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar el Usuario:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el Usuario' });
    }
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

// Obtener asesor por ID de usuario
router.get('/asesor/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const query = 'SELECT * FROM Asesor WHERE id_usuario = ?';
    db.query(query, [id_usuario], (err, results) => {
        if (err) {
            console.error('Error al obtener asesor:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });
});



/*
*
* [###### Rutas para manejo de estadísticas ######]
*
*/

//Ruta para obtener el total de algunos campos para estadísticas
router.get('/estadisticas-contadores', async (req, res) => {
    try {
        const usuariosResult = await queryAsync('SELECT COUNT(*) AS total_usuarios FROM Usuario');
        const asesoriasResult = await queryAsync('SELECT COUNT(*) AS total_asesorias FROM Asesoria');
        const materiasResult = await queryAsync('SELECT COUNT(*) AS total_materias FROM Materia');
        const temasResult = await queryAsync('SELECT COUNT(*) AS total_temas FROM Tema');

        res.json({
            success: true,
            data: {
                usuarios: usuariosResult[0].total_usuarios,
                asesorias: asesoriasResult[0].total_asesorias,
                materias: materiasResult[0].total_materias,
                temas: temasResult[0].total_temas
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
    }
});

//Ruta para estadísticas de usuarios activos por rol
router.get('/estadisticas-usuarios-activos', async (req, res) => {
    try {
        // Número de alumnos
        const alumnosResult = await queryAsync('SELECT COUNT(*) AS total_alumnos FROM Usuario WHERE rol = "alumno"');
        // Número de asesores
        const asesoresResult = await queryAsync('SELECT COUNT(*) AS total_asesores FROM Usuario WHERE rol = "asesor"');
        // Número de administradores
        const administradoresResult = await queryAsync('SELECT COUNT(*) AS total_administradores FROM Usuario WHERE rol = "administrador"');

        res.json({
            success: true,
            data: {
                alumnos: alumnosResult[0].total_alumnos,
                asesores: asesoresResult[0].total_asesores,
                administradores: administradoresResult[0].total_administradores
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de usuarios activos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas de usuarios activos' });
    }
});

//Ruta para estadísticas de asesorías en el último mes
router.get('/estadisticas-asesorias-ultimo-mes', async (req, res) => {
    try {
        // Asesorías realizadas en el último mes
        const asesoriasUltimoMesResult = await queryAsync('SELECT COUNT(*) AS total_asesorias_ultimo_mes FROM Asesoria WHERE fecha >= CURDATE() - INTERVAL 1 MONTH');

        res.json({
            success: true,
            data: {
                asesoriasUltimoMes: asesoriasUltimoMesResult[0].total_asesorias_ultimo_mes
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de asesorías en el último mes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas de asesorías en el último mes' });
    }
});

router.get('/estadisticas-asesorias-por-materia', async (req, res) => {
    try {
        const popularidadPorMateriaResult = await queryAsync(`
            SELECT 
                id_materia,
                nombre AS materia,
                popularidad
            FROM 
                Materia
            WHERE
                popularidad > 0
            ORDER BY 
                popularidad DESC
        `);

        console.log(popularidadPorMateriaResult);

        res.json({
            success: true,
            data: popularidadPorMateriaResult
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de popularidad por materia:', error);
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas de popularidad por materia' });
    }
});
// Ruta para estadísticas de modalidades más utilizadas
router.get('/estadisticas-modalidades', async (req, res) => {
    try {
        const modalidadesResult = await queryAsync(`
            SELECT modalidad, COUNT(*) AS total
            FROM Asesoria
            GROUP BY modalidad
            ORDER BY total DESC
        `);

        res.json({
            success: true,
            data: modalidadesResult
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de modalidades:', error);
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas de modalidades' });
    }
});




/*
*
* [###### Rutas para manejo de contraseñas ######]
*
*/

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
router.post('/change-password/:correo', async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { correo } = req.params;

        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, 'secret_key_placeholder');

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        await queryAsync(
            'UPDATE Usuario SET contraseña = ? WHERE correo = ?',
            [newPassword, correo]
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

/*
*
* [###### Exportación del módulo ######]
*
*/
module.exports = router;