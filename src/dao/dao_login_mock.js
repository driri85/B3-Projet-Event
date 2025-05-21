const user = require('../models/user');

class DAOMongo {
    async findAll() {
        return await user.find();
    }

    async findById(id) {
        return await user.findById(id);
    }

    async findByEmail(email) {
        return await user.findOne({ email });
    }

    async create(data) {
        const user = new user(data);
        return await user.save();
    }

    async update(id, data) {
        return await user.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await user.findByIdAndDelete(id);
    }
}

module.exports = DAOMongo;
