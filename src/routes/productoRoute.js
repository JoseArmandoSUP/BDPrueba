const express = require('express');
const {poblarProductos, buscarCoincidenciasEnElNombre, buscarProductosDeCategoria} = require('../controllers/externalController');
const router = express.Router();

router.post('/poblar', poblarProductos);
router.get('/mostrar/:coincidencia', buscarCoincidenciasEnElNombre);
router.get('/categoria/:cat', buscarProductosDeCategoria)

module.exports = router;