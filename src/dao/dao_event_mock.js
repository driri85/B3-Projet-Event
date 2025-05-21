const Event = require('../models/event');

class DAOMongo {
  async findAll() {
    return await Event.find();
  }

  async findById(id) {
    return await Event.findById(id);
  }

  async findByEmail(email) {
    return await Event.findOne({ email });
  }

  async create(data) {
    const newEvent = new Event(data);
    return await newEvent.save();
  }

  async update(id, data) {
    return await Event.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await Event.findByIdAndDelete(id);
  }

  async registerUser(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Événement introuvable");
    }

    const userIdStr = userId.toString();
    const isAlreadyRegistered = event.participants.some(p => p.toString() === userIdStr);

    if (isAlreadyRegistered) {
      throw new Error("Utilisateur déjà inscrit");
    }

    if (event.participants.length >= event.capacity) {
      throw new Error("Capacité maximale atteinte");
    }

    event.participants.push(userId);
    return await event.save();
  }

  async unregisterUser(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Événement introuvable");
    }

    const userIdStr = userId.toString();
    const index = event.participants.findIndex(p => p.toString() === userIdStr);

    if (index === -1) {
      throw new Error("Utilisateur non inscrit");
    }

    event.participants.splice(index, 1);
    return await event.save();
  }

}

module.exports = DAOMongo;
