const express = require('express');
require('dotenv').config();
const cors = require('cors');
const sequelize = require('./config/db');

// Import associations to set up all model relationships
require('./models/associations');

const app = express();

// ------------------ Middleware ------------------
app.use(express.json());
app.use(cors());

// ------------------ Import Routes ------------------
const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ------------------ Use Routes ------------------
app.use('/api/home', homeRoutes); // all home routes prefixed with /api/home
app.use('/api/users', userRoutes); // all user routes prefixed with /api/users
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/messages", messageRoutes);

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