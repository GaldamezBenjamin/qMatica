const express = require('express');
const router = express.Router();
const {
  crearPregunta,
  obtenerPreguntas,
  obtenerPregunta,
  actualizarPregunta,
  eliminarPregunta
} = require('../controllers/PreguntaController.cjs');

router.post('/', crearPregunta);
router.get('/', obtenerPreguntas);
router.get('/:id', obtenerPregunta);
router.put('/:id', actualizarPregunta);
router.delete('/:id', eliminarPregunta);

module.exports = router;