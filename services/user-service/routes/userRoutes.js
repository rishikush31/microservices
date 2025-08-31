const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('@paye/auth-middleware');

router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
