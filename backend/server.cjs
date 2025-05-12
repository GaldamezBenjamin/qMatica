const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors'); // Habilitar CORS (importante para React)
const preguntaRoutes = require('./routes/preguntaRoutes.cjs');
const usuarioRoutes = require('./routes/usuarioRoutes.cjs');
const foroRoutes = require('./routes/foroRoutes.cjs');
const estadisticaRoutes = require('./routes/estadisticaRoutes.cjs');
const quizRoutes = require('./routes/quizRoutes.cjs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Habilita CORS para todas las rutas
app.use(bodyParser.json()); // Para analizar el cuerpo de las solicitudes JSON

app.use('/api/preguntas', preguntaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/foros', foroRoutes);
app.use('/api/estadisticas', estadisticaRoutes);
app.use('/api/quizzes', quizRoutes);

app.listen(port, () => {
  console.log(`Server has started on port: ${port}`);
});