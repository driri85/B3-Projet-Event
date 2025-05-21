const event = require('../models/event');

class DAOMongo {
    async findAll() {
        return await event.find();
    }

    async findById(id) {
        return await event.findById(id);
    }

    async findByEmail(email) {
        return await event.findOne({ email });
    }

    async create(data) {
        const newevent = new event(data);
        return await newevent.save();
    }

    async update(id, data) {
        return await event.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await event.findByIdAndDelete(id);
    }
}

module.exports = DAOMongo;
