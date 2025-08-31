const express = require('express');
require('dotenv').config();
const app = express();
const expenseRoutes = require('./routes/expenseRoutes');

app.use(express.json());
app.use('/expenses', expenseRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Expense service running on port ${PORT}`));
    