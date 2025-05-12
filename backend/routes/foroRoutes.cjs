const express = require('express');
const router = express.Router();
const {
  crearForo,
  obtenerForos,
  obtenerForo,
  actualizarForo,
  eliminarForo,
  crearMensajeForo,
  obtenerMensajesForo,
  obtenerMensajeForo,
  actualizarMensajeForo,
  eliminarMensajeForo
} = require('../controllers/ForoController.cjs');

router.post('/', crearForo);
router.get('/', obtenerForos);
router.get('/:id_foro', obtenerForo);
router.put('/:id_foro', actualizarForo);
router.delete('/:id_foro', eliminarForo);

// Rutas para la subcolección Mensajes_Foro
router.post('/:id_foro/mensajes_foro', crearMensajeForo);
router.get('/:id_foro/mensajes_foro', obtenerMensajesForo);
router.get('/:id_foro/mensajes_foro/:id_mensaje', obtenerMensajeForo);
router.put('/:id_foro/mensajes_foro/:id_mensaje', actualizarMensajeForo);
router.delete('/:id_foro/mensajes_foro/:id_mensaje', eliminarMensajeForo);

module.exports = router;