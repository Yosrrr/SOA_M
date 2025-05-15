const mongoose = require('mongoose');

const perfumeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    fragranceNotes: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Perfume', perfumeSchema);