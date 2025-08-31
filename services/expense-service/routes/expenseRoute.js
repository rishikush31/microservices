const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('@paye/auth-middleware');

router.post('/', authMiddleware, expenseController.createExpense);
router.get('/', authMiddleware, expenseController.getMyExpenses);

module.exports = router;
