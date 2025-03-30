const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const authRoutes = require('./routes/authRoutes');

app.use(cors());

app.use(bodyParser.json());

app.use('/api', authRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
