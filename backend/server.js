const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
const staticPath = path.join(__dirname, '../frontend');
app.use(express.static(staticPath));

// Servir imágenes desde la carpeta específica
const imagesPath = path.join(__dirname, '../frontend/images');
app.use('/images', express.static(imagesPath));

// Rutas API
app.use('/api', require('./routes/routes'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nServidor corriendo en http://localhost:${PORT}`);
});