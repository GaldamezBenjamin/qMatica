const express = require('express');
const router = express.Router();
const {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  crearIntentoQuiz,
  obtenerIntentosQuiz,
  obtenerIntentoQuiz,
  actualizarIntentoQuiz,
  eliminarIntentoQuiz
} = require('../controllers/UsuarioController.cjs');

router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:uid', obtenerUsuario);
router.put('/:uid', actualizarUsuario);
router.delete('/:uid', eliminarUsuario);

// Rutas para la subcolección Intentos_Quiz
router.post('/:uid/intentos_quiz', crearIntentoQuiz);
router.get('/:uid/intentos_quiz', obtenerIntentosQuiz);
router.get('/:uid/intentos_quiz/:id_intento', obtenerIntentoQuiz);
router.put('/:uid/intentos_quiz/:id_intento', actualizarIntentoQuiz);
router.delete('/:uid/intentos_quiz/:id_intento', eliminarIntentoQuiz);

module.exports = router;