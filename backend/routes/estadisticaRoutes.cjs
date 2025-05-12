const express = require('express');
const router = express.Router();
const {
  crearEstadisticasUsuario,
  obtenerEstadisticasUsuario,
  actualizarEstadisticasUsuario,
  eliminarEstadisticasUsuario
} = require('../controllers/EstadisticaController.cjs');

router.post('/', crearEstadisticasUsuario);
router.get('/:uid', obtenerEstadisticasUsuario);
router.put('/:uid', actualizarEstadisticasUsuario);
router.delete('/:uid', eliminarEstadisticasUsuario);

module.exports = router;