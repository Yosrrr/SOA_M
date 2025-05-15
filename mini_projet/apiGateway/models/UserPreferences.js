const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    notes: [String],
    season: { type: String },
    emotion: { type: String },
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);