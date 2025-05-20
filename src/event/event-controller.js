const Event = require("../models/Event");

exports.getAllEvent = async () => {
  return Event;
};

exports.getEventById = async (id) => {
  return Event.find(e => e.id === id);
};

exports.createEvent = async (data) => {
  const newEvent = {
    id: Event.length + 1,
    ...data,
    participants: []
  };
  Event.push(newEvent);
  return newEvent;
};

exports.updateEvent = async (id, newData) => {
  const index = Event.findIndex(e => e.id === id);
  if (index === -1) return null;

  Event[index] = { ...Event[index], ...newData };
  return Event[index];
};

exports.deleteEvent = async (id) => {
  const index = Event.findIndex(e => e.id === id);
  if (index === -1) return null;

  const deleted = Event.splice(index, 1);
  return deleted[0];
};