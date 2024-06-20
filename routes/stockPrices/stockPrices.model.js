const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stock: { type: String, required: true, unique: true },
    price: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Stock', stockSchema);