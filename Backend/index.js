const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');
// index.js
const cors = require('cors');



const app = express();
app.use(express.json());
app.use(cors());

// ------------------ Import Routes ------------------
const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');

// ------------------ Use Routes ------------------
app.use('/api/home', homeRoutes); // all home routes prefixed with /api/home
app.use('/api/users', userRoutes); // all user routes prefixed with /api/users

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// ------------------ Sync Sequelize models ------------------
sequelize.sync({ alter: true }) // use { force: true } only in dev to drop tables
  .then(() => console.log('All models synced'))
  .catch(err => console.error('Error syncing models:', err));

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
