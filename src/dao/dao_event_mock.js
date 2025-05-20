const Event = require('../models/Event');

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
        const Event = new Event(data);
        return await Event.save();
    }

    async update(id, data) {
        return await Event.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Event.findByIdAndDelete(id);
    }
}

module.exports = DAOMongo;
