const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('@paye/auth-middleware');

router.get('/', authMiddleware, notificationController.getNotifications);
router.put('/:notificationId/ack', authMiddleware, notificationController.acknowledgeNotification);

module.exports = router;
