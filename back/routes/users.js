const express = require('express');
const { signup, login, getUserData } = require('../controllers/userController');
const router = express.Router();

// User routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', getUserData);

module.exports = router;
