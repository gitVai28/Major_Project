const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Last date to register
  lastDateToRegister: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Organizer reference
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Use table name instead of model reference
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  // Event banner photo (path or URL)
  banner: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event;