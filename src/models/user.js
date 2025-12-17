const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
