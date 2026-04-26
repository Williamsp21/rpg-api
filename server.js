const express = require('express');
const app = express();

app.use(express.json());

// Rutas
const charactersRouter = require('./routes/characters');
const battlesRouter = require('./routes/battles');

app.use('/api/characters', charactersRouter);
app.use('/api/battles', battlesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'RPG Battle API - Actividad 10',
    endpoints: {
      characters: {
        'GET /api/characters': 'Listar todos los personajes',
        'GET /api/characters/:id': 'Obtener personaje por ID',
        'POST /api/characters': 'Crear personaje',
        'PUT /api/characters/:id': 'Actualizar personaje',
        'DELETE /api/characters/:id': 'Eliminar personaje',
      },
      battles: {
        'POST /api/battles': 'Simular batalla entre dos personajes',
      },
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n  RPG API corriendo en http://localhost:${PORT}`);
  console.log(`  Documentación: http://localhost:${PORT}/\n`);
});
