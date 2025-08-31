const express = require('express');
require('dotenv').config();
const app = express();
const notificationRoutes = require('./routes/notificationRoutes');

app.use(express.json());
app.use('/notifications', notificationRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Notification service running on port ${PORT}`));
