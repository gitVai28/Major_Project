// models/associations.js
const User = require('./User');
const Event = require('./Event');
const Registration = require('./Registration');
const EventRating = require('./EventRating'); // ✅ import EventRating

// Define all associations in one place to avoid circular dependencies

// User-Event relationship through Registration (Many-to-Many)
User.belongsToMany(Event, { 
  through: Registration, 
  foreignKey: "userId", 
  as: "events" 
});

Event.belongsToMany(User, { 
  through: Registration, 
  foreignKey: "eventId", 
  as: "participants" 
});

// User-Event relationship for organizers (One-to-Many)
User.hasMany(Event, { 
  foreignKey: 'organizerId', 
  as: 'organizedEvents' 
});

Event.belongsTo(User, { 
  foreignKey: 'organizerId', 
  as: 'organizer' 
});

// Registration associations
Registration.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

Registration.belongsTo(Event, { 
  foreignKey: 'eventId', 
  as: 'event' 
});

User.hasMany(Registration, { 
  foreignKey: 'userId', 
  as: 'registrations' 
});

Event.hasMany(Registration, { 
  foreignKey: 'eventId', 
  as: 'registrations' 
});

// --------------------
// New Associations for Ratings
// --------------------

// Each event can have many ratings
Event.hasMany(EventRating, { foreignKey: 'eventId', as: 'ratings', onDelete: 'CASCADE' });
EventRating.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Each user (participant) can have many ratings
User.hasMany(EventRating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
EventRating.belongsTo(User, { foreignKey: 'userId', as: 'participant' });


module.exports = {
  User,
  Event,
  Registration,
  EventRating
};