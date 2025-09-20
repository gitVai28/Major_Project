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
  // Profile photo
  profilePhoto: {
    type: DataTypes.STRING,  // image path or URL
    allowNull: true
  },
  // Current year of study
  currentYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 4
    },
    defaultValue: null // ✅ default is null until user sets it
  },
  // Average rating across events
  averageRating: {
    type: DataTypes.FLOAT,
    allowNull: true, // can be null until first rating is given
    validate: {
      min: 0,
      max: 5
    },
    defaultValue: null
  },
  // ✅ Department field
  department: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }

}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;