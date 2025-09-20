const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const EventRating = sequelize.define('EventRating', {
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0, max: 5 }
  }
}, {
  tableName: 'event_ratings',
  timestamps: true
});



module.exports = EventRating;
