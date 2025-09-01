const Event = require('../models/event');
const User = require('../models/user');

class EventDAO {
  async findAll() {
    return await Event.findAll({ include: User });
  }

  async findById(id) {
    return await Event.findByPk(id, { include: User });
  }

  async create(data) {
    return await Event.create(data);
  }

  async update(id, data) {
    const event = await Event.findByPk(id);
    if (!event) return null;
    return await event.update(data);
  }

  async delete(id) {
    const event = await Event.findByPk(id);
    if (!event) return null;
    return await event.destroy();
  }

  async registerUser(eventId, userId) {
    const event = await Event.findByPk(eventId);
    const user = await User.findByPk(userId);
    if (!event || !user) throw new Error("Not found");

    const participants = await event.getUsers();
    if (participants.length >= event.capacity) {
      throw new Error("Capacité maximale atteinte");
    }
    if (participants.some(u => u.id === user.id)) {
      throw new Error("Utilisateur déjà inscrit");
    }

    await event.addUser(user);
    return event;
  }

  async unregisterUser(eventId, userId) {
    const event = await Event.findByPk(eventId);
    const user = await User.findByPk(userId);
    if (!event || !user) throw new Error("Not found");

    await event.removeUser(user);
    return event;
  }
}

module.exports = EventDAO;
