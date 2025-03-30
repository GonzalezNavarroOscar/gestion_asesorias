const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'gestion-asesorias.cna4yyo0k2no.us-east-2.rds.amazonaws.com',
    user: 'admin', 
    password: 'GestionAsesorias',
    database: 'gestion_asesorias',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

module.exports = db;
