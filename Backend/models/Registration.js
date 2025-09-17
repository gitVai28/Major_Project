const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Registration = sequelize.define("Registration", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    }
  }
}, {
  tableName: 'registrations',
  timestamps: true
});

module.exports = Registration;