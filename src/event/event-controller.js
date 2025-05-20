const { events } = require("./event.model");

exports.getAllEvents = async () => {
  return events;
};

exports.getEventById = async (id) => {
  return events.find(e => e.id === id);
};

exports.createEvent = async (data) => {
  const newEvent = {
    id: events.length + 1,
    ...data,
    participants: []
  };
  events.push(newEvent);
  return newEvent;
};

exports.updateEvent = async (id, newData) => {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return null;

  events[index] = { ...events[index], ...newData };
  return events[index];
};

exports.deleteEvent = async (id) => {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return null;

  const deleted = events.splice(index, 1);
  return deleted[0];
};