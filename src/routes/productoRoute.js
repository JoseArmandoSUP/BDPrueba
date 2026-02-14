const express = require('express');
const {poblarProductos, buscarCoincidenciasEnElNombre, buscarProductosDeCategoria, buscador} = require('../controllers/externalController');
const router = express.Router();

router.post('/poblar', poblarProductos);
router.get('/mostrar/:coincidencia', buscarCoincidenciasEnElNombre);
router.get('/categoria/:cat', buscarProductosDeCategoria);


//Practica 2.2 Buscardor Inteligente
router.get('/search', buscador);

module.exports = router;