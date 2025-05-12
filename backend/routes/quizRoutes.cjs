const express = require('express');
const router = express.Router();
const {
  crearQuiz,
  obtenerQuizzes,
  obtenerQuiz,
  actualizarQuiz,
  eliminarQuiz
} = require('../controllers/QuizController.cjs');

router.post('/', crearQuiz);
router.get('/', obtenerQuizzes);
router.get('/:id_quiz', obtenerQuiz);
router.put('/:id_quiz', actualizarQuiz);
router.delete('/:id_quiz', eliminarQuiz);

module.exports = router;