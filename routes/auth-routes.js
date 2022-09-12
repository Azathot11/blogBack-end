const express = require('express');

const authControllers = require('../controllers/auth');

const router = express.Router();


router.post('/signIn',authControllers.signIn);

module.exports = router;