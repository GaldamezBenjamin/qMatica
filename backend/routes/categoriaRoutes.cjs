const express = require('express');
const router = express.Router();
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  eliminarCategoria
} = require('../controllers/CategoriaController.cjs');

router.post('/', crearCategoria);
router.get('/', obtenerCategorias);
router.get('/:id_categoria', obtenerCategoria);
router.put('/:id_categoria', actualizarCategoria);
router.delete('/:id_categoria', eliminarCategoria);

module.exports = router;