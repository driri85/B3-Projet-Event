const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    participants: { type: [String], required: true },
});

module.exports = mongoose.model('Event', eventSchema);
