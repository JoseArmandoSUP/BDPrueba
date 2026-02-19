const express = require('express');
const router = express.Router();
const authControllee = require('../controllers/authController');

router.post('/register', authControllee.register);
// router.post('/login', authContorllee.login);

module.exports = router;