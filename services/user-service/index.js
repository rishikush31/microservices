const express = require('express');
const app = express();
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
