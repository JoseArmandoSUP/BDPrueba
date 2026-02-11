const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.getProducto);

router.post('/', productoController.createProducto);

router.put('/:id', productoController.actualizarProducto);

router.delete('/:id', productoController.borrarProducto);

module.exports = router;