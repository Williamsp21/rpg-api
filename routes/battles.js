const express = require('express');
const router = express.Router();
const db = require('../db');


function calcularPuntaje(personaje) {
  const danoFisico = personaje.fuerza * 0.35;
  const evasion = personaje.agilidad * 0.20;
  const ataqueMagico = personaje.magia * 0.25;
  const bonusEstrategia = personaje.conocimiento * 0.20;

  const puntajeBase = danoFisico + evasion + ataqueMagico + bonusEstrategia;

  // Factor suerte: número entre 0.90 y 1.10
  const suerte = 0.90 + Math.random() * 0.20;
  const puntajeFinal = +(puntajeBase * suerte).toFixed(2);

  return {
    danoFisico: +danoFisico.toFixed(2),
    evasion: +evasion.toFixed(2),
    ataqueMagico: +ataqueMagico.toFixed(2),
    bonusEstrategia: +bonusEstrategia.toFixed(2),
    puntajeBase: +puntajeBase.toFixed(2),
    factorSuerte: +suerte.toFixed(4),
    puntajeFinal,
  };
}

function simularBatalla(p1, p2) {
  const stats1 = calcularPuntaje(p1);
  const stats2 = calcularPuntaje(p2);

  let ganador = null;
  let resultado = '';

  if (stats1.puntajeFinal > stats2.puntajeFinal) {
    ganador = p1;
    resultado = `¡${p1.nombre} derrota a ${p2.nombre} con un puntaje de combate superior!`;
  } else if (stats2.puntajeFinal > stats1.puntajeFinal) {
    ganador = p2;
    resultado = `¡${p2.nombre} derrota a ${p1.nombre} con un puntaje de combate superior!`;
  } else {
    // Empate: gana quien tenga más fuerza
    ganador = p1.fuerza >= p2.fuerza ? p1 : p2;
    resultado = `¡Empate en puntaje! ${ganador.nombre} gana por mayor fuerza bruta.`;
  }

  return {
    ganador: {
      id: ganador.id,
      nombre: ganador.nombre,
      raza: ganador.raza,
    },
    resultado,
    detalle: {
      [p1.nombre]: {
        atributos: { fuerza: p1.fuerza, agilidad: p1.agilidad, magia: p1.magia, conocimiento: p1.conocimiento },
        combate: stats1,
      },
      [p2.nombre]: {
        atributos: { fuerza: p2.fuerza, agilidad: p2.agilidad, magia: p2.magia, conocimiento: p2.conocimiento },
        combate: stats2,
      },
    },
    formula: {
      descripcion: 'Puntaje = (Fuerza×0.35) + (Agilidad×0.20) + (Magia×0.25) + (Conocimiento×0.20), luego ×FactorSuerte(0.90~1.10)',
    },
  };
}

// POST /api/battles
router.post('/', (req, res) => {
  const { personaje1_id, personaje2_id } = req.body;

  if (!personaje1_id || !personaje2_id) {
    return res.status(400).json({
      success: false,
      message: 'Debes enviar "personaje1_id" y "personaje2_id" en el body',
    });
  }

  const id1 = parseInt(personaje1_id);
  const id2 = parseInt(personaje2_id);

  if (id1 === id2) {
    return res.status(400).json({
      success: false,
      message: 'Los dos personajes deben ser diferentes',
    });
  }

  const p1 = db.getById(id1);
  const p2 = db.getById(id2);

  if (!p1) return res.status(404).json({ success: false, message: `Personaje con ID ${id1} no encontrado` });
  if (!p2) return res.status(404).json({ success: false, message: `Personaje con ID ${id2} no encontrado` });

  const batalla = simularBatalla(p1, p2);

  res.json({
    success: true,
    message: '¡Batalla completada!',
    ...batalla,
  });
});

module.exports = router;
