const User = require('../models/User');

class DAOMongo {
    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async create(data) {
        const user = new User(data);
        return await user.save();
    }

    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = DAOMongo;
