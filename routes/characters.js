const express = require('express');
const router = express.Router();
const db = require('../db');

// Validar campos requeridos
function validateCharacter(data) {
  const required = ['nombre', 'color_piel', 'raza', 'fuerza', 'agilidad', 'magia', 'conocimiento'];
  const missing = required.filter((field) => data[field] === undefined || data[field] === '');
  return missing;
}

// Validar que las estadísticas estén entre 0 y 100
function validateStats(data) {
  const stats = ['fuerza', 'agilidad', 'magia', 'conocimiento'];
  for (const stat of stats) {
    if (data[stat] !== undefined) {
      const val = Number(data[stat]);
      if (isNaN(val) || val < 0 || val > 100) {
        return `El campo "${stat}" debe ser un número entre 0 y 100`;
      }
    }
  }
  return null;
}

// GET /api/characters — Listar todos
router.get('/', (req, res) => {
  const characters = db.getAll();
  res.json({
    success: true,
    total: characters.length,
    data: characters,
  });
});

// GET /api/characters/:id — Obtener por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const character = db.getById(id);
  if (!character) {
    return res.status(404).json({ success: false, message: `Personaje con ID ${id} no encontrado` });
  }
  res.json({ success: true, data: character });
});

// POST /api/characters — Crear personaje
router.post('/', (req, res) => {
  const missing = validateCharacter(req.body);
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Faltan los siguientes campos: ${missing.join(', ')}`,
    });
  }

  const statError = validateStats(req.body);
  if (statError) {
    return res.status(400).json({ success: false, message: statError });
  }

  const { nombre, color_piel, raza, fuerza, agilidad, magia, conocimiento } = req.body;
  const newChar = db.create({
    nombre,
    color_piel,
    raza,
    fuerza: Number(fuerza),
    agilidad: Number(agilidad),
    magia: Number(magia),
    conocimiento: Number(conocimiento),
  });

  res.status(201).json({
    success: true,
    message: 'Personaje creado exitosamente',
    data: newChar,
  });
});

// PUT /api/characters/:id — Actualizar personaje
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!db.getById(id)) {
    return res.status(404).json({ success: false, message: `Personaje con ID ${id} no encontrado` });
  }

  const statError = validateStats(req.body);
  if (statError) {
    return res.status(400).json({ success: false, message: statError });
  }

  // Convertir stats a número si vienen en el body
  const updates = { ...req.body };
  ['fuerza', 'agilidad', 'magia', 'conocimiento'].forEach((s) => {
    if (updates[s] !== undefined) updates[s] = Number(updates[s]);
  });

  const updated = db.update(id, updates);
  res.json({
    success: true,
    message: 'Personaje actualizado exitosamente',
    data: updated,
  });
});

// DELETE /api/characters/:id — Eliminar personaje
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = db.delete(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: `Personaje con ID ${id} no encontrado` });
  }
  res.json({ success: true, message: `Personaje con ID ${id} eliminado exitosamente` });
});

module.exports = router;
