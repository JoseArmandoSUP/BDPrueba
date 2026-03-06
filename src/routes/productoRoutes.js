const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const middleware = require('../middleware/authmiddleware');

router.get('/', middleware, productoController.getProducto);

router.post('/', middleware, productoController.createProducto);

router.put('/:id', middleware, productoController.actualizarProducto);

router.delete('/:id', middleware, productoController.borrarProducto);

module.exports = router;