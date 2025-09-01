// models/event.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../core/postgres');
const User = require('./user');

const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

// Many-to-Many relation between Events and Users
Event.belongsToMany(User, { through: 'EventParticipants' });
User.belongsToMany(Event, { through: 'EventParticipants' });

module.exports = Event;
