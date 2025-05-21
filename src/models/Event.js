const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    capacity: { type: Number, required: true }
});

module.exports = mongoose.model('Event', eventSchema);

