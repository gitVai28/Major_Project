const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Role flags
  isParticipant: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isOrganizer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Skills & Interests
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  // Email verification
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // New field
  profilePhoto: {
    type: DataTypes.STRING,  // image path or URL
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
});
module.exports = User;